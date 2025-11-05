'use client';

import { ACCESS_TOKEN, AUTH_INFO, REFRESH_TOKEN } from '@/constants/auth.constant';

export const isBrowser = typeof window !== 'undefined';
export const isServer = typeof window === 'undefined';

export const LocalStorageService = {
	set: (key: string, value: any): void => {
		if (isBrowser) {
			localStorage.setItem(key, JSON.stringify(value));
		}
	},
	get: (key: string): any | null => {
		if (isBrowser) {
			return JSON.parse(localStorage.getItem(key) || 'null');
		}
		return null;
	},
	delete: (key: string): void => {
		if (isBrowser) {
			localStorage.removeItem(key);
		}
	},
	clear: (): void => {
		if (isBrowser) {
			localStorage.clear();
		}
	},
};

export const SessionStorageService = {
	set: (key: string, value: any): void => {
		if (isBrowser) {
			sessionStorage.setItem(key, JSON.stringify(value));
		}
	},
	get: (key: string): any | null => {
		if (isBrowser) {
			return JSON.parse(sessionStorage.getItem(key) || 'null');
		}
		return null;
	},
	delete: (key: string): void => {
		if (isBrowser) {
			sessionStorage.removeItem(key);
		}
	},
	clear: (): void => {
		if (isBrowser) {
			sessionStorage.clear();
		}
	},
};

export class CookieService {
	static get(name: string): string | null {
		if (!isBrowser) {
			// Server-side: access cookies from headers
			const { cookies } = require('next/headers');
			return cookies().get(name)?.value || null;
		}

		// Client-side
		const value = `; ${document.cookie}`;
		const parts = value.split(`; ${name}=`);
		if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
		return null;
	}

	static set(name: string, value: string, days?: number) {
		if (!isBrowser) return;

		let expires = '';
		if (days) {
			const date = new Date();
			date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
			expires = `; expires=${date.toUTCString()}`;
		}
		document.cookie = `${name}=${value || ''}${expires}; path=/`;
	}

	static remove(name: string) {
		document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
	}
}

export const clearAuthInfo = () => {
	CookieService.remove(ACCESS_TOKEN);
	CookieService.remove(REFRESH_TOKEN);
	LocalStorageService.delete(AUTH_INFO);
	SessionStorageService.delete('redirectUrl');
};
