import { kv } from '@vercel/kv';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { sessionId, action } = await request.json();
    
    if (!sessionId) {
      return NextResponse.json(
        { error: 'Session ID is required' },
        { status: 400 }
      );
    }

    const key = `checkin:${sessionId}`;
    
    if (action === 'checkin') {
      // Mark as checked in
      await kv.set(key, {
        checkedIn: true,
        timestamp: new Date().toISOString(),
      });
      return NextResponse.json({ success: true, checkedIn: true });
    } else if (action === 'checkout') {
      // Remove check-in status
      await kv.del(key);
      return NextResponse.json({ success: true, checkedIn: false });
    } else {
      // Toggle
      const current = await kv.get(key);
      if (current?.checkedIn) {
        await kv.del(key);
        return NextResponse.json({ success: true, checkedIn: false });
      } else {
        await kv.set(key, {
          checkedIn: true,
          timestamp: new Date().toISOString(),
        });
        return NextResponse.json({ success: true, checkedIn: true });
      }
    }
  } catch (error) {
    console.error('Error updating check-in:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}