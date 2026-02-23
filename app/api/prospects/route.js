import { kv } from '@vercel/kv';
import { createClient } from '@/app/lib/supabase/server';
import { NextResponse } from 'next/server';

// Prospects stored in KV as: prospects:{userId} -> [{ id, name, status, parentNodeId, createdAt }]
// parentNodeId = the profile ID of the IBO this prospect is under
// status: 'looking' | 'qi_complete' | 'saw_plan'

async function getAuthUser() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

async function getUserProspects(userId) {
  const data = await kv.get(`prospects:${userId}`);
  return data || [];
}

async function setUserProspects(userId, prospects) {
  await kv.set(`prospects:${userId}`, prospects);
}

// GET — fetch all prospects for current user
export async function GET() {
  try {
    const user = await getAuthUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const prospects = await getUserProspects(user.id);
    return NextResponse.json({ prospects });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to load prospects' }, { status: 500 });
  }
}

// POST — add a new prospect
export async function POST(request) {
  try {
    const user = await getAuthUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { name, parentNodeId, status } = await request.json();
    if (!name || !name.trim()) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }

    const validStatuses = ['looking', 'qi_complete', 'saw_plan'];
    const cleanStatus = validStatuses.includes(status) ? status : 'looking';

    const prospect = {
      id: `p_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      name: name.trim(),
      status: cleanStatus,
      parentNodeId: parentNodeId || user.id, // default to current user
      createdAt: new Date().toISOString(),
    };

    const prospects = await getUserProspects(user.id);
    prospects.push(prospect);
    await setUserProspects(user.id, prospects);

    return NextResponse.json({ success: true, prospect });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to add prospect' }, { status: 500 });
  }
}

// PATCH — update a prospect (status change or name edit)
export async function PATCH(request) {
  try {
    const user = await getAuthUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { id, name, status } = await request.json();
    if (!id) return NextResponse.json({ error: 'Prospect ID required' }, { status: 400 });

    const validStatuses = ['looking', 'qi_complete', 'saw_plan'];
    const prospects = await getUserProspects(user.id);
    const idx = prospects.findIndex(p => p.id === id);
    if (idx === -1) return NextResponse.json({ error: 'Prospect not found' }, { status: 404 });

    if (name !== undefined) prospects[idx].name = name.trim();
    if (status !== undefined && validStatuses.includes(status)) prospects[idx].status = status;
    prospects[idx].updatedAt = new Date().toISOString();

    await setUserProspects(user.id, prospects);
    return NextResponse.json({ success: true, prospect: prospects[idx] });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to update prospect' }, { status: 500 });
  }
}

// DELETE — remove a prospect
export async function DELETE(request) {
  try {
    const user = await getAuthUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'Prospect ID required' }, { status: 400 });

    const prospects = await getUserProspects(user.id);
    const filtered = prospects.filter(p => p.id !== id);

    if (filtered.length === prospects.length) {
      return NextResponse.json({ error: 'Prospect not found' }, { status: 404 });
    }

    await setUserProspects(user.id, filtered);
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to delete prospect' }, { status: 500 });
  }
}
