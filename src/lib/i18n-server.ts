import { headers } from 'next/headers';
import en from '@/locales/en.json';
import bn from '@/locales/bn.json';

type Locale = 'en' | 'bn';

const messages: Record<Locale, Record<string, any>> = {
	en,
	bn,
};

// Helper function to get nested values using dot notation
function getNestedValue(obj: any, path: string): string | undefined {
	const keys = path.split('.');
	let value = obj;
	
	for (const key of keys) {
		if (value && typeof value === 'object' && key in value) {
			value = value[key];
		} else {
			return undefined;
		}
	}
	
	return typeof value === 'string' ? value : undefined;
}

export async function getLocale(): Promise<Locale> {
	const headersList = await headers();
	const locale = headersList.get('x-locale');
	return (locale === 'bn' ? 'bn' : 'en') as Locale;
}

export async function getTranslations() {
	const locale = await getLocale();
	return (key: string): string => {
		const value = getNestedValue(messages[locale], key);
		return value || key;
	};
}

export function getLocaleSync(): Locale {
	// For use in client components or when headers are not available
	if (typeof window === 'undefined') {
		return 'en';
	}
	const cookie = document.cookie
		.split('; ')
		.find((row) => row.startsWith('NEXT_LOCALE='))
		?.split('=')[1];
	return (cookie === 'bn' ? 'bn' : 'en') as Locale;
}

export function t(locale: Locale, key: string): string {
	const value = getNestedValue(messages[locale], key);
	return value || key;
}
