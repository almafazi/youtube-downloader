import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './locales/en.json';
import id from './locales/id.json';
import es from './locales/es.json';
import pt from './locales/pt.json';
import ar from './locales/ar.json';
import vi from './locales/vi.json';
import LanguageDetector from 'i18next-browser-languagedetector';

const customLanguageDetector = {
  name: 'customPathDetector',
  lookup() {
    const path = window.location.pathname;
    if (path.startsWith('/id/')) return 'id'; // Detect as 'id' if path matches
    if (path.startsWith('/')) return 'en'; // Detect as 'id' if path matches
    const pathSegments = path.split('/');
    return pathSegments[1]; // Use the first part of the path as the language code
  },
};

i18n
  .use(LanguageDetector)
  .use({
    type: 'languageDetector',
    init: () => {},
    detect: customLanguageDetector.lookup, // Use custom lookup
    cacheUserLanguage: () => {},
  })
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      id: { translation: id },
      es: { translation: es },
      pt: { translation: pt },
      ar: { translation: ar },
      vi: { translation: vi },
    },
    fallbackLng: 'en',
    detection: {
      order: ['customPathDetector', 'navigator'], // Custom path detector first
    },
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
