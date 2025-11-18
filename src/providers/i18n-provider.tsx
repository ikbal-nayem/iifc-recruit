'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';

type Locale = 'en' | 'bn';

interface I18nContextType {
	locale: Locale;
	setLocale: (locale: Locale) => void;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export function I18nProvider({ children }: { children: React.ReactNode }) {
	const [locale, setLocaleState] = useState<Locale>('en');
	const [isClient, setIsClient] = useState(false);

	// Hydration fix - get initial locale from cookie
	useEffect(() => {
		setIsClient(true);

		const cookieLocale = document.cookie
			.split('; ')
			.find((row) => row.startsWith('NEXT_LOCALE='))
			?.split('=')[1] as Locale | undefined;

		if (cookieLocale && (cookieLocale === 'en' || cookieLocale === 'bn')) {
			setLocaleState(cookieLocale);
		}
	}, []);

	const setLocale = useCallback((newLocale: Locale) => {
		setLocaleState(newLocale);
		// Update cookie
		document.cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=${365 * 24 * 60 * 60}`;
		// Trigger page reload to refresh server component translations
		window.location.reload();
	}, []);

	if (!isClient) {
		return children;
	}

	return (
		<I18nContext.Provider value={{ locale, setLocale }}>
			{children}
		</I18nContext.Provider>
	);
}

export function useI18nClient() {
	const context = useContext(I18nContext);
	if (!context) {
		throw new Error('useI18nClient must be used within I18nProvider');
	}
	return context;
}

