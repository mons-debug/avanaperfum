'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FaSearch, FaShoppingBag, FaUser, FaBars, FaTimes } from 'react-icons/fa';
import { getCartCount } from '@/lib/cart';

// Extend Window interface to include cart properties
declare global {
  interface Window {
    cartItems?: any[];
    cartListeners?: Function[];
  }
}

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const pathname = usePathname();
  
  // Check if we're on the home page
  const isHomePage = pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 80);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Listen for cart updates
  useEffect(() => {
    // Simple way to subscribe to cart updates
    // In a real app, this would be using a proper state management solution
    if (typeof window !== 'undefined') {
      const updateCartCount = (items: any[]) => {
        setCartCount(getCartCount());
      };
      
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

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/shop', label: 'Shop' },
    { href: '/about', label: 'About' },
    { href: '/contact', label: 'Contact' },
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
        <nav className="flex items-center justify-between py-4 px-4 lg:px-8">
          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`lg:hidden p-2 transition-colors ${
              isHomePage && !isScrolled ? 'text-white hover:text-gray-200' : 'text-gray-600 hover:text-secondary'
            }`}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>

          {/* Logo */}
          <Link href="/" className="absolute left-1/2 transform -translate-x-1/2 lg:static lg:transform-none">
            <h1 className={`font-display text-2xl tracking-[0.2em] transition-colors ${
              isHomePage && !isScrolled ? 'text-white hover:text-gray-200' : 'text-primary hover:text-secondary'
            }`}>
              AVANA
            </h1>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors ${
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
              className={`p-2 transition-colors ${
                isHomePage && !isScrolled ? 'text-white hover:text-gray-200' : 'text-gray-600 hover:text-secondary'
              }`}
              aria-label="Search"
            >
              <FaSearch size={20} />
            </button>
            <Link
              href="/account"
              className={`p-2 transition-colors ${
                isHomePage && !isScrolled ? 'text-white hover:text-gray-200' : 'text-gray-600 hover:text-secondary'
              }`}
              aria-label="Account"
            >
              <FaUser size={20} />
            </Link>
            <Link
              href="/cart"
              className={`p-2 relative transition-colors ${
                isHomePage && !isScrolled ? 'text-white hover:text-gray-200' : 'text-gray-600 hover:text-secondary'
              }`}
              aria-label="Shopping cart"
            >
              <FaShoppingBag size={20} />
              <span className="absolute -top-1 -right-1 bg-secondary text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                {cartCount}
              </span>
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
                className={`block py-3 text-lg font-medium transition-colors ${
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
            <div className={`mt-6 pt-6 ${isHomePage && !isScrolled ? 'border-t border-gray-700' : 'border-t border-gray-100'}`}>
              <Link
                href="/account"
                className={`flex items-center py-3 transition-colors ${
                  isHomePage && !isScrolled
                    ? 'text-white hover:text-gray-200'
                    : 'text-gray-600 hover:text-secondary'
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <FaUser className="mr-3" />
                <span>Account</span>
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header; 