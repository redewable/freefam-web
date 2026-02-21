import { createClient } from '@/app/lib/supabase/server';
import { NextResponse } from 'next/server';

// GET - List all invites (admin/sponsor)
export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
    if (!profile || !['admin', 'sponsor'].includes(profile.role)) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    let query = supabase
      .from('invites')
      .select('*, creator:created_by(full_name), consumer:used_by(full_name)')
      .order('created_at', { ascending: false });

    // Non-admins only see their own invites
    if (profile.role !== 'admin') {
      query = query.eq('created_by', user.id);
    }

    const { data: invites, error } = await query;
    if (error) throw error;

    return NextResponse.json({ invites: invites || [] });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST - Create invite
export async function POST(request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
    if (!profile || !['admin', 'sponsor'].includes(profile.role)) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    const { ltdId, role } = await request.json();

    const { data: invite, error } = await supabase
      .from('invites')
      .insert({
        created_by: user.id,
        role: role || 'member',
        invitee_ltd_id: ltdId || null,
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ invite });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
