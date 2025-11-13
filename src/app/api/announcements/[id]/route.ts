import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
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
    const { title, content } = body as { title?: string; content?: string; image_url?: string };
    let { image_url } = body as { image_url?: string };

    if (!title || !content) {
      return NextResponse.json(
        { success: false, message: 'Title and content are required' },
        { status: 400 }
      );
    }

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

    const { data: announcement, error } = await supabaseAdmin
      .from('announcements')
      .update({
        title,
        content,
        image_url: image_url || null,
      })
      .eq('id', id)
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
    console.error('Error updating announcement:', error);
    const message = (error as any)?.message || 'Failed to update announcement';
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    console.log('[API] DELETE /api/announcements/' + id);
    
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '');
    
    if (!token) {
      console.log('[API] No token provided for DELETE');
      return NextResponse.json(
        { success: false, message: 'Not authenticated' },
        { status: 401 }
      );
    }

    const { data: { user }, error: userError } = await supabaseAdmin.auth.getUser(token);
    
    if (userError || !user) {
      console.log('[API] Auth error for DELETE:', userError?.message);
      return NextResponse.json(
        { success: false, message: 'Not authenticated' },
        { status: 401 }
      );
    }

    console.log('[API] DELETE - User authenticated:', user.email);

    const { data: userData } = await supabaseAdmin
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (!userData || userData.role !== 'admin') {
      console.log('[API] DELETE - User is not admin');
      return NextResponse.json(
        { success: false, message: 'Unauthorized - Admin only' },
        { status: 403 }
      );
    }

    console.log('[API] Deleting announcement from database...');

    const { error } = await supabaseAdmin
      .from('announcements')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('[API] Database error on DELETE:', error);
      throw error;
    }

    console.log('[API] Announcement deleted successfully');

    return NextResponse.json({
      success: true,
      message: 'Announcement deleted successfully'
    });
  } catch (error) {
    console.error('[API] Error deleting announcement:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to delete announcement' },
      { status: 500 }
    );
  }
}

