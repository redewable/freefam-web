// Run this locally: node scripts/create-derly.js
// Or deploy first and hit the API endpoint below

const { createServerClient } = require('@supabase/ssr');

// Load from freefam-app/.env.local or set these manually
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://otrazihloxoahvpgfwbb.supabase.co';
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

if (!SERVICE_KEY) {
  console.error('Set SUPABASE_SERVICE_ROLE_KEY env var');
  process.exit(1);
}

async function main() {
  const supabase = createServerClient(SUPABASE_URL, SERVICE_KEY, {
    cookies: { getAll: () => [], setAll: () => {} },
  });

  console.log('Creating auth user for Derly Trevino (LTD 2118394)...');

  const { data, error } = await supabase.auth.admin.createUser({
    email: '2118394@freedomfamily.app',
    password: 'Sixin2026',
    email_confirm: true,
    user_metadata: {
      full_name: 'Derly Trevino',
      first_name: 'Derly',
      last_name: 'Trevino',
      ltd_id: '2118394',
      role: 'member',
    },
  });

  if (error) {
    console.error('Auth error:', error.message);
    return;
  }

  console.log('Auth user created:', data.user.id);

  const { error: profileErr } = await supabase
    .from('profiles')
    .update({
      full_name: 'Derly Trevino',
      first_name: 'Derly',
      last_name: 'Trevino',
      ltd_id: '2118394',
      role: 'member',
    })
    .eq('id', data.user.id);

  if (profileErr) console.error('Profile error:', profileErr.message);
  else console.log('Profile updated');

  console.log('\n=== Login Credentials ===');
  console.log('LTD ID: 2118394');
  console.log('Password: Sixin2026');
  console.log('Leadership Portal: /admin/leadership');
  console.log('Member Dashboard: /resources');
  console.log('\nNote: Grant viewer access from the leadership portal Users tab,');
  console.log('or it was already set via the KV store.');
}

main().catch(e => console.error(e));
