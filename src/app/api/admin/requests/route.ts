import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    console.log('📋 API: Fetching registration requests');
    const { data: requests, error } = await supabase
      .from('registration_requests')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('💥 Error fetching requests:', error);
      return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
    
    console.log('✅ API: Found requests:', requests?.length || 0);
    return NextResponse.json({ success: true, requests: requests || [] });
  } catch (error) {
    console.error('💥 Error fetching requests:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { email, password, name } = await request.json();
    console.log('📝 API: Creating registration request for:', email);
    
    const { data: existingProfile } = await supabase
      .from('profiles')
      .select('id')
      .eq('email', email)
      .single();
    
    if (existingProfile) {
      console.log('❌ API: User already exists:', email);
      return NextResponse.json({ error: 'User already exists' }, { status: 400 });
    }
    
    const { data: existingRequest } = await supabase
      .from('registration_requests')
      .select('id')
      .eq('email', email)
      .single();
    
    if (existingRequest) {
      console.log('❌ API: Registration request already exists:', email);
      return NextResponse.json({ error: 'Registration request already exists' }, { status: 400 });
    }
    
    const { data: newRequest, error: insertError } = await supabase
      .from('registration_requests')
      .insert({ email, password, name })
      .select()
      .single();
    
    if (insertError) {
      console.error('💥 Error creating request:', insertError);
      return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
    
    console.log('✅ API: Registration request created:', newRequest.id);
    return NextResponse.json(newRequest, { status: 201 });
  } catch (error) {
    console.error('💥 Error creating request:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}