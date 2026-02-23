import { createServerClient } from '@supabase/ssr';
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

// GET - Check if LTD ID is available
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const ltdId = searchParams.get('ltdId');

    if (!ltdId) {
      return NextResponse.json({ error: 'ltdId required' }, { status: 400 });
    }

    const supabase = getServiceClient();
    const { data: existing } = await supabase
      .from('profiles')
      .select('id')
      .eq('ltd_id', ltdId.trim())
      .single();

    return NextResponse.json({ available: !existing });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST - Self-service account creation
export async function POST(request) {
  try {
    const { ltdId, fullName, password, phone, email } = await request.json();

    // Validation
    if (!ltdId || !fullName || !password) {
      return NextResponse.json({ error: 'LTD ID, full name, and password are required.' }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ error: 'Password must be at least 6 characters.' }, { status: 400 });
    }

    const cleanLtdId = ltdId.toString().trim();
    const cleanName = fullName.trim();

    if (!/^\d+$/.test(cleanLtdId)) {
      return NextResponse.json({ error: 'LTD ID must be numeric.' }, { status: 400 });
    }

    const supabase = getServiceClient();
    const internalEmail = `${cleanLtdId}@freedomfamily.app`;

    // Check if LTD ID already exists
    const { data: existingProfile } = await supabase
      .from('profiles')
      .select('id')
      .eq('ltd_id', cleanLtdId)
      .single();

    if (existingProfile) {
      return NextResponse.json({ error: 'An account with this LTD ID already exists.' }, { status: 400 });
    }

    // Parse name
    const nameParts = cleanName.split(' ');
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || '';

    // Create auth user via service role (auto-confirms)
    const { data: authData, error: authErr } = await supabase.auth.admin.createUser({
      email: internalEmail,
      password,
      email_confirm: true,
      user_metadata: {
        full_name: cleanName,
        first_name: firstName,
        last_name: lastName,
        ltd_id: cleanLtdId,
        role: 'member',
      },
    });

    if (authErr) {
      return NextResponse.json({ error: authErr.message }, { status: 400 });
    }

    // Update profile with all fields (sponsor_id left NULL — leadership assigns later)
    const updateData = {
      full_name: cleanName,
      first_name: firstName,
      last_name: lastName,
      ltd_id: cleanLtdId,
      role: 'member',
    };
    if (phone) updateData.phone = phone.trim();
    if (email) updateData.recovery_email = email.trim().toLowerCase();

    const { error: profileErr } = await supabase
      .from('profiles')
      .update(updateData)
      .eq('id', authData.user.id);

    if (profileErr) console.error('Profile update error:', profileErr);

    return NextResponse.json({
      success: true,
      userId: authData.user.id,
      ltdId: cleanLtdId,
      fullName: cleanName,
    });
  } catch (error) {
    console.error('Join error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
