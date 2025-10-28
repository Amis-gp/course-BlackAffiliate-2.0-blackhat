import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '');
    
    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Not authenticated' },
        { status: 401 }
      );
    }

    const { data: { user }, error: userError } = await supabaseAdmin.auth.getUser(token);
    
    if (userError || !user) {
      return NextResponse.json(
        { success: false, message: 'Not authenticated' },
        { status: 401 }
      );
    }

    const { data: announcements, error: announcementsError } = await supabaseAdmin
      .from('announcements')
      .select('*')
      .order('created_at', { ascending: false });

    if (announcementsError) {
      throw announcementsError;
    }

    const { data: readStatuses, error: readError } = await supabaseAdmin
      .from('user_read_announcements')
      .select('announcement_id')
      .eq('user_id', user.id);

    if (readError) {
      throw readError;
    }

    const readAnnouncementIds = new Set(
      readStatuses?.map(r => r.announcement_id) || []
    );

    const announcementsWithStatus = announcements?.map(announcement => ({
      ...announcement,
      is_read: readAnnouncementIds.has(announcement.id)
    })) || [];

    return NextResponse.json({
      success: true,
      announcements: announcementsWithStatus,
      unread_count: announcementsWithStatus.filter(a => !a.is_read).length
    });
  } catch (error) {
    console.error('Error fetching announcements:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch announcements' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '');
    
    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Not authenticated' },
        { status: 401 }
      );
    }

    const { data: { user }, error: userError } = await supabaseAdmin.auth.getUser(token);
    
    if (userError || !user) {
      return NextResponse.json(
        { success: false, message: 'Not authenticated' },
        { status: 401 }
      );
    }

    const { data: userData } = await supabaseAdmin
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (!userData || userData.role !== 'admin') {
      return NextResponse.json(
        { success: false, message: 'Unauthorized - Admin only' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { title, content, image_url } = body;

    if (!title || !content) {
      return NextResponse.json(
        { success: false, message: 'Title and content are required' },
        { status: 400 }
      );
    }

    const { data: announcement, error } = await supabaseAdmin
      .from('announcements')
      .insert({
        title,
        content,
        image_url: image_url || null,
        created_by: user.id
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json({
      success: true,
      announcement
    });
  } catch (error) {
    console.error('Error creating announcement:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to create announcement' },
      { status: 500 }
    );
  }
}

