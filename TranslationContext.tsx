import React, { createContext, useContext } from "react";
import { I18n } from "i18n-js";
import * as Localization from "expo-localization";
import  translations  from "./localization";

const i18n = new I18n(translations);

// Extracting supported locales from translations object
const supportedLocales = Object.keys(translations);

// Extracting detected locale and language
const detectedLocale = Localization.locale; // e.g. 'de-DE'
const detectedLanguage = detectedLocale.split("-")[0]; // e.g. 'de'
i18n.defaultLocale = 'en'; // Set default locale to English

// Verifying and setting the locale, with appropriate fallbacks
if (supportedLocales.includes(detectedLocale)) {
  i18n.locale = detectedLocale;
} else if (supportedLocales.includes(detectedLanguage)) {
  i18n.locale = detectedLanguage;
} else {
  i18n.locale = "en"; // final fallback to English
}

const TranslationContext = createContext(i18n);

export const useTranslation = () => {
  return useContext(TranslationContext);
};

export const TranslationProvider = ({ children }: any) => {
  return (
    <TranslationContext.Provider value={i18n}>
      {children}
    </TranslationContext.Provider>
  );
};
