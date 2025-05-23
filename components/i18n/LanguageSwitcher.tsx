'use client';

import { useState, useEffect, useRef } from 'react';
import { useTranslation } from './TranslationProvider';
import { IoLanguage } from 'react-icons/io5';
import { IoMdArrowDropdown } from 'react-icons/io';

interface Language {
  code: string;
  name: string;
  flag: string;
}

const languages: Language[] = [
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
];

const LanguageSwitcher = () => {
  const { locale, setLocale } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  // Ensure we have a valid current language
  const currentLanguage = languages.find(lang => lang.code === locale) || languages[0];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const changeLanguage = (code: string) => {
    // Make sure we don't reload if the language is already selected
    if (code !== locale) {
      setLocale(code);
    }
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        type="button"
        onClick={toggleDropdown}
        className="inline-flex items-center justify-center px-3 py-2 text-sm font-medium text-gray-700 hover:text-secondary transition-colors bg-gray-100 rounded-md shadow-sm border border-gray-300 hover:border-secondary"
        aria-expanded={isOpen}
        aria-haspopup="true"
        data-component-name="LanguageSwitcher"
      >
        <IoLanguage className="mr-1 text-secondary" size={18} />
        <span className="mr-1">{currentLanguage.flag}</span>
        <span className={`${locale === 'ar' ? 'mr-1' : 'ml-1'}`}>{currentLanguage.code.toUpperCase()}</span>
        <IoMdArrowDropdown className="ml-1 text-gray-500" />
      </button>

      {isOpen && (
        <div
          className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-50"
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="language-menu"
        >
          <div className="py-1" role="none">
            {languages.map((language) => (
              <button
                key={language.code}
                onClick={() => changeLanguage(language.code)}
                className={`w-full text-left block px-4 py-2 text-sm ${
                  locale === language.code ? 'bg-gray-100 text-secondary' : 'text-gray-700 hover:bg-gray-50'
                }`}
                role="menuitem"
                data-component-name="LanguageSwitcher"
              >
                <span className="mr-2">{language.flag}</span>
                {language.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default LanguageSwitcher; 