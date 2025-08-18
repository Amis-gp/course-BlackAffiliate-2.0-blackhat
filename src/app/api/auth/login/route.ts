import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  console.log('🔐 API Login: Request received');
  
  try {
    const { email, password } = await request.json();
    console.log('📝 API Login: Credentials received', { email, passwordLength: password?.length });
    
    console.log('🔍 API Login: Attempting Supabase authentication');
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    if (authError) {
      console.log('❌ API Login: Authentication failed:', authError.message);
      
      if (authError.message.includes('Invalid login credentials')) {
        console.log('🔍 API Login: Checking registration requests');
        const { data: registrationRequest, error: requestError } = await supabase
          .from('registration_requests')
          .select('*')
          .eq('email', email)
          .single();
        
        if (!requestError && registrationRequest) {
          console.log('📋 API Login: Registration request found');
          if (registrationRequest.password === password) {
            console.log('⏳ API Login: Password matches, account pending approval');
            const response = { 
              success: false, 
              message: 'Your account has not been approved by the administrator yet', 
              isPending: true,
              requestId: registrationRequest.id
            };
            console.log('📤 API Login: Returning pending response:', response);
            return NextResponse.json(response, { status: 403 });
          } else {
            console.log('❌ API Login: Wrong password for registration request');
            const response = { success: false, message: 'Incorrect password for registration request' };
            console.log('📤 API Login: Returning error response:', response);
            return NextResponse.json(response, { status: 401 });
          }
        }
      }
      
      console.log('❌ API Login: Authentication error');
      const response = { success: false, message: 'Invalid email or password' };
      console.log('📤 API Login: Returning auth error response:', response);
      return NextResponse.json(response, { status: 401 });
    }
    
    if (!authData.user) {
      console.log('❌ API Login: No user data returned');
      return NextResponse.json({ success: false, message: 'Authentication failed' }, { status: 401 });
    }
    
    console.log('👤 API Login: Getting user profile');
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', authData.user.id)
      .single();
    
    if (profileError || !profile) {
      console.log('❌ API Login: Profile not found or not approved');
      return NextResponse.json({ success: false, message: 'Account not approved' }, { status: 403 });
    }
    
    if (!profile.is_approved) {
      console.log('❌ API Login: Account not approved');
      return NextResponse.json({ success: false, message: 'Account not approved by administrator' }, { status: 403 });
    }
    
    console.log('✅ API Login: Login successful');
    const user = {
      id: profile.id,
      email: profile.email,
      name: profile.name,
      role: profile.role
    };
    const response = { success: true, user };
    console.log('📤 API Login: Returning success response');
    return NextResponse.json(response);
  } catch (error) {
    console.error('💥 API Login: Server error:', error);
    const response = { success: false, message: 'Server error' };
    console.log('📤 API Login: Returning server error response:', response);
    return NextResponse.json(response, { status: 500 });
  }
}