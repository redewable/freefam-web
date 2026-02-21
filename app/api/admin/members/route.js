import { createClient } from '@/app/lib/supabase/server';
import { NextResponse } from 'next/server';

// GET - List all members with access stats (admin only)
export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
    if (!profile || profile.role !== 'admin') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    // Get all members
    const { data: members, error } = await supabase
      .from('los_tree')
      .select('*')
      .order('full_name', { ascending: true });

    if (error) throw error;

    // Get last login for each member
    const memberIds = (members || []).map(m => m.id);
    const { data: lastLogins } = await supabase
      .from('login_logs')
      .select('user_id, created_at')
      .in('user_id', memberIds)
      .order('created_at', { ascending: false });

    // Build a map of userId -> last login
    const loginMap = {};
    (lastLogins || []).forEach(log => {
      if (!loginMap[log.user_id]) loginMap[log.user_id] = log.created_at;
    });

    // Get access counts
    const { data: accessCounts } = await supabase
      .from('access_logs')
      .select('user_id')
      .in('user_id', memberIds);

    const accessMap = {};
    (accessCounts || []).forEach(log => {
      accessMap[log.user_id] = (accessMap[log.user_id] || 0) + 1;
    });

    const enriched = (members || []).map(m => ({
      ...m,
      last_login: loginMap[m.id] || null,
      access_count: accessMap[m.id] || 0,
    }));

    return NextResponse.json({ members: enriched });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
