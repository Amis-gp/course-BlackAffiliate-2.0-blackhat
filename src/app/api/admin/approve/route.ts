import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export async function POST(request: NextRequest) {
  try {
    const { requestId } = await request.json();
    
    const { data: requestToApprove, error: fetchError } = await supabaseAdmin
      .from('registration_requests')
      .select('*')
      .eq('id', requestId)
      .single();
    
    if (fetchError || !requestToApprove) {
      return NextResponse.json({ success: false, message: 'Request not found' }, { status: 404 });
    }
    
    const { data: authUser, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: requestToApprove.email,
      password: requestToApprove.password,
      email_confirm: true
    });
    
    if (authError || !authUser.user) {
      console.error('Error creating user:', authError);
      return NextResponse.json({ success: false, message: 'Failed to create user' }, { status: 500 });
    }
    
    const { error: profileError } = await supabaseAdmin
      .from('profiles')
      .insert({
        id: authUser.user.id,
        email: requestToApprove.email,
        name: requestToApprove.name,
        role: 'user',
        is_approved: true
      });
    
    if (profileError) {
      console.error('Error creating profile:', profileError);
      await supabaseAdmin.auth.admin.deleteUser(authUser.user.id);
      return NextResponse.json({ success: false, message: 'Failed to create user profile' }, { status: 500 });
    }
    
    const { error: deleteError } = await supabaseAdmin
      .from('registration_requests')
      .delete()
      .eq('id', requestId);
    
    if (deleteError) {
      console.error('Error deleting registration request:', deleteError);
    }
    
    return NextResponse.json({ 
      success: true, 
      message: 'Request approved',
      request: requestToApprove
    });
  } catch (error) {
    console.error('Approval error:', error);
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}