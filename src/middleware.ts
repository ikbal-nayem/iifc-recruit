import { NextRequest, NextResponse } from 'next/server';

const PUBLIC_FILE = /\.(.*)$/;

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api/') ||
    pathname.startsWith('/static') ||
    PUBLIC_FILE.test(pathname)
  ) {
    return NextResponse.next();
  }

  // const locale = request.cookies.get('NEXT_LOCALE')?.value || 'en';
  // request.nextUrl.locale = locale;
  
  return NextResponse.rewrite(request.nextUrl);
}
