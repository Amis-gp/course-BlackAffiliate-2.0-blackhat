import { NextResponse } from 'next/server';
import { initializeDatabase } from '@/lib/db';

export async function POST() {
  try {
    await initializeDatabase();
    return NextResponse.json({ success: true, message: 'База даних ініціалізована' });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Помилка ініціалізації' }, { status: 500 });
  }
}