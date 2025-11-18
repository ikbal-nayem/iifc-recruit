/**
 * COMPARISON: Old vs New Locale Usage Pattern
 * 
 * ============================================
 * OLD PATTERN (Complex - 30+ lines of boilerplate)
 * ============================================
 */

// BEFORE - Old way (lots of boilerplate):
/*
'use client';
import { useEffect, useState } from 'react';

export default function OldWay() {
  const [isClient, setIsClient] = useState(false);
  const [locale, setLocale] = useState<'en' | 'bn'>('en');

  useEffect(() => {
    setIsClient(true);
    const cookieLocale = document.cookie
      .split('; ')
      .find((row) => row.startsWith('NEXT_LOCALE='))
      ?.split('=')[1] as 'en' | 'bn' | undefined;

    if (cookieLocale && (cookieLocale === 'en' || cookieLocale === 'bn')) {
      setLocale(cookieLocale);
    }
  }, []);

  const t = translations[locale];

  if (!isClient) return null; // Hydration guard

  return <h1>{t.title}</h1>;
}
*/

/**
 * ============================================
 * NEW PATTERN (Simple - 3 lines!)
 * ============================================
 */

'use client';

import { useTranslations } from '@/hooks/use-translations';

const translations = {
  en: {
    title: 'Welcome',
    description: 'This is much simpler!',
  },
  bn: {
    title: 'স্বাগতম',
    description: 'এটি অনেক সহজ!',
  }
};

export default function NewWay() {
  const t = useTranslations(translations);

  // That's it! No useState, no useEffect, no hydration guard needed
  return <h1>{t.title}</h1>;
}

/**
 * ============================================
 * HOW IT WORKS
 * ============================================
 * 
 * 1. useTranslations() hook reads from LocaleContext
 * 2. LocaleContext provides current locale ('en' or 'bn')
 * 3. Hook automatically returns correct translation object
 * 4. No manual cookie reading, no hydration issues, no boilerplate
 * 
 * ============================================
 * SETUP (One-time in root layout)
 * ============================================
 * 
 * In src/app/layout.tsx:
 * 
 * import { LocaleProvider } from '@/contexts/locale-context';
 * 
 * export default function RootLayout({ children }) {
 *   return (
 *     <html>
 *       <body>
 *         <LocaleProvider>
 *           {children}
 *         </LocaleProvider>
 *       </body>
 *     </html>
 *   );
 * }
 * 
 * ============================================
 * GETTING LOCALE VALUE
 * ============================================
 * 
 * If you just need the locale string (e.g., for API calls):
 * 
 * import { useLocale } from '@/contexts/locale-context';
 * 
 * const { locale } = useLocale();
 * console.log(locale); // 'en' or 'bn'
 * 
 * ============================================
 * CHANGING LOCALE
 * ============================================
 * 
 * const { setLocale } = useLocale();
 * 
 * <button onClick={() => setLocale('bn')}>
 *   Switch to Bengali
 * </button>
 */
