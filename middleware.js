import { updateSession } from '@/app/lib/supabase/middleware';

export async function middleware(request) {
  return await updateSession(request);
}

export const config = {
  matcher: ['/resources/:path*'],
};
