import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    console.log('🔍 API: Looking for user with ID:', id);
    
    const { data: user, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.log('❌ API: User not found for ID:', id, 'Error:', error.message);
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (user) {
      console.log('✅ API: User found:', user);
      return NextResponse.json(user);
    } else {
      console.log('❌ API: User not found for ID:', id);
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
  } catch (error) {
    console.error('💥 API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}