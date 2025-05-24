'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useTranslation } from '@/components/i18n/TranslationProvider';

// Product interface
interface Product {
  _id: string;
  name: string;
  description?: string;
  price: number;
  images: string[];
  gender: string;
}

export default function BasicProductDisplay() {
  const { t, locale } = useTranslation();
  const [activeTab, setActiveTab] = useState<'male' | 'female'>('male');
  const [menProducts, setMenProducts] = useState<Product[]>([]);
  const [womenProducts, setWomenProducts] = useState<Product[]>([]);
  const [isLoadingMen, setIsLoadingMen] = useState(true);
  const [isLoadingWomen, setIsLoadingWomen] = useState(true);
  
  // Mobile carousel refs for touch handling
  const mobileCarouselRef = useRef<HTMLDivElement>(null);
  const desktopMenCarouselRef = useRef<HTMLDivElement>(null);
  const desktopWomenCarouselRef = useRef<HTMLDivElement>(null);
  
  // Touch handling state
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  
  // Arrow navigation state
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  // Check scroll position for arrow visibility
  const checkScrollPosition = useCallback(() => {
    if (mobileCarouselRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = mobileCarouselRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  }, []);

  // Arrow navigation functions
  const scrollLeft = useCallback(() => {
    if (mobileCarouselRef.current) {
      const scrollAmount = 152; // Width of one product card + gap
      mobileCarouselRef.current.scrollBy({
        left: -scrollAmount,
        behavior: 'smooth'
      });
    }
  }, []);

  const scrollRight = useCallback(() => {
    if (mobileCarouselRef.current) {
      const scrollAmount = 152; // Width of one product card + gap
      mobileCarouselRef.current.scrollBy({
        left: scrollAmount,
        behavior: 'smooth'
      });
    }
  }, []);

  // Fetch men's products with error boundary
  useEffect(() => {
    const fetchMenProducts = async () => {
      try {
        setIsLoadingMen(true);
        const response = await fetch(`/api/products?gender=Homme&limit=12`, {
          cache: 'no-store',
          headers: {
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
          }
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.success && Array.isArray(data.data) && data.data.length > 0) {
          setMenProducts(data.data);
        } else {
          console.warn('No men products found');
          setMenProducts([]);
        }
      } catch (error) {
        console.error('Error fetching men products:', error);
        setMenProducts([]);
      } finally {
        setIsLoadingMen(false);
      }
    };
    
    fetchMenProducts();
  }, []);

  // Fetch women's products with error boundary
  useEffect(() => {
    const fetchWomenProducts = async () => {
      try {
        setIsLoadingWomen(true);
        const response = await fetch(`/api/products?gender=Femme&limit=12`, {
          cache: 'no-store',
          headers: {
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
          }
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.success && Array.isArray(data.data) && data.data.length > 0) {
          setWomenProducts(data.data);
        } else {
          console.warn('No women products found');
          setWomenProducts([]);
        }
      } catch (error) {
        console.error('Error fetching women products:', error);
        setWomenProducts([]);
      } finally {
        setIsLoadingWomen(false);
      }
    };
    
    fetchWomenProducts();
  }, []);

  // Update scroll position when tab changes or products load
  useEffect(() => {
    if (mobileCarouselRef.current) {
      // Reset scroll position when switching tabs
      mobileCarouselRef.current.scrollLeft = 0;
      // Check scroll position after a short delay to ensure rendering is complete
      setTimeout(checkScrollPosition, 100);
    }
  }, [activeTab, menProducts, womenProducts, checkScrollPosition]);

  // Enhanced touch handlers for better mobile experience
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  }, []);

  const handleTouchEnd = useCallback(() => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe || isRightSwipe) {
      // Swipe detected - could add custom swipe behavior here if needed
      // For now, native scroll handles the horizontal movement
    }

    setTouchStart(null);
    setTouchEnd(null);
  }, [touchStart, touchEnd]);

  // Handle scroll events to update arrow states
  const handleScroll = useCallback(() => {
    checkScrollPosition();
  }, [checkScrollPosition]);

  // Optimized Product Card Component with better performance
  const ProductCard = ({ product }: { product: Product }) => {
    const [imageError, setImageError] = useState(false);
    const [imageLoaded, setImageLoaded] = useState(false);
    const imageUrl = imageError || !product.images?.length 
      ? '/images/product-placeholder.svg' 
      : product.images[0];
    
    return (
      <Link 
        href={`/product/${product._id}`}
        className="group text-center flex flex-col hover:shadow-lg transition-all duration-300 bg-white rounded-lg p-2 h-full border border-gray-100 hover:border-[#c8a45d]/30 will-change-transform"
        style={{ contain: 'layout style paint' }}
      >
        <div className="aspect-square relative mb-2 bg-gray-50 rounded-lg overflow-hidden">
          {!imageLoaded && (
            <div className="absolute inset-0 bg-gray-100 animate-pulse rounded-lg"></div>
          )}
          <Image
            src={imageUrl}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 144px, 160px"
            className={`object-contain group-hover:scale-105 transition-transform duration-300 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            onLoad={() => setImageLoaded(true)}
            onError={() => {
              setImageError(true);
              setImageLoaded(true);
            }}
            priority={false}
            loading="lazy"
          />
        </div>
        <h3 className="text-xs font-medium mb-1 line-clamp-2 leading-tight text-gray-800 group-hover:text-[#c8a45d] transition-colors">
          {product.name}
        </h3>
        <p className="text-xs text-gray-500 mb-2 line-clamp-1 leading-tight">
          {product.description?.slice(0, 30)}{product.description && product.description.length > 30 ? '...' : ''}
        </p>
        <p className="text-[#c8a45d] font-semibold text-sm mt-auto">{product.price} {t('product.currency', 'DH')}</p>
      </Link>
    );
  };

  // Optimized Loading Skeleton
  const ProductSkeleton = () => (
    <div className="animate-pulse flex flex-col bg-white rounded-lg p-2 h-full border border-gray-100">
      <div className="aspect-square bg-gray-200 rounded-lg mb-2"></div>
      <div className="h-3 bg-gray-200 rounded mb-1"></div>
      <div className="h-3 bg-gray-200 rounded mb-2 w-3/4"></div>
      <div className="h-4 bg-gray-200 rounded w-1/3 mt-auto"></div>
    </div>
  );

  // Arrow Button Component
  const ArrowButton = ({ direction, onClick, disabled }: { direction: 'left' | 'right', onClick: () => void, disabled: boolean }) => (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`absolute top-1/2 transform -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white shadow-lg border border-gray-200 flex items-center justify-center transition-all duration-200 ${
        direction === 'left' ? 'left-2' : 'right-2'
      } ${
        disabled 
          ? 'opacity-40 cursor-not-allowed' 
          : 'hover:bg-gray-50 hover:shadow-xl hover:scale-110 active:scale-95'
      }`}
      aria-label={`Scroll ${direction}`}
    >
      <svg 
        className={`w-5 h-5 text-gray-600 ${direction === 'left' ? 'rotate-180' : ''}`} 
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
      </svg>
    </button>
  );

  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4" data-component-name="BasicProductDisplay">
        {/* Section Title */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-playfair text-[#c8a45d] mb-4">
            {t('home.featured.title', 'Parfums en Vedette')}
          </h2>
          <p className="text-gray-600 max-w-3xl mx-auto">
            {t('home.featured.subtitle', 'Découvrez notre exquise collection de parfums premium pour hommes et femmes, inspirés des parfums de renommée mondiale à des prix abordables.')}
          </p>
        </div>
        
        {/* Mobile Toggle & Optimized Carousel with Arrows */}
        <div className="block lg:hidden mb-8">
          <div className="flex justify-center mb-8">
            <div className="inline-flex items-center bg-gray-50 p-1 rounded-full border border-gray-200 shadow-sm">
              <button
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                  activeTab === 'male'
                    ? 'bg-[#c8a45d] text-white shadow-md transform scale-105'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
                onClick={() => setActiveTab('male')}
              >
                {t('home.featured.men', 'Homme')}
              </button>
              <button
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                  activeTab === 'female'
                    ? 'bg-[#c8a45d] text-white shadow-md transform scale-105'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
                onClick={() => setActiveTab('female')}
              >
                {t('home.featured.women', 'Femme')}
              </button>
            </div>
          </div>
          
          {/* Enhanced Mobile Carousel with Navigation Arrows */}
          <div className="relative w-full overflow-hidden">
            {/* Navigation Arrows */}
            <ArrowButton 
              direction="left" 
              onClick={scrollLeft} 
              disabled={!canScrollLeft}
            />
            <ArrowButton 
              direction="right" 
              onClick={scrollRight} 
              disabled={!canScrollRight}
            />
            
            <div 
              ref={mobileCarouselRef}
              className="flex overflow-x-auto gap-3 px-4 pb-4 snap-x snap-mandatory scrollbar-hide smooth-scroll"
              style={{
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
                WebkitOverflowScrolling: 'touch',
                scrollBehavior: 'smooth'
              }}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              onScroll={handleScroll}
            >
              {activeTab === 'male'
                ? (isLoadingMen
                    ? Array(6).fill(0).map((_, i) => (
                        <div className="w-36 flex-shrink-0 snap-center" key={`men-skeleton-${i}`}>
                          <ProductSkeleton />
                        </div>
                      ))
                    : menProducts.map((product, index) => (
                        <div className="w-36 flex-shrink-0 snap-center" key={`men-${product._id}-${index}`}>
                          <ProductCard product={product} />
                        </div>
                      ))
                  )
                : (isLoadingWomen
                    ? Array(6).fill(0).map((_, i) => (
                        <div className="w-36 flex-shrink-0 snap-center" key={`women-skeleton-${i}`}>
                          <ProductSkeleton />
                        </div>
                      ))
                    : womenProducts.map((product, index) => (
                        <div className="w-36 flex-shrink-0 snap-center" key={`women-${product._id}-${index}`}>
                          <ProductCard product={product} />
                        </div>
                      ))
                  )
              }
              {/* Spacer for better UX */}
              <div className="w-4 flex-shrink-0"></div>
            </div>
            
            {/* Scroll Indicator Dots */}
            <div className="flex justify-center mt-4 space-x-1">
              {(activeTab === 'male' ? menProducts : womenProducts).length > 0 && (
                Array(Math.ceil((activeTab === 'male' ? menProducts : womenProducts).length / 2)).fill(0).map((_, i) => (
                  <div
                    key={i}
                    className="w-2 h-2 rounded-full bg-gray-300 transition-colors duration-200"
                  />
                ))
              )}
            </div>
          </div>
          
          <div className="text-center mt-6">
            <Link
              href={activeTab === 'male' ? '/shop?gender=Homme' : '/shop?gender=Femme'}
              className="inline-block px-10 py-3 border border-black text-sm uppercase tracking-wide hover:bg-black hover:text-white transition-all duration-200"
            >
              {t('home.about.learnMore', 'EN SAVOIR PLUS')}
            </Link>
          </div>
        </div>

        {/* Enhanced Desktop View */}
        <div className="hidden lg:grid grid-cols-2 gap-8 relative">
          {/* Center divider */}
          <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-gray-200 transform -translate-x-1/2"></div>
          
          {/* Men's Section */}
          <div className="lg:pr-6">
            <h2 className="text-xl sm:text-2xl font-playfair mb-6 text-center text-[#c8a45d]">{t('home.featured.men', 'Homme')}</h2>
            <div className="w-full overflow-hidden">
              <div 
                ref={desktopMenCarouselRef}
                className="flex overflow-x-auto gap-4 px-2 pb-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 hover:scrollbar-thumb-gray-400"
                style={{
                  WebkitOverflowScrolling: 'touch',
                  scrollBehavior: 'smooth'
                }}
              >
                {isLoadingMen ? (
                  Array(6).fill(0).map((_, i) => (
                    <div className="w-40 flex-shrink-0" key={`men-desktop-skeleton-${i}`}>
                      <ProductSkeleton />
                    </div>
                  ))
                ) : (
                  menProducts.map((product, index) => (
                    <div className="w-40 flex-shrink-0" key={`men-desktop-${product._id}-${index}`}>
                      <ProductCard product={product} />
                    </div>
                  ))
                )}
                <div className="w-2 flex-shrink-0"></div>
              </div>
            </div>
            <div className="text-center mt-8">
              <Link
                href="/shop?gender=Homme"
                className="inline-block px-10 py-3 border border-black text-sm uppercase tracking-wide hover:bg-black hover:text-white transition-all duration-200"
              >
                {t('home.about.learnMore', 'EN SAVOIR PLUS')}
              </Link>
            </div>
          </div>

          {/* Women's Section */}
          <div className="lg:pl-6">
            <h2 className="text-xl sm:text-2xl font-playfair mb-6 text-center text-[#c8a45d]">{t('home.featured.women', 'Femme')}</h2>
            <div className="w-full overflow-hidden">
              <div 
                ref={desktopWomenCarouselRef}
                className="flex overflow-x-auto gap-4 px-2 pb-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 hover:scrollbar-thumb-gray-400"
                style={{
                  WebkitOverflowScrolling: 'touch',
                  scrollBehavior: 'smooth'
                }}
              >
                {isLoadingWomen ? (
                  Array(6).fill(0).map((_, i) => (
                    <div className="w-40 flex-shrink-0" key={`women-desktop-skeleton-${i}`}>
                      <ProductSkeleton />
                    </div>
                  ))
                ) : (
                  womenProducts.map((product, index) => (
                    <div className="w-40 flex-shrink-0" key={`women-desktop-${product._id}-${index}`}>
                      <ProductCard product={product} />
                    </div>
                  ))
                )}
                <div className="w-2 flex-shrink-0"></div>
              </div>
            </div>
            <div className="text-center mt-8">
              <Link
                href="/shop?gender=Femme"
                className="inline-block px-10 py-3 border border-black text-sm uppercase tracking-wide hover:bg-black hover:text-white transition-all duration-200"
              >
                {t('home.about.learnMore', 'EN SAVOIR PLUS')}
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-10 text-center">
          <Link
            href="/shop"
            className="inline-block px-8 py-3 bg-[#c8a45d] hover:bg-[#b08d48] text-white rounded-lg transition-colors duration-200"
          >
            Voir Tous les Parfums
          </Link>
        </div>
      </div>
    </section>
  );
}
