import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

const TELEGRAM_BOT_TOKEN = process.env.NEXT_PUBLIC_TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.NEXT_PUBLIC_TELEGRAM_CHAT_ID;

export async function POST(request: NextRequest) {
  console.log('--- REMIND API CALLED ---');
  try {
    const { requestId } = await request.json();
    console.log('Received requestId:', requestId);
    
    const { data: registrationRequest, error: requestError } = await supabaseAdmin
      .from('registration_requests')
      .select('*')
      .eq('id', requestId)
      .single();
    
    if (requestError) {
      console.error('Error fetching registration request:', requestError);
      return NextResponse.json({ success: false, message: 'Request not found' }, { status: 404 });
    }
    
    if (!registrationRequest) {
      return NextResponse.json({ success: false, message: 'Request not found' }, { status: 404 });
    }
    
    // Send reminder to Telegram
    if (TELEGRAM_BOT_TOKEN && TELEGRAM_CHAT_ID) {
      const message = `🔔 <b>Registration Reminder</b>\n\n📧 Email: ${registrationRequest.email}\n👤 Name: ${registrationRequest.name}\n📅 Request date: ${new Date(registrationRequest.createdAt).toLocaleDateString('en-US')}\n\n⏰ The user is reminding about themselves and is waiting for confirmation`;
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
          return NextResponse.json({ success: true, message: 'Reminder sent to administrator' });
        } else {
          console.error('Telegram API error:', responseData);
          return NextResponse.json({ success: false, message: 'Error sending reminder' }, { status: 500 });
        }
      } catch (error) {
        console.error('Failed to send Telegram notification:', error);
        return NextResponse.json({ success: false, message: 'Error sending reminder' }, { status: 500 });
      }
    } else {
      return NextResponse.json({ success: true, message: 'Reminder registered (Telegram not configured)' });
    }
  } catch (error) {
    console.error('Reminder error:', error);
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}