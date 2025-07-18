import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const requests = await db.registrationRequest.findMany();
    return NextResponse.json({ success: true, requests });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Помилка сервера' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { action, requestId } = await request.json();
    
    if (action === 'approve') {
      const requests = await db.registrationRequest.findMany();
      const requestToApprove = requests.find(req => req.id === requestId);
      
      if (!requestToApprove) {
        return NextResponse.json({ success: false, message: 'Запит не знайдено' }, { status: 404 });
      }
      
      await db.user.create({
        data: {
          email: requestToApprove.email,
          password: requestToApprove.password,
          name: requestToApprove.name,
          role: 'user',
          isApproved: true
        }
      });
      
      await db.registrationRequest.delete({
        where: { id: requestId }
      });
      
      return NextResponse.json({ success: true, message: 'Запит підтверджено' });
    } else if (action === 'reject') {
      await db.registrationRequest.delete({
        where: { id: requestId }
      });
      
      return NextResponse.json({ success: true, message: 'Запит відхилено' });
    }
    
    return NextResponse.json({ success: false, message: 'Невідома дія' }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Помилка сервера' }, { status: 500 });
  }
}