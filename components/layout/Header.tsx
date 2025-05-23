'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faShoppingBag, faBars, faTimes } from '@fortawesome/free-solid-svg-icons';
import { getCartCount, CartProduct } from '@/lib/cart';
import { useTranslation } from '@/components/i18n/TranslationProvider';

// Extend Window interface to include cart properties
// Type definition is already declared in cart.ts, so we don't need to redeclare it here
// Using the CartProduct type imported from cart.ts

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const pathname = usePathname();
  const { t, locale } = useTranslation();
  
  // Check if we're on the home page
  const isHomePage = pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 80);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Memoize handler function for better performance
  const updateCartCount = useCallback((items: any[]) => {
    setCartCount(getCartCount());
  }, []);

  // Listen for cart updates
  useEffect(() => {
    // Simple way to subscribe to cart updates
    // In a real app, this would be using a proper state management solution
    if (typeof window !== 'undefined') {
      // Add the listener to the global cartListeners
      if (window.cartListeners) {
        window.cartListeners.push(updateCartCount);
        
        // Initial cart count
        setCartCount(getCartCount());
      }
      
      return () => {
        if (window.cartListeners) {
          window.cartListeners = window.cartListeners.filter((listener: Function) => listener !== updateCartCount);
        }
      };
    }
  }, []);

  const homeLabel = t('header.home');
  const shopLabel = t('header.shop');
  const aboutLabel = t('header.about');
  const contactLabel = t('header.contact');
  const searchLabel = t('header.search');
  const cartLabel = t('header.cart');

  const navLinks = [
    { href: '/', label: homeLabel },
    { href: '/shop', label: shopLabel },
    { href: '/about', label: aboutLabel },
    { href: '/contact', label: contactLabel },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isHomePage 
          ? (isScrolled ? 'bg-white shadow-md' : 'bg-transparent')
          : 'bg-white shadow-md'
      }`}
    >
      {/* Announcement Bar - Removed */}

      <div className="container mx-auto">
        <nav className="flex items-center justify-between py-3 px-4 lg:px-8">
          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`lg:hidden p-2 transition-colors ${
              isHomePage && !isScrolled ? 'text-white hover:text-gray-200' : 'text-gray-600 hover:text-secondary'
            }`}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <FontAwesomeIcon icon={faTimes} size="lg" /> : <FontAwesomeIcon icon={faBars} size="lg" />}
          </button>

          {/* Logo */}
          <Link href="/" className="absolute left-1/2 transform -translate-x-1/2 lg:static lg:transform-none">
            <div className="flex items-center justify-center py-2">
              {isHomePage && !isScrolled ? (
                // White logo for transparent header on homepage
                <img 
                  src="/images/logowhw.png" 
                  alt="AVANA PARFUM" 
                  className="h-14 w-auto object-contain transition-opacity opacity-95 hover:opacity-100" 
                />
              ) : (
                // Black logo for white background
                <img 
                  src="/images/lgoavana.png" 
                  alt="AVANA PARFUM" 
                  className="h-14 w-auto object-contain transition-opacity opacity-90 hover:opacity-100" 
                />
              )}
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                prefetch={true}
                className={`text-sm font-medium px-1 py-2 transition-colors ${
                  isHomePage && !isScrolled
                    ? (pathname === link.href
                      ? 'text-white font-semibold'
                      : 'text-white hover:text-gray-200')
                    : (pathname === link.href
                      ? 'text-secondary'
                      : 'text-gray-600 hover:text-secondary')
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Header Actions */}
          <div className="flex items-center space-x-4">
            <button
              className={`flex items-center justify-center w-10 h-10 transition-colors ${
                isHomePage && !isScrolled ? 'text-white hover:text-gray-200' : 'text-gray-600 hover:text-secondary'
              }`}
              aria-label={searchLabel}
            >
              <FontAwesomeIcon icon={faSearch} className="w-5 h-5" />
            </button>
            <Link
              href="/cart"
              className={`flex items-center justify-center w-10 h-10 transition-colors ${
                isHomePage && !isScrolled ? 'text-white hover:text-gray-200' : 'text-gray-600 hover:text-secondary'
              }`}
              aria-label={cartLabel}
              prefetch={true}
            >
              <div className="relative flex items-center justify-center w-6 h-6">
                <FontAwesomeIcon icon={faShoppingBag} className="text-current" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-secondary text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-medium shadow-sm">
                    {cartCount}
                  </span>
                )}
              </div>
            </Link>
          </div>
        </nav>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className={`lg:hidden fixed inset-0 top-[80px] z-40 ${
          isHomePage && !isScrolled ? 'bg-black/90' : 'bg-white'
        }`}>
          <nav className="container mx-auto py-6 px-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                prefetch={true}
                className={`block py-3 px-2 text-lg font-medium transition-colors ${
                  isHomePage && !isScrolled
                    ? (pathname === link.href
                      ? 'text-secondary'
                      : 'text-white hover:text-gray-200')
                    : (pathname === link.href
                      ? 'text-secondary'
                      : 'text-gray-600 hover:text-secondary')
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
