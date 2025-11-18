import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import en from '@/locales/en.json';
import bn from '@/locales/bn.json';

const resources = {
  en: {
    translation: en
  },
  bn: {
    translation: bn
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    debug: false, 
    interpolation: {
      escapeValue: false // not needed for react as it escapes by default
    },
    detection: {
      order: ['localStorage', 'cookie', 'navigator'],
      caches: ['localStorage', 'cookie'],
    },
  });

export default i18n;
