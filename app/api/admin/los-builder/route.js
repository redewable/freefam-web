import { createServerClient } from '@supabase/ssr';
import { NextResponse } from 'next/server';

function getServiceClient() {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    {
      cookies: {
        getAll: () => [],
        setAll: () => {},
      },
    }
  );
}

// GET - Fetch all users for LOS builder (unplaced + placed)
export async function GET() {
  try {
    const supabase = getServiceClient();

    // Get all active profiles
    const { data: profiles, error } = await supabase
      .from('los_tree')
      .select('*')
      .order('full_name');

    if (error) throw error;

    // Split into placed and unplaced
    const unplaced = profiles.filter(p => !p.sponsor_id);
    const placed = profiles.filter(p => p.sponsor_id);

    return NextResponse.json({ profiles: profiles || [], unplaced, placed });
  } catch (error) {
    console.error('LOS Builder GET error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PATCH - Place or move a user in the LOS tree
export async function PATCH(request) {
  try {
    const { userId, newSponsorId } = await request.json();

    if (!userId) {
      return NextResponse.json({ error: 'userId is required' }, { status: 400 });
    }

    const supabase = getServiceClient();

    // Prevent circular references: newSponsor cannot be in userId's downline
    if (newSponsorId) {
      const isCircular = await checkCircular(supabase, userId, newSponsorId);
      if (isCircular) {
        return NextResponse.json({ error: 'Cannot place someone under their own downline.' }, { status: 400 });
      }
    }

    // Update sponsor_id (null = unplace)
    const { error } = await supabase
      .from('profiles')
      .update({ sponsor_id: newSponsorId || null })
      .eq('id', userId);

    if (error) throw error;

    // Auto-link partner if they exist and are also unplaced
    const { data: user } = await supabase
      .from('profiles')
      .select('ltd_id')
      .eq('id', userId)
      .single();

    if (user?.ltd_id && newSponsorId) {
      const partnerLtdId = getPartnerLtdId(user.ltd_id);
      if (partnerLtdId) {
        const { data: partner } = await supabase
          .from('profiles')
          .select('id, sponsor_id')
          .eq('ltd_id', partnerLtdId)
          .single();

        // If partner exists and is unplaced, co-place them
        if (partner && !partner.sponsor_id) {
          await supabase
            .from('profiles')
            .update({ sponsor_id: newSponsorId })
            .eq('id', partner.id);
        }
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('LOS Builder PATCH error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE - Remove a user and unlock their downline
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const unlockDownline = searchParams.get('unlock') === 'true';

    if (!userId) {
      return NextResponse.json({ error: 'userId is required' }, { status: 400 });
    }

    const supabase = getServiceClient();

    if (unlockDownline) {
      // Set all direct downline's sponsor_id to null (unplace them)
      await supabase
        .from('profiles')
        .update({ sponsor_id: null })
        .eq('sponsor_id', userId);
    }

    // Delete the user's profile and auth account
    const { error: profileErr } = await supabase
      .from('profiles')
      .delete()
      .eq('id', userId);

    if (profileErr) throw profileErr;

    // Delete auth user
    const { error: authErr } = await supabase.auth.admin.deleteUser(userId);
    if (authErr) console.error('Auth delete error:', authErr);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('LOS Builder DELETE error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Helper: check if newSponsorId is in userId's downline (circular ref)
async function checkCircular(supabase, userId, newSponsorId) {
  const visited = new Set();
  let current = newSponsorId;

  while (current) {
    if (current === userId) return true;
    if (visited.has(current)) break;
    visited.add(current);

    const { data } = await supabase
      .from('profiles')
      .select('sponsor_id')
      .eq('id', current)
      .single();

    current = data?.sponsor_id || null;
  }
  return false;
}

// Partner LTD ID logic
function getPartnerLtdId(ltdId) {
  if (!ltdId) return null;
  const s = ltdId.toString();
  if (s.endsWith('2') && s.length > 1) return s.slice(0, -1);
  return s + '2';
}
