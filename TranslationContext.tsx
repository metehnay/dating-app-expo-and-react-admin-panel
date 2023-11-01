import React, { createContext, useContext } from "react";
import { I18n } from "i18n-js";
import * as Localization from "expo-localization";
import translations from "./localization";

const i18n = new I18n() as any; 

i18n.translations = translations;
i18n.fallbacks = true; 
i18n.defaultLocale = "en"; 

const translateWithFallback = (key: string, locale: string = i18n.locale) => {
  const translation = i18n.translate(key, { locale });
  if (translation && !translation.startsWith("[missing")) {
    return translation;
  }

  if (locale !== "en") {
    return i18n.translate(key, { locale: "en" });
  }

  return key; 
};

const supportedLocales = Object.keys(translations);

const detectedLocale = Localization.locale;
const detectedLanguage = detectedLocale.split("-")[0]; 

if (supportedLocales.includes(detectedLocale)) {
  i18n.locale = detectedLocale;
} else if (supportedLocales.includes(detectedLanguage)) {
  i18n.locale = detectedLanguage;
} else {
  i18n.locale = "en"; 
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
