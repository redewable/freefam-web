import { createClient } from '@/app/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { userId } = await request.json();
    if (!userId) return NextResponse.json({ error: 'Missing userId' }, { status: 400 });

    const supabase = await createClient();

    // Log the login
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || '';
    const userAgent = request.headers.get('user-agent') || '';

    await supabase.from('login_logs').insert({
      user_id: userId,
      ip_address: ip.split(',')[0].trim(),
      user_agent: userAgent.substring(0, 500),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Login log error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
