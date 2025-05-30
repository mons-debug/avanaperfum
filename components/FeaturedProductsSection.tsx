'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FaArrowLeft, FaArrowRight, FaWhatsapp, FaShoppingCart, FaPlus, FaCheck } from 'react-icons/fa';
import { generateSingleProductWhatsAppURL } from '@/lib/whatsapp';
import { addToCart, removeFromCart, isInCart } from '@/lib/cart';

// Product type definition
interface Product {
  _id: string;
  name: string;
  description?: string;
  price: number;
  images: string[];
  gender: string;
  volume: string;
  inspiredBy?: string;
}

export default function FeaturedProductsSection() {
  const [activeGender, setActiveGender] = useState<'Homme' | 'Femme'>('Homme');
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Touch/swipe functionality DISABLED to prevent scroll conflicts
  // const [touchStart, setTouchStart] = useState<number | null>(null);
  // const [touchEnd, setTouchEnd] = useState<number | null>(null);
  // const [isUserInteracting, setIsUserInteracting] = useState(false);

  // Minimum swipe distance (in px) - DISABLED
  // const minSwipeDistance = 50;

  // Touch event handlers - DISABLED to prevent scroll conflicts
  // const onTouchStart = (e: React.TouchEvent) => {
  //   setIsUserInteracting(true);
  //   setTouchEnd(null);
  //   setTouchStart(e.targetTouches[0].clientX);
  //   e.preventDefault(); // Prevent scrolling
  // };

  // const onTouchMove = (e: React.TouchEvent) => {
  //   setTouchEnd(e.targetTouches[0].clientX);
  //   e.preventDefault(); // Prevent scrolling
  // };

  // const onTouchEnd = (e: React.TouchEvent) => {
  //   e.preventDefault(); // Prevent scrolling
    
  //   if (!touchStart || !touchEnd) {
  //     setIsUserInteracting(false);
  //     return;
  //   }
    
  //   const distance = touchStart - touchEnd;
  //   const isLeftSwipe = distance > minSwipeDistance;
  //   const isRightSwipe = distance < -minSwipeDistance;

  //   if (isLeftSwipe) {
  //     nextSlide();
  //   } else if (isRightSwipe) {
  //     prevSlide();
  //   }

  //   // Reset interaction state after a delay
  //   setTimeout(() => {
  //     setIsUserInteracting(false);
  //   }, 500);
  // };

  // Fetch products based on selected gender (unified for mobile and desktop)
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/products?gender=${activeGender}&limit=8`, {
          cache: 'no-store',
          headers: { 'Cache-Control': 'no-cache' }
        });
        const data = await response.json();
        
        if (data.success && Array.isArray(data.data) && data.data.length > 0) {
          setProducts(data.data);
        } else {
          // Fallback data
          setProducts([
            {
              _id: `sample-${activeGender}-1`,
              name: `${activeGender} Classic`,
              description: `A sophisticated fragrance for the modern ${activeGender === 'Homme' ? 'man' : 'woman'}`,
              price: 299,
              volume: '100ml',
              gender: activeGender,
              images: ['/images/product-placeholder.svg']
            },
            {
              _id: `sample-${activeGender}-2`,
              name: `${activeGender} Sport`,
              description: `An energetic scent for active lifestyles`,
              price: 250,
              volume: '50ml',
              gender: activeGender,
              images: ['/images/product-placeholder.svg']
            },
            {
              _id: `sample-${activeGender}-3`,
              name: `${activeGender} Elegance`,
              description: `A distinguished fragrance with premium notes`,
              price: 350,
              volume: '100ml',
              gender: activeGender,
              images: ['/images/product-placeholder.svg']
            },
            {
              _id: `sample-${activeGender}-4`,
              name: `${activeGender} Luxury`,
              description: `An exclusive fragrance with rare ingredients`,
              price: 399,
              volume: '100ml',
              gender: activeGender,
              images: ['/images/product-placeholder.svg']
            },
            {
              _id: `sample-${activeGender}-5`,
              name: `${activeGender} Premium`,
              description: `A premium fragrance with exquisite notes`,
              price: 450,
              volume: '100ml',
              gender: activeGender,
              images: ['/images/product-placeholder.svg']
            },
            {
              _id: `sample-${activeGender}-6`,
              name: `${activeGender} Signature`,
              description: `A signature scent for special occasions`,
              price: 380,
              volume: '75ml',
              gender: activeGender,
              images: ['/images/product-placeholder.svg']
            },
            {
              _id: `sample-${activeGender}-7`,
              name: `${activeGender} Intense`,
              description: `An intense fragrance for bold personalities`,
              price: 420,
              volume: '100ml',
              gender: activeGender,
              images: ['/images/product-placeholder.svg']
            },
            {
              _id: `sample-${activeGender}-8`,
              name: `${activeGender} Royal`,
              description: `A royal fragrance fit for royalty`,
              price: 500,
              volume: '100ml',
              gender: activeGender,
              images: ['/images/product-placeholder.svg']
            }
          ]);
        }
        setCurrentSlide(0);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching products:', error);
        // Set fallback products on error
        setProducts([
          {
            _id: `fallback-${activeGender}-1`,
            name: `${activeGender} Classic`,
            description: `A sophisticated fragrance for the modern ${activeGender === 'Homme' ? 'man' : 'woman'}`,
            price: 299,
            volume: '100ml',
            gender: activeGender,
            images: ['/images/product-placeholder.svg']
          },
          {
            _id: `fallback-${activeGender}-2`,
            name: `${activeGender} Sport`,
            description: `An energetic scent for active lifestyles`,
            price: 250,
            volume: '50ml',
            gender: activeGender,
            images: ['/images/product-placeholder.svg']
          },
          {
            _id: `fallback-${activeGender}-3`,
            name: `${activeGender} Elegance`,
            description: `A distinguished fragrance with premium notes`,
            price: 350,
            volume: '100ml',
            gender: activeGender,
            images: ['/images/product-placeholder.svg']
          },
          {
            _id: `fallback-${activeGender}-4`,
            name: `${activeGender} Luxury`,
            description: `An exclusive fragrance with rare ingredients`,
            price: 399,
            volume: '100ml',
            gender: activeGender,
            images: ['/images/product-placeholder.svg']
          },
          {
            _id: `fallback-${activeGender}-5`,
            name: `${activeGender} Premium`,
            description: `A premium fragrance with exquisite notes`,
            price: 450,
            volume: '100ml',
            gender: activeGender,
            images: ['/images/product-placeholder.svg']
          },
          {
            _id: `fallback-${activeGender}-6`,
            name: `${activeGender} Signature`,
            description: `A signature scent for special occasions`,
            price: 380,
            volume: '75ml',
            gender: activeGender,
            images: ['/images/product-placeholder.svg']
          },
          {
            _id: `fallback-${activeGender}-7`,
            name: `${activeGender} Intense`,
            description: `An intense fragrance for bold personalities`,
            price: 420,
            volume: '100ml',
            gender: activeGender,
            images: ['/images/product-placeholder.svg']
          },
          {
            _id: `fallback-${activeGender}-8`,
            name: `${activeGender} Royal`,
            description: `A royal fragrance fit for royalty`,
            price: 500,
            volume: '100ml',
            gender: activeGender,
            images: ['/images/product-placeholder.svg']
          }
        ]);
        setCurrentSlide(0);
        setIsLoading(false);
      }
    };
    
    fetchProducts();
  }, [activeGender]);

  // Calculate slides for mobile (2 products per slide) and desktop (4 products per slide)
  const productsPerSlide = 2; // Mobile: 2 products per slide
  const totalSlides = Math.ceil(products.length / productsPerSlide); // Mobile slides

  // Navigation functions
  const nextSlide = useCallback(() => {
    // Only for mobile
    setCurrentSlide(current => (current >= totalSlides - 1 ? 0 : current + 1));
  }, [totalSlides]);

  const prevSlide = useCallback(() => {
    // Only for mobile
    setCurrentSlide(current => (current <= 0 ? totalSlides - 1 : current - 1));
  }, [totalSlides]);

  // Auto-scroll functionality (mobile only) - DISABLED for manual control
  // useEffect(() => {
  //   if (products.length > productsPerSlide && !isUserInteracting) {
  //     const interval = setInterval(() => {
  //       nextSlide();
  //     }, 5000); // Auto-advance every 5 seconds

  //     return () => clearInterval(interval);
  //   }
  // }, [products.length, totalSlides, nextSlide, isUserInteracting]);

  // Reset slide when switching between mobile/desktop
  useEffect(() => {
    const handleResize = () => {
      setCurrentSlide(0);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Product image component
  const ProductImage = ({ product }: { product: Product }) => {
    const [imageError, setImageError] = useState(false);
    const [imageLoading, setImageLoading] = useState(true);
    
    const imageUrl = product.images && product.images.length > 0 && !imageError
      ? product.images[0] 
      : '/images/product-placeholder.svg';
    
    return (
      <div className="aspect-square relative bg-gray-50 rounded-2xl overflow-hidden shadow-sm">
        {imageLoading && (
          <div className="absolute inset-0 bg-gray-200 animate-pulse rounded-2xl" />
        )}
        <Image
          src={imageUrl}
          alt={product.name || 'Product'}
          fill
          className={`object-cover transition-opacity duration-300 ${
            imageLoading ? 'opacity-0' : 'opacity-100'
          }`}
          loading="lazy"
          priority={false}
          onLoad={() => setImageLoading(false)}
          onError={() => {
            setImageError(true);
            setImageLoading(false);
          }}
          sizes="(max-width: 768px) 45vw, 200px"
          style={{ 
            willChange: 'opacity',
            backfaceVisibility: 'hidden'
          }}
        />
      </div>
    );
  };

  // Product card component
  const ProductCard = ({ product }: { product: Product }) => {
    const [isInCartState, setIsInCartState] = useState(false);

    // Check if product is in cart on mount and listen for changes
    useEffect(() => {
      if (product._id) {
        setIsInCartState(isInCart(product._id));
        
        // Subscribe to cart changes
        const handleCartChange = (items: any[]) => {
          setIsInCartState(items.some(item => item._id === product._id));
        };
        
        if (typeof window !== 'undefined') {
          window.cartListeners = window.cartListeners || [];
          window.cartListeners.push(handleCartChange);
        }
        
        return () => {
          if (typeof window !== 'undefined' && window.cartListeners) {
            window.cartListeners = window.cartListeners.filter(listener => listener !== handleCartChange);
          }
        };
      }
    }, [product._id]);

    const handleAddToCart = useCallback((e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (!product._id) {
        console.error('Cannot add product to cart: missing _id');
        return;
      }
      
      if (isInCartState) {
        removeFromCart(product._id);
      } else {
        addToCart(product);
      }
    }, [product, isInCartState]);

    return (
      <div className="group bg-white rounded-3xl p-4 shadow-sm border border-gray-100 transition-all duration-300 hover:shadow-lg transform-gpu will-change-transform">
        <Link href={`/product/${product._id}`} className="block">
          {/* Gender Icon */}
          <div className="flex justify-between items-center mb-3">
            <div className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
              product.gender === 'Homme' 
                ? 'bg-blue-100 text-blue-600' 
                : 'bg-pink-100 text-pink-600'
            }`}>
              {product.gender === 'Homme' ? '♂' : '♀'}
            </div>
            <div className="text-xs text-gray-400 bg-gray-50 px-2 py-1 rounded-full">
              {product.volume || '50ml'}
            </div>
          </div>

          <ProductImage product={product} />
          
          <div className="mt-4 space-y-2">
            <h3 className="font-semibold text-gray-800 text-sm line-clamp-2 group-hover:text-[#c8a45d] transition-colors duration-300">
              {product.name}
            </h3>
            
            {product.inspiredBy && (
              <p className="text-xs text-gray-500 line-clamp-1">
                ✨ Inspiré de {product.inspiredBy}
              </p>
            )}
            
            <div className="flex items-center justify-between pt-2">
              <span className="text-[#c8a45d] font-bold text-lg">{product.price} DH</span>
              <span className="text-xs text-gray-400">
                {product.gender}
              </span>
            </div>
          </div>
        </Link>
        
        {/* Action buttons */}
        <div className="mt-4 flex gap-2">
          <button
            onClick={handleAddToCart}
            className={`flex-1 py-2.5 rounded-xl text-xs font-medium transition-colors duration-200 flex items-center justify-center ${
              isInCartState 
                ? 'bg-emerald-100 text-emerald-700 border border-emerald-200 hover:bg-emerald-200'
                : 'bg-[#c8a45d] text-white hover:bg-[#b08d48]'
            }`}
          >
            {isInCartState ? (
              <>
                <FaCheck className="mr-1.5" size={12} />
                Ajouté
              </>
            ) : (
              <>
                <FaShoppingCart className="mr-1.5" size={12} />
                Panier
              </>
            )}
          </button>
          
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              const whatsappUrl = generateSingleProductWhatsAppURL({
                _id: product._id,
                name: product.name,
                price: product.price,
                volume: product.volume
              });
              window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
            }}
            className="flex-1 bg-green-500 text-white py-2.5 rounded-xl text-xs font-medium transition-colors duration-200 hover:bg-green-600 flex items-center justify-center"
          >
            <FaWhatsapp className="mr-1.5" size={12} />
            WhatsApp
          </button>
        </div>
      </div>
    );
  };

  // Loading skeleton
  const LoadingSkeleton = () => (
    <div className="grid grid-cols-2 gap-4">
      {Array(4).fill(0).map((_, i) => (
        <div key={i} className="bg-white rounded-3xl p-4 shadow-sm border border-gray-100">
          <div className="aspect-square bg-gray-200 rounded-2xl mb-4 animate-pulse"></div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-3 bg-gray-200 rounded w-3/4 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse"></div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        {/* Section Title */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-playfair text-[#c8a45d] mb-4">
            Parfums en Vedette
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Découvrez notre exquise collection de parfums premium pour hommes et femmes, 
            inspirés des parfums de renommée mondiale à des prix accessibles.
          </p>
        </div>

        {/* Gender Toggle - Mobile and Desktop */}
        <div className="flex justify-center mb-8">
          <div className="bg-gray-100 rounded-full p-1 flex">
            <button
              onClick={() => setActiveGender('Homme')}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                activeGender === 'Homme'
                  ? 'bg-[#c8a45d] text-white shadow-md'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              HOMME
            </button>
            <button
              onClick={() => setActiveGender('Femme')}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                activeGender === 'Femme'
                  ? 'bg-[#c8a45d] text-white shadow-md'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              FEMME
            </button>
          </div>
        </div>

        {/* Unified Carousel for Mobile and Desktop */}
        <div className="min-h-[500px]">
          {isLoading ? (
            <LoadingSkeleton />
          ) : products.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No products available for {activeGender}</p>
            </div>
          ) : (
            <div className="relative">
              {/* Carousel Container - Optimized for smooth animations */}
              <div 
                className="relative rounded-2xl min-h-[400px] overflow-hidden md:hidden isolate"
                style={{ 
                  touchAction: 'auto',
                  transform: 'translateZ(0)',
                  willChange: 'auto',
                  contain: 'layout style paint'
                }}
              >
                
                {/* Mobile slides with absolute positioning */}
                {Array.from({ length: totalSlides }).map((_, slideIndex) => {
                  const slideProducts = products.slice(slideIndex * productsPerSlide, (slideIndex + 1) * productsPerSlide);
                  const isVisible = currentSlide === slideIndex;
                  
                  return (
                    <div 
                      key={slideIndex}
                      className={`absolute top-0 left-0 w-full h-full transition-opacity duration-400 ease-out ${
                        isVisible ? 'opacity-100 z-10' : 'opacity-0 z-0'
                      }`}
                      style={{ 
                        willChange: 'opacity',
                        backfaceVisibility: 'hidden'
                      }}
                    >
                      <div className="min-h-[350px] p-4">
                        {slideProducts.length > 0 ? (
                          <div className="grid grid-cols-2 gap-4">
                            {slideProducts.map((product) => (
                              <ProductCard key={product._id} product={product} />
                            ))}
                          </div>
                        ) : (
                          <div className="text-center text-gray-500 p-8">
                            No products available
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Mobile Slide Indicators - Smaller and smoother */}
              <div className="md:hidden flex justify-center gap-2 mt-6 py-2">
                {Array.from({ length: totalSlides }).map((_, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setCurrentSlide(index);
                    }}
                    className={`transition-all duration-400 ease-out rounded-full ${
                      currentSlide === index
                        ? 'w-6 h-2 bg-[#c8a45d] shadow-sm'
                        : 'w-2 h-2 bg-gray-300 hover:bg-gray-400 hover:scale-110 active:scale-95'
                    }`}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>

              {/* Desktop Grid Layout */}
              <div className="hidden md:block">
                <div className="grid grid-cols-4 gap-6">
                  {products.slice(0, 4).map((product) => (
                    <ProductCard key={product._id} product={product} />
                  ))}
                </div>
              </div>

              {/* View All Button */}
              <div className="text-center mt-8">
                <Link
                  href={`/shop?gender=${activeGender}`}
                  className="inline-flex items-center px-8 py-3 border-2 border-[#c8a45d] text-[#c8a45d] rounded-full hover:bg-[#c8a45d] hover:text-white transition-all duration-300 font-medium"
                >
                  Voir Tout
                  <FaArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
} 