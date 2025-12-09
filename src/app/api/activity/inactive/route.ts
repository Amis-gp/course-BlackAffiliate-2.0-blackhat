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
      .update({ is_active: false })
      .eq('id', authUser.id);
    
    if (updateError) {
      console.error('Error marking inactive:', updateError);
      return NextResponse.json({ success: false, message: 'Failed to update activity' }, { status: 500 });
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in inactive endpoint:', error);
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}
