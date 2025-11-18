'use client';

import { createContext, useContext, useEffect, useState } from 'react';

type Locale = 'en' | 'bn';

interface LocaleContextType {
	locale: Locale;
	setLocale: (locale: Locale) => void;
}

const LocaleContext = createContext<LocaleContextType | undefined>(undefined);

export const LocaleProvider = ({ children }: { children: React.ReactNode }) => {
	const [locale, setLocaleState] = useState<Locale>('en');
	const [isMounted, setIsMounted] = useState(false);

	useEffect(() => {
		const cookieLocale = document.cookie
			.split('; ')
			.find((row) => row.startsWith('NEXT_LOCALE='))
			?.split('=')[1] as Locale | undefined;

		if (cookieLocale === 'en' || cookieLocale === 'bn') {
			setLocaleState(cookieLocale);
		}
		setIsMounted(true);
	}, []);

	const setLocale = (newLocale: Locale) => {
		setLocaleState(newLocale);
		document.cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=${60 * 60 * 24 * 365}`;
		window.location.reload();
	};

	return (
		<LocaleContext.Provider value={{ locale: isMounted ? locale : 'en', setLocale }}>
			{children}
		</LocaleContext.Provider>
	);
};

export const useLocale = () => {
	const context = useContext(LocaleContext);
	if (!context) {
		throw new Error('useLocale must be used within LocaleProvider');
	}
	return context;
};
