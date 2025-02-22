import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
  en: {
    translation: {
      // English translations
    },
  },
  hi: {
    translation: {
      // Hindi translations
    },
  },
  mr: {
    translation: {
      // Marathi translations
    },
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: "en",
  interpolation: {
    escapeValue: false,
  },
  fallbackLng: "en",
});

export default i18n;
