'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { getCartCount, CartProduct } from '@/lib/cart';
import { useTranslation } from '@/components/i18n/TranslationProvider';

// Extend Window interface to include cart properties
// Type definition is already declared in cart.ts, so we don't need to redeclare it here
// Using the CartProduct type imported from cart.ts

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [navigatingToProduct, setNavigatingToProduct] = useState<string | null>(null);
  const [cartCount, setCartCount] = useState(0);
  const pathname = usePathname();
  const router = useRouter();
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

  // Search functionality
  const performSearch = useCallback(async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const response = await fetch(`/api/products?search=${encodeURIComponent(query)}&limit=8`);
      const data = await response.json();
      
      if (data.success && Array.isArray(data.data)) {
        setSearchResults(data.data);
      } else {
        setSearchResults([]);
      }
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  }, []);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery) {
        performSearch(searchQuery);
      } else {
        setSearchResults([]);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery, performSearch]);

  // Handle search submit
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
      setSearchQuery('');
    }
  };

  // Close search on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsSearchOpen(false);
      }
    };

    if (isSearchOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isSearchOpen]);

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
            {isMobileMenuOpen ? (
              /* Close icon */
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-6 h-6"
              >
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            ) : (
              /* Menu icon */
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-6 h-6"
              >
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line>
              </svg>
            )}
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
          <div className="flex items-center space-x-0">
            <button
              onClick={() => setIsSearchOpen(true)}
              className={`flex items-center justify-center w-10 h-10 transition-colors ${
                isHomePage && !isScrolled ? 'text-white hover:text-gray-200' : 'text-gray-600 hover:text-secondary'
              }`}
              aria-label={searchLabel}
            >
              {/* Clean SVG search icon */}
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-5 h-5"
              >
                <circle cx="11" cy="11" r="8"></circle>
                <path d="m21 21-4.35-4.35"></path>
              </svg>
            </button>
            <Link
              href="/cart"
              className={`relative flex items-center justify-center w-16 h-16 mr-2 transition-colors ${
                isHomePage && !isScrolled ? 'text-white hover:text-gray-200' : 'text-gray-600 hover:text-secondary'
              }`}
              aria-label={cartLabel}
              prefetch={true}
            >
              <div className="relative flex items-center justify-center -ml-1">
                {/* Clean SVG shopping bag icon */}
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-6 h-6"
                >
                  <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                  <line x1="3" y1="6" x2="21" y2="6"></line>
                  <path d="m16 10a4 4 0 0 1-8 0"></path>
                </svg>
                
                {/* Cart count badge with improved positioning */}
                {cartCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-[#c8a45d] text-white text-xs font-bold rounded-full min-w-[20px] h-[20px] flex items-center justify-center px-1.5 shadow-lg border-2 border-white">
                    {cartCount > 99 ? '99+' : cartCount}
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

      {/* Search Modal */}
      {isSearchOpen && (
        <div className="fixed inset-0 bg-black/50 z-[60] flex items-start justify-center pt-20">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4 max-h-[80vh] overflow-hidden">
            {/* Search Header */}
            <div className="flex items-center p-4 border-b border-gray-200">
              <form onSubmit={handleSearchSubmit} className="flex-1">
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Rechercher des parfums..."
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#c8a45d] focus:border-[#c8a45d]"
                    autoFocus
                  />
                  <svg
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                  </svg>
                </div>
              </form>
              <button
                onClick={() => setIsSearchOpen(false)}
                className="ml-4 p-2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>

            {/* Search Results */}
            <div className="max-h-96 overflow-y-auto">
              {isSearching ? (
                <div className="flex items-center justify-center p-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#c8a45d]"></div>
                  <span className="ml-3 text-gray-600">Recherche en cours...</span>
                </div>
              ) : searchQuery && searchResults.length > 0 ? (
                <div className="p-4">
                  <h3 className="text-sm font-medium text-gray-900 mb-3">
                    Résultats de recherche ({searchResults.length})
                  </h3>
                  <div className="space-y-3">
                    {searchResults.map((product: any) => (
                      <Link
                        key={product._id}
                        href={`/product/${product._id}`}
                        onClick={(e) => {
                          setNavigatingToProduct(product._id);
                          setIsSearchOpen(false);
                          // Small delay to show loading state
                          setTimeout(() => setNavigatingToProduct(null), 1500);
                        }}
                        className="flex items-center p-3 hover:bg-gray-50 rounded-lg transition-colors relative"
                        prefetch={true}
                      >
                        {navigatingToProduct === product._id && (
                          <div className="absolute inset-0 bg-gray-50/90 flex items-center justify-center rounded-lg">
                            <div className="flex items-center text-sm text-gray-600">
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#c8a45d] mr-2"></div>
                              Chargement...
                            </div>
                          </div>
                        )}
                        <img
                          src={product.images?.[0] || '/images/product-placeholder.svg'}
                          alt={product.name}
                          className="w-12 h-12 object-cover rounded-lg mr-3"
                        />
                        <div className="flex-1">
                          <h4 className="text-sm font-medium text-gray-900">{product.name}</h4>
                          <p className="text-sm text-gray-500">{product.gender} • {product.price} DH</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                  <div className="mt-4 pt-3 border-t border-gray-200">
                    <button
                      onClick={() => {
                        setNavigatingToProduct('all-results');
                        router.push(`/shop?search=${encodeURIComponent(searchQuery)}`);
                        setIsSearchOpen(false);
                        setTimeout(() => setNavigatingToProduct(null), 1500);
                      }}
                      className="w-full py-2 px-4 bg-[#c8a45d] text-white rounded-lg hover:bg-[#b08d48] transition-colors relative"
                      disabled={navigatingToProduct === 'all-results'}
                    >
                      {navigatingToProduct === 'all-results' ? (
                        <div className="flex items-center justify-center">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Chargement...
                        </div>
                      ) : (
                        'Voir tous les résultats'
                      )}
                    </button>
                  </div>
                </div>
              ) : searchQuery && searchResults.length === 0 && !isSearching ? (
                <div className="p-8 text-center">
                  <svg className="mx-auto w-12 h-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                  </svg>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun résultat trouvé</h3>
                  <p className="text-gray-500">Essayez d'autres mots-clés ou parcourez nos collections.</p>
                </div>
              ) : (
                <div className="p-8 text-center">
                  <svg className="mx-auto w-12 h-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                  </svg>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Commencez votre recherche</h3>
                  <p className="text-gray-500">Tapez le nom d'un parfum, une marque ou un type de fragrance.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
