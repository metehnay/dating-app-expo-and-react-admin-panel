import React, { createContext, useContext } from "react";
import { I18n } from "i18n-js";
import * as Localization from "expo-localization";
import translations from "./localization";

const i18n = new I18n() as any; // Force casting to 'any' to bypass TypeScript checks

// Set up i18n-js translations and configurations
i18n.translations = translations;
i18n.fallbacks = true; // This is crucial for enabling fallbacks
i18n.defaultLocale = "en"; // Set default locale to English

const translateWithFallback = (key: string, locale: string = i18n.locale) => {
  const translation = i18n.translate(key, { locale });
  if (translation && !translation.startsWith("[missing")) {
    return translation;
  }

  // If missing in current locale, try English
  if (locale !== "en") {
    return i18n.translate(key, { locale: "en" });
  }

  return key; // If it's also missing in English, return the key itself
};

// Extracting supported locales from translations object
const supportedLocales = Object.keys(translations);

// Extracting detected locale and language
const detectedLocale = Localization.locale; // e.g. 'de-DE'
const detectedLanguage = detectedLocale.split("-")[0]; // e.g. 'de'

// Verifying and setting the locale, with appropriate fallbacks
if (supportedLocales.includes(detectedLocale)) {
  i18n.locale = detectedLocale;
} else if (supportedLocales.includes(detectedLanguage)) {
  i18n.locale = detectedLanguage;
} else {
  i18n.locale = "en"; // final fallback to English
}

const TranslationContext = createContext({
  i18n,
  t: translateWithFallback,
});

export const useTranslation = () => {
  const { t } = useContext(TranslationContext);
  return {
    t,
  };
};

export const TranslationProvider = ({ children }: any) => {
  return (
    <TranslationContext.Provider value={{ i18n, t: translateWithFallback }}>
      {children}
    </TranslationContext.Provider>
  );
};

export default TranslationProvider;
