import { kv } from '@vercel/kv';
import { NextResponse } from 'next/server';
import crypto from 'crypto';

// Normalize segment labels (strip unwanted text from saved lineups)
const normalizeSegments = (lineup) => {
  if (!lineup || !lineup.segments) return lineup;
  return {
    ...lineup,
    segments: lineup.segments.map(seg => {
      if (seg.key === 'bsm' && seg.label && seg.label.toLowerCase().includes('book of the month')) {
        return { ...seg, label: 'BSM' };
      }
      if (seg.key === 'host') {
        // Strip MC references, normalize to just "Host"
        const lower = (seg.label || '').toLowerCase();
        if (lower.includes('mc') || lower.includes('welcome')) {
          return { ...seg, label: 'Host' };
        }
      }
      return seg;
    }),
  };
};

// GET - Fetch lineups (all or by date)
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date');
    const token = searchParams.get('token');

    // If token provided, fetch by share token (public access)
    if (token) {
      const shareData = await kv.get(`lineup:share:${token}`);
      if (!shareData) {
        return NextResponse.json({ error: 'Lineup not found' }, { status: 404 });
      }
      const lineup = await kv.get(`lineup:${shareData.date}`);
      return NextResponse.json({ lineup: normalizeSegments(lineup) || null, date: shareData.date });
    }

    // If specific date requested
    if (date) {
      const lineup = await kv.get(`lineup:${date}`);
      return NextResponse.json({ lineup: normalizeSegments(lineup) || null, date });
    }

    // Get all lineup dates
    let dates = [];
    try {
      const keys = await kv.keys('lineup:2*') || [];
      dates = keys.map(k => k.replace('lineup:', '')).filter(d => /^\d{4}-\d{2}-\d{2}$/.test(d));
      dates.sort((a, b) => new Date(b) - new Date(a));
    } catch (e) {
      console.error('Error fetching lineup dates:', e);
    }

    // Fetch all lineups
    const lineups = [];
    for (const d of dates) {
      const lineup = await kv.get(`lineup:${d}`);
      if (lineup) lineups.push({ date: d, ...normalizeSegments(lineup) });
    }

    return NextResponse.json({ lineups });
  } catch (error) {
    console.error('Lineup GET error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST - Create or update a lineup
export async function POST(request) {
  try {
    const body = await request.json();
    const { date, segments, topics, notes } = body;

    if (!date) {
      return NextResponse.json({ error: 'Date required' }, { status: 400 });
    }

    // Normalize segment labels on save
    const cleanSegments = (segments || []).map(seg => {
      if (seg.key === 'bsm' && seg.label && seg.label.toLowerCase().includes('book of the month')) {
        return { ...seg, label: 'BSM' };
      }
      if (seg.key === 'host') {
        const lower = (seg.label || '').toLowerCase();
        if (lower.includes('mc') || lower.includes('welcome')) {
          return { ...seg, label: 'Host' };
        }
      }
      return seg;
    });

    const lineup = {
      date,
      segments: cleanSegments,
      topics: topics || '',
      notes: notes || '',
      updatedAt: new Date().toISOString(),
    };

    await kv.set(`lineup:${date}`, lineup);
    await kv.expire(`lineup:${date}`, 365 * 24 * 60 * 60);

    // Track in lineup dates index
    await kv.sadd('lineup:dates', date);
    await kv.expire('lineup:dates', 365 * 24 * 60 * 60);

    return NextResponse.json({ success: true, lineup });
  } catch (error) {
    console.error('Lineup POST error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PUT - Generate or get share token
export async function PUT(request) {
  try {
    const body = await request.json();
    const { date } = body;

    if (!date) {
      return NextResponse.json({ error: 'Date required' }, { status: 400 });
    }

    // Check if share token already exists for this date
    const existingToken = await kv.get(`lineup:sharetoken:${date}`);
    if (existingToken) {
      return NextResponse.json({ token: existingToken, date });
    }

    // Generate new token
    const token = crypto.randomBytes(16).toString('hex');

    // Store both directions: token -> date and date -> token
    await kv.set(`lineup:share:${token}`, { date, createdAt: new Date().toISOString() });
    await kv.set(`lineup:sharetoken:${date}`, token);
    await kv.expire(`lineup:share:${token}`, 365 * 24 * 60 * 60);
    await kv.expire(`lineup:sharetoken:${date}`, 365 * 24 * 60 * 60);

    return NextResponse.json({ token, date });
  } catch (error) {
    console.error('Share token error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE - Delete a lineup
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date');

    if (!date) {
      return NextResponse.json({ error: 'Date required' }, { status: 400 });
    }

    await kv.del(`lineup:${date}`);
    await kv.srem('lineup:dates', date);

    // Also remove share tokens
    const token = await kv.get(`lineup:sharetoken:${date}`);
    if (token) {
      await kv.del(`lineup:share:${token}`);
      await kv.del(`lineup:sharetoken:${date}`);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Lineup DELETE error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
