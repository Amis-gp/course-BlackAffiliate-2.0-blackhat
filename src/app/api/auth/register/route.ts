import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export async function POST(request: NextRequest) {
  try {
    const { email, password, name } = await request.json();
    
    const { data: existingProfile } = await supabaseAdmin
      .from('profiles')
      .select('id')
      .eq('email', email)
      .single();
    
    if (existingProfile) {
      return NextResponse.json({ success: false, message: 'User with this email already exists' }, { status: 400 });
    }
    
    const { data: existingRequest, error: requestError } = await supabaseAdmin
      .from('registration_requests')
      .select('*')
      .eq('email', email)
      .single();
    
    if (!requestError && existingRequest) {
      return NextResponse.json({ success: true, message: 'Request already exists' });
    }
    
    const { data: newRequest, error: insertError } = await supabaseAdmin
      .from('registration_requests')
      .insert({
        email,
        password,
        name: name || email.split('@')[0]
      })
      .select()
      .single();
    
    if (insertError) {
      console.error('Error creating registration request:', insertError);
      return NextResponse.json({ success: false, message: 'Failed to create registration request' }, { status: 500 });
    }
    
    return NextResponse.json({ success: true, request: newRequest });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}