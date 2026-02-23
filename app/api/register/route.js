import { kv } from '@vercel/kv';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const body = await request.json();
    const { 
      firstName, 
      lastName, 
      email, 
      type,
      invitedBy,
      visitNumber,
      ltdId,
      uplinePlatinum,
      source,
    } = body;

    const id = `free_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const timestamp = new Date().toISOString();

    const isWebcast = type === 'webcast-guest' || type === 'webcast-apprentice';

    const registration = {
      id,
      name: `${firstName} ${lastName}`,
      email,
      type,
      invitedBy: invitedBy || '',
      visitNumber: visitNumber || '',
      ltdId: ltdId || '',
      uplinePlatinum: uplinePlatinum || '',
      source: source || 'main',
      createdAt: timestamp,
    };

    // Store with key pattern that can be found with kv.keys()
    const key = `registration:${id}`;
    await kv.set(key, registration);

    // For webcast registrations, also create an access token so they can retrieve the Zoom link later
    let webcastToken = null;
    if (isWebcast) {
      webcastToken = `wc_${Date.now()}_${Math.random().toString(36).substr(2, 12)}`;
      await kv.set(`webcast-token:${webcastToken}`, { email, name: `${firstName} ${lastName}`, type, createdAt: timestamp });
      // Also index by email for email-based lookup
      const existing = await kv.get(`webcast-email:${email.toLowerCase().trim()}`) || [];
      existing.push(webcastToken);
      await kv.set(`webcast-email:${email.toLowerCase().trim()}`, existing);
    }

    return NextResponse.json({ success: true, id, webcastToken });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Debug endpoint
export async function GET() {
  try {
    const keys = await kv.keys('registration:free_*');
    console.log('Found keys:', keys);
    
    const registrations = [];
    for (const key of keys || []) {
      const reg = await kv.get(key);
      if (reg) registrations.push(reg);
    }
    
    return NextResponse.json({ 
      keyCount: keys?.length || 0,
      keys: keys || [],
      registrations 
    });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}