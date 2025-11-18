import { NextRequest, NextResponse } from 'next/server';

const locales = ['en', 'bn'];
const defaultLocale = 'en';

function getLocale(request: NextRequest): string {
	const localeCookie = request.cookies.get('NEXT_LOCALE');
	if (localeCookie && locales.includes(localeCookie.value)) {
		return localeCookie.value;
	}

	// You could add Accept-Language header parsing here if needed
	// const languages = new Negotiator({ headers: { 'accept-language': request.headers.get('accept-language') || '' } }).languages();
	// return match(languages, locales, defaultLocale);

	return defaultLocale;
}

export function middleware(request: NextRequest) {
	const { pathname } = request.nextUrl;

	// Check if there is any supported locale in the pathname
	const pathnameHasLocale = locales.some((locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`);

	if (pathnameHasLocale) {
		return NextResponse.next();
	}

	// If no locale, redirect to the default locale
	const locale = getLocale(request);
	request.nextUrl.pathname = `/${locale}${pathname}`;
	// e.g. incoming request is /products
	// The new URL is now /en-US/products
	return NextResponse.rewrite(request.nextUrl);
}

export const config = {
	matcher: [
		// Skip all internal paths (_next, api, etc.)
		'/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)',
	],
};
