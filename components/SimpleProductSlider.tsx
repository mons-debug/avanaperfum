'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FaArrowRight, FaArrowLeft } from 'react-icons/fa';

// Product type definition
interface Product {
  _id: string;
  name: string;
  description?: string;
  price: number;
  images: string[];
  gender: string;
  volume: string;
}

// Simple product image component
const ProductImage = ({ product }: { product: Product }) => {
  const imageUrl = product.images && product.images.length > 0 
    ? product.images[0] 
    : '/images/product-placeholder.svg';
  
  return (
    <div 
      className="aspect-square relative mb-3 bg-gray-50 rounded-lg overflow-hidden shadow-sm"
      style={{
        backgroundImage: `url('${imageUrl}')`,
        backgroundSize: "contain",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        width: "100%",
        height: "100%"
      }}
    />
  );
};

export default function SimpleProductSlider() {
  const [activeGender, setActiveGender] = useState('male');
  const [currentSlide, setCurrentSlide] = useState(0);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch products on component mount
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        const gender = activeGender === 'male' ? 'Homme' : 'Femme';
        const response = await fetch(`/api/products?gender=${gender}&limit=6`, {
          cache: 'no-store',
          headers: { 'Cache-Control': 'no-cache' }
        });
        const data = await response.json();
        
        if (data.success && Array.isArray(data.data) && data.data.length > 0) {
          setProducts(data.data);
        } else {
          // Fallback data if API fails
          setProducts([
            {
              _id: `sample-${gender}-1`,
              name: `${gender} Classic`,
              description: `A sophisticated fragrance for the modern ${gender === 'Homme' ? 'man' : 'woman'}`,
              price: 299,
              volume: '100ml',
              gender: gender,
              images: ['/images/product-placeholder.svg']
            },
            {
              _id: `sample-${gender}-2`,
              name: `${gender} Sport`,
              description: `An energetic scent for active lifestyles`,
              price: 250,
              volume: '50ml',
              gender: gender,
              images: ['/images/product-placeholder.svg']
            },
            {
              _id: `sample-${gender}-3`,
              name: `${gender} Elegance`,
              description: `A distinguished fragrance with woody notes`,
              price: 350,
              volume: '100ml',
              gender: gender,
              images: ['/images/product-placeholder.svg']
            }
          ]);
        }
        setCurrentSlide(0);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching products:', error);
        setProducts([
          {
            _id: `fallback-${activeGender}-1`,
            name: `${activeGender === 'male' ? 'Homme' : 'Femme'} Classic`,
            description: `A sophisticated fragrance for the modern ${activeGender === 'male' ? 'man' : 'woman'}`,
            price: 299,
            volume: '100ml',
            gender: activeGender === 'male' ? 'Homme' : 'Femme',
            images: ['/images/product-placeholder.svg']
          },
          {
            _id: `fallback-${activeGender}-2`,
            name: `${activeGender === 'male' ? 'Homme' : 'Femme'} Sport`,
            description: `An energetic scent for active lifestyles`,
            price: 250,
            volume: '50ml',
            gender: activeGender === 'male' ? 'Homme' : 'Femme',
            images: ['/images/product-placeholder.svg']
          }
        ]);
        setIsLoading(false);
      }
    };
    
    fetchProducts();
  }, [activeGender]);

  // Navigation functions
  const nextSlide = () => {
    const totalSlides = Math.ceil(products.length / (window.innerWidth >= 768 ? 3 : 2));
    setCurrentSlide(current => (current >= totalSlides - 1 ? 0 : current + 1));
  };

  const prevSlide = () => {
    const totalSlides = Math.ceil(products.length / (window.innerWidth >= 768 ? 3 : 2));
    setCurrentSlide(current => (current <= 0 ? totalSlides - 1 : current - 1));
  };

  // Render loading skeleton
  const renderSkeleton = (isMobile = false) => {
    const columns = isMobile ? 2 : 3;
    return (
      <div className="min-w-full flex-shrink-0">
        <div className={`grid grid-cols-${columns} gap-3 w-full`}>
          {Array(columns).fill(0).map((_, i) => (
            <div key={i} className="animate-pulse flex flex-col">
              <div className="aspect-square bg-gray-200 rounded-lg mb-3"></div>
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-3 bg-gray-200 rounded mb-2 w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/3"></div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Create product slides based on screen size
  const createProductSlides = (isMobile = false) => {
    if (isLoading) return renderSkeleton(isMobile);
    
    if (!products || products.length === 0) {
      return (
        <div className="min-w-full flex-shrink-0 flex items-center justify-center py-16">
          <p className="text-gray-500 text-center">No products found.</p>
        </div>
      );
    }
    
    const productsPerSlide = isMobile ? 2 : 3;
    const slides = [];
    
    for (let i = 0; i < products.length; i += productsPerSlide) {
      const productsInSlide = products.slice(i, i + productsPerSlide);
      if (productsInSlide.length > 0) {
        slides.push(
          <div key={i} className="min-w-full flex-shrink-0">
            <div className={`grid grid-cols-${productsPerSlide} gap-3 w-full`}>
              {productsInSlide.map((product) => (
                <Link 
                  href={`/product/${product._id}`}
                  key={product._id} 
                  className="group text-center flex flex-col w-full"
                >
                  <div className="aspect-square relative mb-2 bg-gray-50 rounded-lg overflow-hidden shadow-sm w-full">
                    <ProductImage product={product} />
                  </div>
                  <h3 className="text-xs font-medium mb-1 line-clamp-1">{product.name}</h3>
                  <p className="text-xs text-gray-500 mb-1 line-clamp-1">{product.description?.slice(0, 30) || ''}...</p>
                  <p className="text-[#c8a45d] font-semibold text-sm">{product.price} DH</p>
                </Link>
              ))}
            </div>
          </div>
        );
      }
    }
    
    return slides;
  };

  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4">
        {/* Section Title - Visible on all screens */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-playfair text-[#c8a45d] mb-4">Featured Fragrances</h2>
          <p className="text-gray-600 max-w-3xl mx-auto">
            Discover our exquisite collection of premium fragrances for both men and women, 
            inspired by world-renowned perfumes at affordable prices.
          </p>
        </div>
        
        {/* Mobile Toggle - Only visible on small screens */}
        <div className="flex justify-center gap-12 text-2xl font-playfair mb-8 md:hidden">
          <button
            onClick={() => setActiveGender('female')}
            className={`relative pb-2 transition-colors ${
              activeGender === 'female' 
                ? 'text-[#c8a45d] font-semibold' 
                : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            FEMME
            {activeGender === 'female' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#c8a45d]"></div>
            )}
          </button>
          <button
            onClick={() => setActiveGender('male')}
            className={`relative pb-2 transition-colors ${
              activeGender === 'male' 
                ? 'text-[#c8a45d] font-semibold' 
                : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            HOMME
            {activeGender === 'male' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#c8a45d]"></div>
            )}
          </button>
        </div>

        {/* Mobile Products - Only visible on small screens */}
        <div className="md:hidden">
          {/* Current gender title */}
          <h3 className="text-lg font-playfair text-center mb-4 text-[#c8a45d]">
            {activeGender === 'male' ? 'HOMME' : 'FEMME'} Collection
          </h3>
          
          <div className="relative px-2 pb-2">
            {/* Slides container with overflow */}
            <div className="overflow-hidden rounded-lg">
              <div 
                className="flex transition-transform duration-300 ease-in-out"
                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
              >
                {createProductSlides(true)}
              </div>
            </div>
            
            {/* Navigation buttons - only shown if more than one slide */}
            {products.length > 2 && (
              <>
                <button 
                  onClick={prevSlide}
                  className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 shadow-md w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#c8a45d]/10 transition-colors"
                  aria-label="Previous products"
                >
                  <FaArrowLeft className="w-3.5 h-3.5 text-[#c8a45d]" />
                </button>
                <button 
                  onClick={nextSlide}
                  className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 shadow-md w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#c8a45d]/10 transition-colors"
                  aria-label="Next products"
                >
                  <FaArrowRight className="w-3.5 h-3.5 text-[#c8a45d]" />
                </button>
              </>
            )}
            
            {/* Slide indicators */}
            {products.length > 2 && (
              <div className="flex justify-center gap-1.5 mt-4">
                {Array.from({ length: Math.ceil(products.length / 2) }).map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    className={`h-2 rounded-full transition-all ${
                      currentSlide === index
                        ? 'w-6 bg-[#c8a45d]'
                        : 'w-2 bg-gray-300'
                    }`}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>
            )}
          </div>

          <div className="text-center mt-10">
            <Link
              href={`/shop?gender=${activeGender === 'male' ? 'Homme' : 'Femme'}`}
              className="inline-block px-10 py-3 border border-black text-sm uppercase tracking-wide hover:bg-black hover:text-white transition"
            >
              EN SAVOIR PLUS
            </Link>
          </div>
        </div>

        {/* Desktop Layout - Only visible on medium screens and up */}
        <div className="hidden md:block">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 relative">
            {/* Center divider - only visible on large screens */}
            <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-gray-200 transform -translate-x-1/2"></div>
            
            {/* Men's Section */}
            <div className="lg:pl-6">
              <h2 className="text-xl sm:text-2xl font-playfair mb-6 text-center text-[#c8a45d]">HOMME</h2>
              
              {/* Men's Products */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {isLoading ? (
                  // Loading skeleton
                  Array(3).fill(0).map((_, i) => (
                    <div key={i} className="animate-pulse flex flex-col">
                      <div className="aspect-square bg-gray-200 rounded-lg mb-3"></div>
                      <div className="h-4 bg-gray-200 rounded mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded mb-2 w-3/4"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                    </div>
                  ))
                ) : (
                  // Static display of men's products
                  products.filter(p => p.gender === 'Homme').slice(0, 3).map(product => (
                    <Link 
                      href={`/product/${product._id}`}
                      key={product._id} 
                      className="group text-center block"
                    >
                      <div className="aspect-square relative mb-3 bg-gray-50 rounded-lg overflow-hidden shadow-sm">
                        <ProductImage product={product} />
                      </div>
                      <h3 className="text-sm font-medium mb-1 line-clamp-1">{product.name}</h3>
                      <p className="text-xs text-gray-500 mb-1 line-clamp-2">{product.description?.slice(0, 40) || ''}...</p>
                      <p className="text-[#c8a45d] font-semibold text-sm">{product.price} DH</p>
                    </Link>
                  ))
                )}
              </div>
              
              <div className="text-center mt-8">
                <Link
                  href="/shop?gender=Homme"
                  className="inline-block px-10 py-3 border border-black text-sm uppercase tracking-wide hover:bg-black hover:text-white transition"
                >
                  EN SAVOIR PLUS
                </Link>
              </div>
            </div>
            
            {/* Women's Section */}
            <div className="lg:pr-6">
              <h2 className="text-xl sm:text-2xl font-playfair mb-6 text-center text-[#c8a45d]">FEMME</h2>
              
              {/* Women's Products */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {isLoading ? (
                  // Loading skeleton
                  Array(3).fill(0).map((_, i) => (
                    <div key={i} className="animate-pulse flex flex-col">
                      <div className="aspect-square bg-gray-200 rounded-lg mb-3"></div>
                      <div className="h-4 bg-gray-200 rounded mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded mb-2 w-3/4"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                    </div>
                  ))
                ) : (
                  // Static display of women's products
                  products.filter(p => p.gender === 'Femme').slice(0, 3).map(product => (
                    <Link 
                      href={`/product/${product._id}`}
                      key={product._id} 
                      className="group text-center block"
                    >
                      <div className="aspect-square relative mb-3 bg-gray-50 rounded-lg overflow-hidden shadow-sm">
                        <ProductImage product={product} />
                      </div>
                      <h3 className="text-sm font-medium mb-1 line-clamp-1">{product.name}</h3>
                      <p className="text-xs text-gray-500 mb-1 line-clamp-2">{product.description?.slice(0, 40) || ''}...</p>
                      <p className="text-[#c8a45d] font-semibold text-sm">{product.price} DH</p>
                    </Link>
                  ))
                )}
              </div>
              
              <div className="text-center mt-8">
                <Link
                  href="/shop?gender=Femme"
                  className="inline-block px-10 py-3 border border-black text-sm uppercase tracking-wide hover:bg-black hover:text-white transition"
                >
                  EN SAVOIR PLUS
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
