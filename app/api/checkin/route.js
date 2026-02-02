import { kv } from '@vercel/kv';
import { NextResponse } from 'next/server';

// Get the start of the current week (Monday)
const getWeekKey = () => {
  const now = new Date();
  const day = now.getDay();
  const diff = now.getDate() - day + (day === 0 ? -6 : 1);
  const monday = new Date(now.setDate(diff));
  return monday.toISOString().split('T')[0];
};

// Get the current month key
const getMonthKey = () => {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
};

export async function POST(request) {
  try {
    const { sessionId, action, priceType } = await request.json();
    
    if (!sessionId) {
      return NextResponse.json(
        { error: 'Session ID is required' },
        { status: 400 }
      );
    }

    // Use different key prefix based on ticket type
    // Weekly tickets: checkin:week:2025-02-03:sessionId
    // Monthly tickets: checkin:month:2025-02:sessionId
    const periodKey = priceType === 'monthly' ? getMonthKey() : getWeekKey();
    const keyPrefix = priceType === 'monthly' ? 'month' : 'week';
    const key = `checkin:${keyPrefix}:${periodKey}:${sessionId}`;
    
    if (action === 'checkin') {
      const timestamp = new Date().toISOString();
      await kv.set(key, {
        checkedIn: true,
        timestamp,
        priceType,
      });
      
      // Set TTL: 7 days for weekly, 35 days for monthly (covers month + buffer)
      const ttlSeconds = priceType === 'monthly' ? 35 * 24 * 60 * 60 : 7 * 24 * 60 * 60;
      await kv.expire(key, ttlSeconds);
      
      return NextResponse.json({ success: true, checkedIn: true, timestamp });
    } else if (action === 'checkout') {
      await kv.del(key);
      return NextResponse.json({ success: true, checkedIn: false });
    } else {
      // Toggle
      const current = await kv.get(key);
      if (current?.checkedIn) {
        await kv.del(key);
        return NextResponse.json({ success: true, checkedIn: false });
      } else {
        const timestamp = new Date().toISOString();
        await kv.set(key, {
          checkedIn: true,
          timestamp,
          priceType,
        });
        const ttlSeconds = priceType === 'monthly' ? 35 * 24 * 60 * 60 : 7 * 24 * 60 * 60;
        await kv.expire(key, ttlSeconds);
        return NextResponse.json({ success: true, checkedIn: true, timestamp });
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