import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const user = await db.user.findFirst({ where: { id } });

    if (user) {
      console.log('API: User found:', user);
      return NextResponse.json(user);
    } else {
      console.log('API: User not found');
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}