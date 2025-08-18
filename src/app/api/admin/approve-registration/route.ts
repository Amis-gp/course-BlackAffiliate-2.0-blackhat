import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export async function POST(request: NextRequest) {
  try {
    const { requestId } = await request.json();
    console.log('🔍 Approve Registration: Request ID:', requestId);

    if (!requestId) {
      return NextResponse.json({ success: false, message: 'Request ID is required' }, { status: 400 });
    }

    // 1. Fetch the registration request
    const { data: registrationRequest, error: requestError } = await supabaseAdmin
      .from('registration_requests')
      .select('*')
      .eq('id', requestId)
      .single();

    console.log('📋 Registration request:', registrationRequest);
    console.log('❌ Request error:', requestError);

    if (requestError || !registrationRequest) {
      return NextResponse.json({ success: false, message: 'Registration request not found' }, { status: 404 });
    }

    // 2. Check if user already exists, if not create new user
    console.log('👤 Checking/creating user with email:', registrationRequest.email);
    
    let authUser;
    
    // First try to get existing user
    const { data: usersList } = await supabaseAdmin.auth.admin.listUsers();
    const existingUser = usersList?.users?.find(user => user.email === registrationRequest.email);
    
    if (existingUser) {
      console.log('✅ Using existing user:', existingUser.id);
      authUser = { user: existingUser };
    } else {
      // Create new user if doesn't exist
      const { data: newUser, error: authError } = await supabaseAdmin.auth.admin.createUser({
        email: registrationRequest.email,
        password: registrationRequest.password,
        email_confirm: true
      });
      
      if (authError || !newUser.user) {
        console.error('💥 Error creating user:', authError);
        return NextResponse.json({ success: false, message: authError?.message || 'Error creating user' }, { status: 500 });
      }
      
      console.log('✅ New user created:', newUser.user.id);
      authUser = newUser;
    }

    // 3. Create or update profile in public.profiles
    const userId = authUser.user?.id;
    if (!userId) {
      return NextResponse.json({ success: false, message: 'User ID not found' }, { status: 500 });
    }
    
    const { error: profileError } = await supabaseAdmin
      .from('profiles')
      .upsert([
        {
          id: userId,
          email: registrationRequest.email,
          name: registrationRequest.name,
          role: 'user',
          is_approved: true,
        }
      ], { onConflict: 'id' });

    if (profileError) {
      return NextResponse.json({ success: false, message: profileError.message || 'Error creating profile' }, { status: 500 });
    }

    // 4. Delete the registration request
    const { error: deleteError } = await supabaseAdmin
      .from('registration_requests')
      .delete()
      .eq('id', requestId);

    if (deleteError) {
      console.error('Error deleting registration request:', deleteError);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Approval error:', error);
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}