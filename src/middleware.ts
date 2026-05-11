import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';
import { createServerClient } from '@supabase/ssr';
import { type NextRequest, NextResponse } from 'next/server';

const intlMiddleware = createMiddleware(routing);

export async function middleware(request: NextRequest) {
  // 1. Run i18n middleware first to get proper locale-aware response
  const intlResponse = intlMiddleware(request);

  // 2. Create Supabase client that reads/writes cookies on the intl response
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            // Set on the intl response so both i18n headers AND auth cookies are preserved
            intlResponse.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  // 3. Refresh session (this triggers setAll if needed)
  const { data: { user } } = await supabase.auth.getUser();

  // 4. Protect dashboard routes
  const pathname = request.nextUrl.pathname;
  const isDashboard = routing.locales.some(locale =>
    pathname.startsWith(`/${locale}/dashboard`)
  ) || pathname.startsWith('/dashboard');

  if (!user && isDashboard) {
    const locale = pathname.split('/')[1] || routing.defaultLocale;
    const validLocale = routing.locales.includes(locale as any) ? locale : routing.defaultLocale;
    return NextResponse.redirect(new URL(`/${validLocale}/login`, request.url));
  }

  return intlResponse;
}

export const config = {
  matcher: [
    '/',
    '/(es|en)/:path*',
    '/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)'
  ]
};
