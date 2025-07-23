import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const { email, password, name } = await request.json();
    
    const existingUser = await db.user.findFirst({
      where: { email }
    });
    
    if (existingUser) {
      return NextResponse.json({ success: false, message: 'User with this email already exists' }, { status: 400 });
    }
    
    const requests = await db.registrationRequest.findMany();
    const existingRequest = requests.find(req => req.email === email);
    
    if (existingRequest) {
      return NextResponse.json({ success: true, message: 'Request already exists' });
    }
    
    const newRequest = await db.registrationRequest.create({
      data: {
        email,
        password,
        name: name || email.split('@')[0]
      }
    });
    
    return NextResponse.json({ success: true, request: newRequest });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}