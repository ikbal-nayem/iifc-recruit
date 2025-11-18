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

	if (pathnameHasLocale) {
		return NextResponse.next();
	}

	// Get locale from cookies or accept-language header
	const locale = request.cookies.get('NEXT_LOCALE')?.value || 'en';
	request.nextUrl.pathname = `/${locale}${pathname}`;

	// Redirect to the new URL with the locale prefix
	return NextResponse.redirect(request.nextUrl);
}

export const config = {
	matcher: [
		// Skip all internal paths (_next)
		'/((?!api|_next/static|_next/image|favicon.ico).*)',
	],
};
