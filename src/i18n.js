// src/i18n.js
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import HttpApi from 'i18next-http-backend';

// Initialize i18next
i18n
  .use(initReactI18next) // Connects react-i18next to the i18next instance
  .use(LanguageDetector) // Detects the user's language
  .use(HttpApi) // Loads translations using http (default public/assets/locals)
  .init({
    fallbackLng: 'en', // Default language
    debug: true, // Set to true to see console output for debugging
    interpolation: {
      escapeValue: false, // React already handles escaping
    },
    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json', // Path to translation files
    },
  });

export default i18n;
