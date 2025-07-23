import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(request: NextRequest) {
  console.log('🔐 API Login: Request received');
  
  try {
    const { email, password } = await request.json();
    console.log('📝 API Login: Credentials received', { email, passwordLength: password?.length });
    
    console.log('🔍 API Login: Searching for user in database');
    const user = await db.user.findFirst({
      where: { email }
    });
    
    if (!user) {
      console.log('❌ API Login: User not found, checking registration requests');
      const registrationRequest = await db.registrationRequest.findFirst({
        where: { email }
      });
      
      if (registrationRequest) {
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
      
      console.log('❌ API Login: No user or registration request found');
      const response = { success: false, message: 'User with this email not found' };
      console.log('📤 API Login: Returning not found response:', response);
      return NextResponse.json(response, { status: 401 });
    }
    
    console.log('👤 API Login: User found, checking password');
    if (user.password !== password) {
      console.log('❌ API Login: Wrong password for existing user');
      const response = { success: false, message: 'Incorrect password' };
      console.log('📤 API Login: Returning wrong password response:', response);
      return NextResponse.json(response, { status: 401 });
    }
    
    console.log('✅ API Login: Login successful');
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