import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

const TELEGRAM_BOT_TOKEN = process.env.NEXT_PUBLIC_TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.NEXT_PUBLIC_TELEGRAM_CHAT_ID;

export async function POST(request: NextRequest) {
  console.log('--- REMIND API CALLED ---');
  try {
    const { requestId } = await request.json();
    console.log('Received requestId:', requestId);
    
    const registrationRequest = await db.registrationRequest.findUnique({
      where: { id: requestId }
    });
    
    if (!registrationRequest) {
      return NextResponse.json({ success: false, message: 'Запит не знайдено' }, { status: 404 });
    }
    
    // Відправляємо нагадування в Telegram
    if (TELEGRAM_BOT_TOKEN && TELEGRAM_CHAT_ID) {
      const message = `🔔 <b>Нагадування про реєстрацію</b>\n\n📧 Email: ${registrationRequest.email}\n👤 Ім'я: ${registrationRequest.name}\n📅 Дата запиту: ${new Date(registrationRequest.createdAt).toLocaleDateString('uk-UA')}\n\n⏰ Користувач нагадує про себе та очікує підтвердження`;
      console.log('Sending Telegram message:', message);

      try {
        const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            chat_id: TELEGRAM_CHAT_ID,
            text: message,
            parse_mode: 'HTML'
          })
        });
        
        const responseData = await response.json();
        console.log('Telegram API response:', responseData);

        if (response.ok) {
          return NextResponse.json({ success: true, message: 'Нагадування відправлено адміністратору' });
        } else {
          console.error('Telegram API error:', responseData);
          return NextResponse.json({ success: false, message: 'Помилка відправки нагадування' }, { status: 500 });
        }
      } catch (error) {
        console.error('Failed to send Telegram notification:', error);
        return NextResponse.json({ success: false, message: 'Помилка відправки нагадування' }, { status: 500 });
      }
    } else {
      return NextResponse.json({ success: true, message: 'Нагадування зареєстровано (Telegram не налаштований)' });
    }
  } catch (error) {
    console.error('Помилка нагадування:', error);
    return NextResponse.json({ success: false, message: 'Помилка сервера' }, { status: 500 });
  }
}