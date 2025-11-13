import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export async function POST(
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

    const { data: existing } = await supabaseAdmin
      .from('user_read_announcements')
      .select('id')
      .eq('user_id', user.id)
      .eq('announcement_id', id)
      .single();

    if (existing) {
      return NextResponse.json({
        success: true,
        message: 'Already marked as read'
      });
    }

    const { error } = await supabaseAdmin
      .from('user_read_announcements')
      .insert({
        user_id: user.id,
        announcement_id: id
      });

    if (error) {
      throw error;
    }

    return NextResponse.json({
      success: true,
      message: 'Marked as read successfully'
    });
  } catch (error) {
    console.error('Error marking announcement as read:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to mark as read' },
      { status: 500 }
    );
  }
}

