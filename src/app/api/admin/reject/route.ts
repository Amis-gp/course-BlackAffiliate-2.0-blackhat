import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const { requestId } = await request.json();
    
    const requests = await db.registrationRequest.findMany();
    const requestToReject = requests.find(req => req.id === requestId);
    
    if (!requestToReject) {
      return NextResponse.json({ success: false, message: 'Request not found' }, { status: 404 });
    }
    
    await db.registrationRequest.delete({
      where: { id: requestId }
    });
    
    return NextResponse.json({ 
      success: true, 
      message: 'Request rejected',
      request: requestToReject
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}