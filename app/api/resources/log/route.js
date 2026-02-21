import { createClient } from '@/app/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { action, resourceId, pagePath } = await request.json();

    await supabase.from('access_logs').insert({
      user_id: user.id,
      resource_id: resourceId || null,
      action: action || 'page_view',
      page_path: pagePath || '',
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
