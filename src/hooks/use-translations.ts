import { useLocale } from '@/contexts/locale-context';

/**
 * Simple hook to use translations in client components
 * Usage:
 * const t = useTranslations(translations);
 * <h1>{t.title}</h1>
 */
export const useTranslations = <T extends Record<'en' | 'bn', any>>(
	translationObject: T
): T['en'] => {
	const { locale } = useLocale();
	return translationObject[locale];
};
