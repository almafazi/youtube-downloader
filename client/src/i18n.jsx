import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './locales/en.json';
import id from './locales/id.json';
import es from './locales/es.json'; // Import Spanish JSON
import pt from './locales/pt.json'; // Import Portuguese JSON

import LanguageDetector from 'i18next-browser-languagedetector';

i18n
  .use(LanguageDetector) // Use the language detector
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      id: { translation: id },
      es: { translation: es }, // Add Spanish translation
      pt: { translation: pt }, // Add Portuguese translation
    },
    fallbackLng: 'en', // Default language
    detection: {
      order: ['path', 'navigator'], // Detect language from the URL path
      lookupFromPathIndex: 0, // Use the first part of the path (e.g., /id)
    },
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;