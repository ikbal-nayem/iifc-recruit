import { NextRequest, NextResponse } from 'next/server';

const PUBLIC_FILE = /\.(.*)$/;
const locales = ['en', 'bn'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip middleware for static files, API routes, and Next.js internals
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api/') ||
    pathname.startsWith('/static') ||
    PUBLIC_FILE.test(pathname)
  ) {
    return NextResponse.next();
  }

  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (pathnameHasLocale) return NextResponse.next();

  // Redirect based on cookie
  const localeCookie = request.cookies.get('NEXT_LOCALE')?.value || 'en';
  request.nextUrl.pathname = `/${localeCookie}${pathname}`;
  
  // Use e.g. `path*` to skip this cookie from being forwarded to AHS
  return NextResponse.redirect(request.nextUrl);
}
