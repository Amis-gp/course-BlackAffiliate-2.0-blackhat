import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '');
    
    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Not authenticated' },
        { status: 401 }
      );
    }

    const { data: { user }, error: userError } = await supabaseAdmin.auth.getUser(token);
    
    if (userError || !user) {
      return NextResponse.json(
        { success: false, message: 'Not authenticated' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { endpoint, p256dh, auth } = body;

    if (!endpoint || !p256dh || !auth) {
      return NextResponse.json(
        { success: false, message: 'Missing subscription data' },
        { status: 400 }
      );
    }

    const { error: insertError } = await supabaseAdmin
      .from('user_push_subscriptions')
      .upsert({
        user_id: user.id,
        endpoint,
        p256dh,
        auth,
        enabled: true
      }, {
        onConflict: 'user_id,endpoint'
      });

    if (insertError) {
      throw insertError;
    }

    return NextResponse.json({
      success: true,
      message: 'Push subscription saved'
    });
  } catch (error) {
    console.error('Error saving push subscription:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to save push subscription' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '');
    
    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Not authenticated' },
        { status: 401 }
      );
    }

    const { data: { user }, error: userError } = await supabaseAdmin.auth.getUser(token);
    
    if (userError || !user) {
      return NextResponse.json(
        { success: false, message: 'Not authenticated' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const endpoint = searchParams.get('endpoint');

    if (!endpoint) {
      return NextResponse.json(
        { success: false, message: 'Missing endpoint' },
        { status: 400 }
      );
    }

    const { error: deleteError } = await supabaseAdmin
      .from('user_push_subscriptions')
      .delete()
      .eq('user_id', user.id)
      .eq('endpoint', endpoint);

    if (deleteError) {
      throw deleteError;
    }

    return NextResponse.json({
      success: true,
      message: 'Push subscription deleted'
    });
  } catch (error) {
    console.error('Error deleting push subscription:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to delete push subscription' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '');
    
    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Not authenticated' },
        { status: 401 }
      );
    }

    const { data: { user }, error: userError } = await supabaseAdmin.auth.getUser(token);
    
    if (userError || !user) {
      return NextResponse.json(
        { success: false, message: 'Not authenticated' },
        { status: 401 }
      );
    }

    const { data: subscriptions, error } = await supabaseAdmin
      .from('user_push_subscriptions')
      .select('*')
      .eq('user_id', user.id)
      .eq('enabled', true);

    if (error) {
      throw error;
    }

    return NextResponse.json({
      success: true,
      subscriptions: subscriptions || []
    });
  } catch (error) {
    console.error('Error fetching push subscriptions:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch push subscriptions' },
      { status: 500 }
    );
  }
}

