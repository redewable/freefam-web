import { createServerClient } from '@supabase/ssr';
import { kv } from '@vercel/kv';
import { NextResponse } from 'next/server';

// Service-role client (bypasses RLS)
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

// POST - Admin force-create a user account
export async function POST(request) {
  try {
    const { ltdId, fullName, password, sponsorLtdId, role, portalAccess } = await request.json();

    if (!ltdId || !fullName || !password) {
      return NextResponse.json({ error: 'ltdId, fullName, and password are required' }, { status: 400 });
    }

    const supabase = getServiceClient();
    const internalEmail = `${ltdId.trim()}@freedomfamily.app`;
    const nameParts = fullName.trim().split(' ');
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || '';
    const userRole = role || 'member';

    // Check if LTD ID already exists
    const { data: existingProfile } = await supabase
      .from('profiles')
      .select('id')
      .eq('ltd_id', ltdId.trim())
      .single();

    if (existingProfile) {
      return NextResponse.json({ error: 'An account with this LTD ID already exists.' }, { status: 400 });
    }

    // Look up sponsor by LTD ID if provided
    let sponsorId = null;
    if (sponsorLtdId) {
      const { data: sponsor } = await supabase
        .from('profiles')
        .select('id')
        .eq('ltd_id', sponsorLtdId.trim())
        .single();
      if (sponsor) sponsorId = sponsor.id;
    }

    // Create auth user via service role (auto-confirms)
    const { data: authData, error: authErr } = await supabase.auth.admin.createUser({
      email: internalEmail,
      password,
      email_confirm: true,
      user_metadata: {
        full_name: fullName.trim(),
        first_name: firstName,
        last_name: lastName,
        ltd_id: ltdId.trim(),
        role: userRole,
      },
    });

    if (authErr) {
      return NextResponse.json({ error: authErr.message }, { status: 400 });
    }

    // Update profile
    const updateData = {
      full_name: fullName.trim(),
      first_name: firstName,
      last_name: lastName,
      ltd_id: ltdId.trim(),
      role: userRole,
    };
    if (sponsorId) updateData.sponsor_id = sponsorId;

    const { error: profileErr } = await supabase
      .from('profiles')
      .update(updateData)
      .eq('id', authData.user.id);

    if (profileErr) console.error('Profile update error:', profileErr);

    // Grant portal access if specified
    if (portalAccess) {
      const accessKey = `leadership:access:${ltdId.trim()}`;
      await kv.set(accessKey, {
        ltdId: ltdId.trim(),
        level: portalAccess,
        fullName: fullName.trim(),
        grantedBy: 'admin-create',
        grantedAt: new Date().toISOString(),
      });
      await kv.expire(accessKey, 365 * 24 * 60 * 60);
    }

    return NextResponse.json({
      success: true,
      userId: authData.user.id,
      login: {
        ltdId: ltdId.trim(),
        password,
        url: '/admin/leadership',
      },
    });
  } catch (error) {
    console.error('Create user error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
