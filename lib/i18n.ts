import { createInstance } from 'i18next';
import { initReactI18next } from 'react-i18next';
import resourcesToBackend from 'i18next-resources-to-backend';
import LanguageDetector from 'i18next-browser-languagedetector';

export const initI18next = async (locale: string, ns: string | string[]) => {
  const i18nInstance = createInstance();
  await i18nInstance
    .use(initReactI18next)
    .use(LanguageDetector)
    .use(resourcesToBackend((language: string, namespace: string) => 
      import(`../public/locales/${language}/${namespace}.json`)
    ))
    .init({
      lng: locale,
      fallbackLng: 'en',
      supportedLngs: ['en', 'fr', 'ar'],
      defaultNS: 'common',
      fallbackNS: 'common',
      ns,
      react: {
        useSuspense: false,
      },
      interpolation: {
        escapeValue: false,
      },
      detection: {
        order: ['path', 'htmlTag', 'cookie', 'navigator'],
      },
    });

  return i18nInstance;
};

export async function getTranslation(locale: string, ns: string | string[] = 'common') {
  const i18nextInstance = await initI18next(locale, ns);
  return {
    t: i18nextInstance.getFixedT(locale, Array.isArray(ns) ? ns[0] : ns),
    i18n: i18nextInstance,
  };
} 