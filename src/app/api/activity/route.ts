import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export async function PATCH(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '');
    
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const { data: { user: authUser }, error: authError } = await supabaseAdmin.auth.getUser(token);
    
    if (authError || !authUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const { error: updateError } = await supabaseAdmin
      .from('profiles')
      .update({
        last_seen: new Date().toISOString(),
        is_active: true
      })
      .eq('id', authUser.id);
    
    if (updateError) {
      console.error('Error updating activity:', updateError);
      return NextResponse.json({ success: false, message: 'Failed to update activity' }, { status: 500 });
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in activity endpoint:', error);
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '');
    
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const { data: { user: authUser }, error: authError } = await supabaseAdmin.auth.getUser(token);
    
    if (authError || !authUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('profiles')
      .select('last_seen, is_active')
      .eq('id', authUser.id)
      .single();
    
    if (profileError) {
      console.error('Error fetching activity:', profileError);
      return NextResponse.json({ success: false, message: 'Failed to fetch activity' }, { status: 500 });
    }
    
    return NextResponse.json({
      success: true,
      last_seen: profile?.last_seen,
      is_active: profile?.is_active || false
    });
  } catch (error) {
    console.error('Error in activity GET endpoint:', error);
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}
