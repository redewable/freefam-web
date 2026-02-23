import { kv } from '@vercel/kv';
import { createClient } from '@/app/lib/supabase/server';
import { NextResponse } from 'next/server';

const KV_KEY = 'webcast:zoom-link';

// GET — retrieve current Zoom link (auth required)
export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const link = await kv.get(KV_KEY);
    return NextResponse.json({ link: link || null });
  } catch (error) {
    console.error('Webcast GET error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST — admin sets the Zoom link
export async function POST(request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    // Verify admin
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();
    if (!profile || profile.role !== 'admin') {
      return NextResponse.json({ error: 'Admin only' }, { status: 403 });
    }

    const { link } = await request.json();
    if (!link) return NextResponse.json({ error: 'Link is required' }, { status: 400 });

    await kv.set(KV_KEY, link);
    return NextResponse.json({ success: true, link });
  } catch (error) {
    console.error('Webcast POST error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
