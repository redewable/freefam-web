import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

// Helper to get service-role client (bypasses RLS)
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

// GET - Validate invite token
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');
    if (!token) return NextResponse.json({ error: 'No token' }, { status: 400 });

    const supabase = getServiceClient();
    const { data: invite, error } = await supabase
      .from('invites')
      .select('id, token, role, invitee_email, expires_at, created_by')
      .eq('token', token)
      .is('used_at', null)
      .gt('expires_at', new Date().toISOString())
      .single();

    if (error || !invite) return NextResponse.json({ error: 'Invalid or expired invite' }, { status: 404 });

    return NextResponse.json({ invite: { role: invite.role, invitee_email: invite.invitee_email } });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST - Create account via invite
export async function POST(request) {
  try {
    const { token, email, password, fullName } = await request.json();
    if (!token || !email || !password || !fullName) {
      return NextResponse.json({ error: 'All fields are required.' }, { status: 400 });
    }

    const supabase = getServiceClient();

    // Validate invite
    const { data: invite, error: inviteErr } = await supabase
      .from('invites')
      .select('*')
      .eq('token', token)
      .is('used_at', null)
      .gt('expires_at', new Date().toISOString())
      .single();

    if (inviteErr || !invite) {
      return NextResponse.json({ error: 'Invalid or expired invite.' }, { status: 400 });
    }

    // If invite has a specific email, enforce it
    if (invite.invitee_email && invite.invitee_email.toLowerCase() !== email.toLowerCase()) {
      return NextResponse.json({ error: 'This invite is for a different email address.' }, { status: 400 });
    }

    // Create auth user via service role (auto-confirms)
    const { data: authData, error: authErr } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        full_name: fullName,
        role: invite.role,
      },
    });

    if (authErr) {
      if (authErr.message.includes('already been registered')) {
        return NextResponse.json({ error: 'An account with this email already exists.' }, { status: 400 });
      }
      return NextResponse.json({ error: authErr.message }, { status: 400 });
    }

    // Update profile with sponsor info (invite creator = sponsor)
    const { error: profileErr } = await supabase
      .from('profiles')
      .update({
        full_name: fullName,
        role: invite.role,
        sponsor_id: invite.created_by,
      })
      .eq('id', authData.user.id);

    if (profileErr) console.error('Profile update error:', profileErr);

    // Mark invite as used
    await supabase
      .from('invites')
      .update({ used_at: new Date().toISOString(), used_by: authData.user.id })
      .eq('id', invite.id);

    return NextResponse.json({ success: true, userId: authData.user.id });
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
