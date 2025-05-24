'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { getCartCount } from '@/lib/cart';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [showToast, setShowToast] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Update cart count when cart changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Initialize cart count
      setCartCount(getCartCount());
      
      // Listen for cart updates
      const handleCartChange = () => {
        const newCount = getCartCount();
        const oldCount = cartCount;
        setCartCount(newCount);
        
        // Show toast if item was added (count increased)
        if (newCount > oldCount && newCount > 0) {
          setShowToast(true);
          setTimeout(() => setShowToast(false), 3000);
        }
      };
      
      window.cartListeners = window.cartListeners || [];
      window.cartListeners.push(handleCartChange);
      
      return () => {
        if (window.cartListeners) {
          window.cartListeners = window.cartListeners.filter(listener => listener !== handleCartChange);
        }
      };
    }
  }, [cartCount]);

  const navLinks = [
    { href: '/', label: 'Accueil' },
    { href: '/shop', label: 'Boutique' },
    { href: '/about', label: 'À propos' },
    { href: '/contact', label: 'Contact' },
  ];

  return (
    <>
      <header 
        className={`fixed w-full z-50 transition-all duration-300 ${
          isScrolled ? 'bg-black/95 backdrop-blur-sm' : 'bg-transparent'
        }`}
      >
        <div className="container mx-auto px-4">
          <nav className="flex items-center justify-between h-20">
            {/* Mobile Menu Button */}
            <button
              className="lg:hidden text-white hover:text-[#c8a45d] transition-colors p-2"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isMenuOpen ? (
                  <path d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-8">
              {navLinks.slice(0, 2).map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm tracking-wider hover:text-[#c8a45d] transition-colors ${
                    pathname === link.href ? 'text-[#c8a45d]' : 'text-white'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Logo */}
            <Link href="/" className="absolute left-1/2 transform -translate-x-1/2 lg:static lg:transform-none">
              <h1 className="font-playfair text-2xl text-[#c8a45d] tracking-[0.2em]">
                AVANA PARFUM
              </h1>
            </Link>

            {/* Desktop Right Navigation */}
            <div className="hidden lg:flex items-center space-x-8">
              {navLinks.slice(2).map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm tracking-wider hover:text-[#c8a45d] transition-colors ${
                    pathname === link.href ? 'text-[#c8a45d]' : 'text-white'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Shopping Cart Icon */}
            <Link
              href="/cart"
              className="relative text-white hover:text-[#c8a45d] transition-colors p-2 flex items-center justify-center"
              aria-label={`Panier (${cartCount} articles)`}
            >
              <svg
                className="w-6 h-6"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              
              {/* Cart Count Badge */}
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#c8a45d] text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium min-w-[20px]">
                  {cartCount > 99 ? '99+' : cartCount}
                </span>
              )}
            </Link>
          </nav>

          {/* Mobile Menu */}
          <AnimatePresence>
            {isMenuOpen && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
                className="lg:hidden absolute left-0 right-0 bg-black/95 backdrop-blur-sm"
              >
                <nav className="py-4">
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={`block px-4 py-3 text-center text-sm tracking-wider hover:text-[#c8a45d] transition-colors ${
                        pathname === link.href ? 'text-[#c8a45d]' : 'text-white'
                      }`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {link.label}
                    </Link>
                  ))}
                  <Link
                    href="/cart"
                    className="block px-4 py-3 text-center text-sm tracking-wider text-white hover:text-[#c8a45d] transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Panier ({cartCount})
                  </Link>
                </nav>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </header>

      {/* Toast Notification for Cart Add */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -50, scale: 0.8 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="fixed top-24 right-4 z-50 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center space-x-3"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
            <span className="font-medium">Produit ajouté au panier!</span>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Header; 