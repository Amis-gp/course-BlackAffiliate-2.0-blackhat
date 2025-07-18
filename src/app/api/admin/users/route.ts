import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const users = await db.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        lastLogin: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    
    return NextResponse.json({ success: true, users });
  } catch (error) {
    console.error('Помилка отримання користувачів:', error);
    return NextResponse.json({ success: false, message: 'Помилка сервера' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { email, password, role } = await request.json();
    
    const existingUser = await db.user.findUnique({
      where: { email }
    });
    
    if (existingUser) {
      return NextResponse.json({ success: false, message: 'Користувач з таким email вже існує' }, { status: 400 });
    }
    
    const newUser = await db.user.create({
      data: {
        email,
        password,
        role: role || 'user'
      }
    });
    
    return NextResponse.json({ 
      success: true, 
      message: 'Користувача створено',
      user: {
        id: newUser.id,
        email: newUser.email,
        role: newUser.role,
        createdAt: newUser.createdAt
      }
    });
  } catch (error) {
    console.error('Помилка створення користувача:', error);
    return NextResponse.json({ success: false, message: 'Помилка сервера' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('id');
    
    if (!userId) {
      return NextResponse.json({ success: false, message: 'ID користувача не вказано' }, { status: 400 });
    }
    
    await db.user.delete({
      where: { id: userId }
    });
    
    return NextResponse.json({ success: true, message: 'Користувача видалено' });
  } catch (error) {
    console.error('Помилка видалення користувача:', error);
    return NextResponse.json({ success: false, message: 'Помилка сервера' }, { status: 500 });
  }
}