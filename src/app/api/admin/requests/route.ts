import { NextRequest, NextResponse } from 'next/server';
import { db, initializeDatabase } from '@/lib/db';

export async function GET() {
  try {
    // Initialize database for Netlify
    await initializeDatabase();
    
    console.log('📋 API: Fetching registration requests');
    const requests = await db.registrationRequest.findMany();
    console.log('✅ API: Found requests:', requests.length);
    return NextResponse.json({ success: true, requests });
  } catch (error) {
    console.error('💥 Error fetching requests:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    // Initialize database for Netlify
    await initializeDatabase();
    
    const { email, password, name } = await request.json();
    console.log('📝 API: Creating registration request for:', email);
    
    // Check if user already exists
    const existingUser = await db.user.findUnique({ where: { email } });
    if (existingUser) {
      console.log('❌ API: User already exists:', email);
      return NextResponse.json({ error: 'User already exists' }, { status: 400 });
    }
    
    // Check if request already exists
    const existingRequest = await db.registrationRequest.findFirst({ where: { email } });
    if (existingRequest) {
      console.log('❌ API: Registration request already exists:', email);
      return NextResponse.json({ error: 'Registration request already exists' }, { status: 400 });
    }
    
    const newRequest = await db.registrationRequest.create({
      data: { email, password, name }
    });
    
    console.log('✅ API: Registration request created:', newRequest.id);
    return NextResponse.json(newRequest, { status: 201 });
  } catch (error) {
    console.error('💥 Error creating request:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}