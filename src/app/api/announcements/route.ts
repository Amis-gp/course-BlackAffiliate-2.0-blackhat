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
    console.log('[API] POST /api/announcements - Request received');
    
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '');
    
    if (!token) {
      console.log('[API] No token provided');
      return NextResponse.json(
        { success: false, message: 'Not authenticated' },
        { status: 401 }
      );
    }

    const { data: { user }, error: userError } = await supabaseAdmin.auth.getUser(token);
    
    if (userError || !user) {
      console.log('[API] Auth error:', userError?.message);
      return NextResponse.json(
        { success: false, message: 'Not authenticated' },
        { status: 401 }
      );
    }

    console.log('[API] User authenticated:', user.email);

    const { data: userData } = await supabaseAdmin
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (!userData || userData.role !== 'admin') {
      console.log('[API] User is not admin. Role:', userData?.role);
      return NextResponse.json(
        { success: false, message: 'Unauthorized - Admin only' },
        { status: 403 }
      );
    }

    console.log('[API] User is admin, proceeding...');

    const body = await request.json();
    console.log('[API] Request body:', { title: body.title, content: body.content?.substring(0, 50), has_image: !!body.image_url });
    
    const { title, content } = body as { title?: string; content?: string; image_url?: string };
    let { image_url } = body as { image_url?: string };

    if (!title || !content) {
      console.log('[API] Missing required fields');
      return NextResponse.json(
        { success: false, message: 'Title and content are required' },
        { status: 400 }
      );
    }

    // normalize image url server-side as well
    if (image_url) {
      image_url = image_url.trim();
      image_url = image_url.replace(/^[^A-Za-z/]+/, '');
      if (
        image_url &&
        !image_url.startsWith('http://') &&
        !image_url.startsWith('https://') &&
        !image_url.startsWith('/')
      ) {
        image_url = `https://${image_url}`;
      }
    }

    console.log('[API] Inserting into database...');

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
      console.error('[API] Database error:', error);
      throw error;
    }

    console.log('[API] Announcement created successfully:', announcement.id);

    return NextResponse.json({
      success: true,
      announcement
    });
  } catch (error) {
    console.error('[API] Error creating announcement:', error);
    const message = (error as any)?.message || 'Failed to create announcement';
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}

