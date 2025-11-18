import { NextRequest, NextResponse } from 'next/server';

const locales = ['en', 'bn'];
const defaultLocale = 'en';

export function middleware(request: NextRequest) {
	// Get locale from cookie, default to 'en'
	const localeCookie = request.cookies.get('NEXT_LOCALE');
	const locale = (localeCookie?.value && locales.includes(localeCookie.value)) ? localeCookie.value : defaultLocale;

	// Add locale to request headers for server components
	const requestHeaders = new Headers(request.headers);
	requestHeaders.set('x-locale', locale);

	const response = NextResponse.next({
		request: {
			headers: requestHeaders,
		},
	});

	// Ensure locale cookie is set
	if (!localeCookie || !locales.includes(localeCookie.value)) {
		response.cookies.set('NEXT_LOCALE', defaultLocale, {
			maxAge: 365 * 24 * 60 * 60, // 1 year
			path: '/',
		});
	}

	return response;
}

export const config = {
	matcher: [
		// Skip all internal paths (_next, api, etc.)
		'/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)',
	],
};
