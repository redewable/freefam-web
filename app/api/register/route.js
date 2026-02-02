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

    const registration = {
      id,
      name: `${firstName} ${lastName}`,
      email,
      type, // 'guest' or 'apprentice'
      invitedBy: invitedBy || '',
      visitNumber: visitNumber || '',
      ltdId: ltdId || '',
      uplinePlatinum: uplinePlatinum || '',
      source: source || 'main',
      createdAt: timestamp,
    };

    // Store with key pattern that can be found with kv.keys()
    const key = `registration:${id}`;
    console.log('Saving registration with key:', key);
    console.log('Registration data:', JSON.stringify(registration));
    
    await kv.set(key, registration);
    
    // Verify it was saved
    const saved = await kv.get(key);
    console.log('Verified save:', saved ? 'success' : 'FAILED');

    return NextResponse.json({ success: true, id, saved: !!saved });
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