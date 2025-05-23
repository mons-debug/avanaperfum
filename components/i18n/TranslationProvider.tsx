'use client';

import { createContext, useContext, useState, useEffect, ReactNode, useMemo } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { I18nextProvider } from 'react-i18next';
import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import resourcesToBackend from 'i18next-resources-to-backend';
import Cookies from 'js-cookie';

// Load French translations first for faster initial rendering
import frCommon from '../../public/locales/fr/common.json';

// Pre-initialize i18next to avoid delays
i18next
  .use(initReactI18next)
  .use(LanguageDetector)
  .init({
    resources: {
      fr: {
        common: frCommon
      },
      en: {} // Will be loaded dynamically
    },
    lng: 'fr', // Only French
    fallbackLng: 'fr',
    supportedLngs: ['fr'],
    defaultNS: 'common',
    fallbackNS: 'common',
    react: {
      useSuspense: false,
    },
    // Interpolation configuration
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['cookie', 'localStorage', 'htmlTag', 'navigator'],
      lookupCookie: 'NEXT_LOCALE',
      caches: ['cookie', 'localStorage'],
    },
  });

// Cache for loaded languages to avoid reloading
const loadedLanguages: Record<string, boolean> = { fr: true };

// Dynamically load other languages
const loadResources = async (locale: string) => {
  if (loadedLanguages[locale]) return; // Already loaded
  
  try {
    const module = await import(`../../public/locales/${locale}/common.json`);
    i18next.addResourceBundle(locale, 'common', module.default);
    loadedLanguages[locale] = true;
  } catch (error) {
    console.error(`Failed to load translations for ${locale}:`, error);
  }
};

interface TranslationContextType {
  locale: string;
  setLocale: (locale: string) => void;
  t: (key: string, options?: any) => string;
  isLoading: boolean;
}

const TranslationContext = createContext<TranslationContextType | undefined>(undefined);

interface TranslationProviderProps {
  children: ReactNode;
  locale?: string;
}

export const TranslationProvider = ({ children, locale = 'fr' }: TranslationProviderProps) => {
  // Always use French
  const initialLocale = 'fr';
  
  const [activeLocale, setActiveLocale] = useState(initialLocale);
  const [isLoading, setIsLoading] = useState(false); // French is pre-loaded, no loading needed
  const router = useRouter();
  const pathname = usePathname();
  
  // Load translations on initial render and when language changes
  useEffect(() => {
    const initializeLanguage = async () => {
      setIsLoading(true);
      
      // Load the language resources if not already loaded
      await loadResources(activeLocale);
      
      // Change language
      await i18next.changeLanguage(activeLocale);
      
      // Update document language
      document.documentElement.dir = 'ltr'; // Always LTR since we removed Arabic
      document.documentElement.lang = activeLocale;
      
      // Mark as ready
      setIsLoading(false);
    };
    
    initializeLanguage();
  }, [activeLocale]);

  // No need to preload other languages since we only use French
  useEffect(() => {
    // Empty effect - we don't need to preload any other languages
  }, []);

  const setLocale = (newLocale: string) => {
    // Always keep French, ignore any attempts to change language
    if (newLocale !== 'fr') return;
  };

  const t = (key: string, options?: any): string => {
    return i18next.t(key, options) as string;
  };

  return (
    <TranslationContext.Provider value={{ locale: activeLocale, setLocale, t, isLoading }}>
      <I18nextProvider i18n={i18next}>
        <div className="ltr">
          {!isLoading ? children : (
            <div className="translation-loading fixed inset-0 flex items-center justify-center bg-white bg-opacity-80 z-50">
              <div className="text-center p-4 rounded-lg bg-white shadow-md">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-secondary mx-auto mb-2"></div>
                <span className="text-gray-700">Loading translations...</span>
              </div>
            </div>
          )}
        </div>
      </I18nextProvider>
    </TranslationContext.Provider>
  );
};

export const useTranslation = () => {
  const context = useContext(TranslationContext);
  if (context === undefined) {
    throw new Error('useTranslation must be used within a TranslationProvider');
  }
  return context;
}; 