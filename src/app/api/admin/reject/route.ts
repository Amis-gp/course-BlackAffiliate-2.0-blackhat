import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const { requestId } = await request.json();
    
    const { data: requestToReject, error: fetchError } = await supabase
      .from('registration_requests')
      .select('*')
      .eq('id', requestId)
      .single();
    
    if (fetchError || !requestToReject) {
      return NextResponse.json({ success: false, message: 'Request not found' }, { status: 404 });
    }
    
    const { error: deleteError } = await supabase
      .from('registration_requests')
      .delete()
      .eq('id', requestId);
    
    if (deleteError) {
      console.error('Error deleting registration request:', deleteError);
      return NextResponse.json({ success: false, message: 'Failed to reject request' }, { status: 500 });
    }
    
    return NextResponse.json({ 
      success: true, 
      message: 'Request rejected',
      request: requestToReject
    });
  } catch (error) {
    console.error('Rejection error:', error);
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}