import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export async function POST(request: Request) {
  const { email, password, name } = await request.json();

  if (!email || !password || !name) {
    return NextResponse.json({ error: 'Email, password, and name are required' }, { status: 400 });
  }

  try {
    // Check for existing user in auth.users
    // Note: This part is tricky because we can't directly query auth.users from admin client easily without more complex setup.
    // A simpler approach for now is to rely on the database constraint for unique emails in registration_requests.

    // Check for existing registration request
    const { data: existingRequests, error: existingRequestError } = await supabaseAdmin
      .from('registration_requests')
      .select('id')
      .eq('email', email);

    if (existingRequestError) {
      console.error('Error checking for existing registration request:', existingRequestError);
      return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }

    if (existingRequests && existingRequests.length > 0) {
      return NextResponse.json({ error: 'Registration request for this email already exists.' }, { status: 409 });
    }

    // Insert new registration request
    const { data, error } = await supabaseAdmin
      .from('registration_requests')
      .insert([{ email, password, name, created_at: new Date().toISOString() }])
      .select()
      .single();

    if (error) {
      console.error('Registration error:', error);
      // Potentially a unique constraint violation if the email was used in the meantime
      if (error.code === '23505') {
          return NextResponse.json({ error: 'Registration request for this email already exists.' }, { status: 409 });
      }
      return NextResponse.json({ error: 'Failed to create registration request' }, { status: 500 });
    }

    // TODO: Consider moving Telegram notification here if it contains sensitive data
    // For now, we return the created request data, and the client can trigger the notification.

    return NextResponse.json(data, { status: 201 });

  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
  }
}