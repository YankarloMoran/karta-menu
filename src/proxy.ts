import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';
import { createServerClient } from '@supabase/ssr';
import { type NextRequest, NextResponse } from 'next/server';

const intlMiddleware = createMiddleware(routing);

export async function proxy(request: NextRequest) {
  // 1. Run i18n middleware first
  const response = intlMiddleware(request);

  // 2. Auth protection (Supabase)
  let supabaseResponse = response;
  
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return request.cookies.getAll(); },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) => supabaseResponse.cookies.set(name, value, options));
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();

  // Protect dashboard routes (checking for any locale)
  const isDashboard = routing.locales.some(locale => 
    request.nextUrl.pathname.startsWith(`/${locale}/dashboard`)
  ) || request.nextUrl.pathname.startsWith('/dashboard');

  if (!user && isDashboard) {
    // Redirect to login (preserving locale)
    const locale = request.nextUrl.pathname.split('/')[1] || routing.defaultLocale;
    return NextResponse.redirect(new URL(`/${locale}/login`, request.url));
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    '/', 
    '/(es|en)/:path*', 
    '/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)'
  ]
};
