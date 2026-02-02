import { kv } from '@vercel/kv';
import { NextResponse } from 'next/server';

// Test endpoint to verify KV is working
// GET /api/debug - shows all registration keys
// POST /api/debug - creates a test registration

export async function GET() {
  try {
    // Test basic KV connectivity
    await kv.set('test:ping', 'pong');
    const pong = await kv.get('test:ping');
    
    // Get all registration keys
    const regKeys = await kv.keys('registration:*');
    const historyKeys = await kv.keys('history:*');
    const checkinKeys = await kv.keys('checkin:*');
    
    // Get all registrations
    const registrations = [];
    for (const key of regKeys || []) {
      const reg = await kv.get(key);
      registrations.push({ key, data: reg });
    }
    
    return NextResponse.json({
      kvWorking: pong === 'pong',
      keys: {
        registrations: regKeys || [],
        history: historyKeys || [],
        checkins: checkinKeys || [],
      },
      registrationData: registrations,
    });
  } catch (error) {
    return NextResponse.json({ 
      error: error.message,
      kvWorking: false,
    }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const { action } = await request.json();
    
    if (action === 'test') {
      // Create a test guest registration
      const id = `free_test_${Date.now()}`;
      const registration = {
        id,
        name: 'Test Guest',
        email: 'test@example.com',
        type: 'guest',
        invitedBy: 'Test Inviter',
        visitNumber: '1st',
        ltdId: '',
        uplinePlatinum: '',
        source: 'debug',
        createdAt: new Date().toISOString(),
      };
      
      await kv.set(`registration:${id}`, registration);
      const saved = await kv.get(`registration:${id}`);
      
      return NextResponse.json({ 
        success: true, 
        id,
        saved: !!saved,
        registration: saved,
      });
    }
    
    if (action === 'clear-test') {
      // Clear test registrations
      const keys = await kv.keys('registration:free_test_*');
      for (const key of keys || []) {
        await kv.del(key);
      }
      return NextResponse.json({ success: true, deleted: keys?.length || 0 });
    }
    
    return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}