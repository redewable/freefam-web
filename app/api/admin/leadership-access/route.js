import { kv } from '@vercel/kv';
import { createClient } from '@/app/lib/supabase/server';
import { NextResponse } from 'next/server';

// Access levels:
// 'leadership' — Full access: check-in, lineups, finances, history, user management
// 'admin' — Can check in and view check-in history. No finances, user management, or lineup
// 'viewer' — Read-only access to all data
// 'member' — No access to admin dashboard or leadership portals (not stored in KV, just means no entry)
const VALID_LEVELS = ['leadership', 'admin', 'viewer'];

// GET - Check current user's access OR list all access entries (admin only)
export async function GET(request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { data: profile } = await supabase
      .from('profiles')
      .select('ltd_id, role, full_name')
      .eq('id', user.id)
      .single();

    if (!profile) return NextResponse.json({ error: 'Profile not found' }, { status: 404 });

    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');

    // Check own access
    if (action === 'check') {
      // Admins always have full leadership access
      if (profile.role === 'admin') {
        return NextResponse.json({ hasAccess: true, level: 'leadership', profile });
      }

      // Check KV for granted access
      const accessKey = `leadership:access:${profile.ltd_id}`;
      const access = await kv.get(accessKey);
      if (access) {
        return NextResponse.json({ hasAccess: true, level: access.level || 'viewer', profile });
      }

      return NextResponse.json({ hasAccess: false, profile });
    }

    // List all users with access (admin only)
    if (profile.role !== 'admin') {
      return NextResponse.json({ error: 'Admin only' }, { status: 403 });
    }

    // Get all leadership access entries from KV
    const keys = await kv.keys('leadership:access:*');
    const accessList = [];
    for (const key of (keys || [])) {
      const data = await kv.get(key);
      if (data) accessList.push(data);
    }

    // Get all profiles for the user management view
    const { data: allProfiles } = await supabase
      .from('profiles')
      .select('id, full_name, ltd_id, role, status')
      .order('full_name', { ascending: true });

    return NextResponse.json({ accessList, profiles: allProfiles || [] });
  } catch (error) {
    console.error('Leadership access GET error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST - Grant or update access (admin only)
export async function POST(request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (!profile || profile.role !== 'admin') {
      return NextResponse.json({ error: 'Admin only' }, { status: 403 });
    }

    const body = await request.json();
    const { ltdId, level, fullName } = body;

    if (!ltdId) return NextResponse.json({ error: 'LTD ID required' }, { status: 400 });
    if (!VALID_LEVELS.includes(level)) {
      return NextResponse.json({ error: `Level must be one of: ${VALID_LEVELS.join(', ')}` }, { status: 400 });
    }

    const accessKey = `leadership:access:${ltdId}`;
    const accessData = {
      ltdId,
      level,
      fullName: fullName || '',
      grantedBy: user.id,
      grantedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await kv.set(accessKey, accessData);
    await kv.expire(accessKey, 365 * 24 * 60 * 60);

    return NextResponse.json({ success: true, access: accessData });
  } catch (error) {
    console.error('Leadership access POST error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE - Revoke access (admin only)
export async function DELETE(request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (!profile || profile.role !== 'admin') {
      return NextResponse.json({ error: 'Admin only' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const ltdId = searchParams.get('ltdId');
    if (!ltdId) return NextResponse.json({ error: 'LTD ID required' }, { status: 400 });

    await kv.del(`leadership:access:${ltdId}`);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Leadership access DELETE error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
