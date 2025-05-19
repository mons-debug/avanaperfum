'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { connectToDB } from '@/lib/mongodb';
import Product from '@/models/Product';
import Category from '@/models/Category';
import WhatsAppButton from '@/components/WhatsAppButton';
import HeroSection from '@/components/HeroSection';
import ProductCard from '@/components/ProductCard';
import CategoryCard from '@/components/CategoryCard';
import { FaVenus, FaMars, FaShoppingBag, FaWhatsapp, FaCheck, FaArrowRight, FaArrowLeft, FaPhone, FaBox, FaCrown, FaTruck, FaMoneyBillWave } from 'react-icons/fa';
import Image from 'next/image';
import { useProducts } from '@/hooks/useProducts';
import { useCategories } from '@/hooks/useCategories';

// Add type definitions at the top
interface Product {
  _id: string;
  name: string;
  inspiredBy?: string;
  description?: string;
  price: number;
  volume: string;
  images: string[];
  gender: string;
  tags?: string[];
  brand?: string;
  category?: string;
}

interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  featured: boolean;
  productCount?: number;
}

async function getProductsByGender(gender: string) {
  try {
    await connectToDB();
    // Get latest 3 products by gender
    const products = await Product.find({ gender }).sort({ createdAt: -1 }).limit(3);
    return JSON.parse(JSON.stringify(products));
  } catch (error) {
    console.error(`Error fetching ${gender} products:`, error);
    return [];
  }
}

async function getProductsByCategory(categoryId: string) {
  try {
    await connectToDB();
    // Get latest 3 products by category
    const products = await Product.find({ categoryId }).sort({ createdAt: -1 }).limit(3);
    return JSON.parse(JSON.stringify(products));
  } catch (error) {
    console.error(`Error fetching products for category ${categoryId}:`, error);
    return [];
  }
}

async function getCategoriesWithCount() {
  try {
    await connectToDB();
    const categories = await Category.find({});
    
    // Get product count for each category
    const categoriesWithCount = await Promise.all(
      categories.map(async (category) => {
        const count = await Product.countDocuments({ categoryId: category._id });
        return {
          ...JSON.parse(JSON.stringify(category)),
          productCount: count
        };
      })
    );
    
    return categoriesWithCount;
  } catch (error) {
    console.error('Error fetching categories with count:', error);
    return [];
  }
}

export default function Home() {
  const [selectedGender, setSelectedGender] = useState('Homme');
  const [currentMenSlide, setCurrentMenSlide] = useState(0);
  const [currentWomenSlide, setCurrentWomenSlide] = useState(0);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [activeGender, setActiveGender] = useState('male'); // For mobile toggle
  
  const { products: menProducts, isLoading: isLoadingMen } = useProducts({
    gender: 'Homme',
    limit: 10
  });

  const { products: womenProducts, isLoading: isLoadingWomen } = useProducts({
    gender: 'Femme',
    limit: 10
  });

  const { categories, isLoading: isLoadingCategories } = useCategories({
    featured: true,
  });

  const heroSlides = [
    {
      image: '/images/hero3.jpg',
      alt: 'AVANA PARFUM luxury fragrance by the ocean at sunset'
    },
    {
      image: '/images/hero2.jpg',
      alt: 'AVANA PARFUM premium collection with elegant packaging'
    },
    {
      image: '/images/hero-avana.jpg',
      alt: 'AVANA PARFUM signature perfume collection'
    }
  ];

  // Auto-advance slides every 7 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((current) => (current === heroSlides.length - 1 ? 0 : current + 1));
    }, 7000);

    return () => clearInterval(timer);
  }, []);

  const howToOrderSteps = [
    {
      icon: <FaShoppingBag className="w-8 h-8" />,
      title: 'Choose Your Fragrance',
      description: 'Browse our collection and select your desired perfume'
    },
    {
      icon: <FaWhatsapp className="w-8 h-8" />,
      title: 'Contact Us',
      description: 'Click the WhatsApp button to place your order'
    },
    {
      icon: <FaCheck className="w-8 h-8" />,
      title: 'Receive Your Order',
      description: 'Fast delivery to your doorstep'
    }
  ];

  const nextSlide = () => {
    setCurrentSlide((current) => (current === heroSlides.length - 1 ? 0 : current + 1));
  };

  const prevSlide = () => {
    setCurrentSlide((current) => (current === 0 ? heroSlides.length - 1 : current - 1));
  };

  const nextProductSlide = (gender: 'men' | 'women') => {
    if (gender === 'men') {
      setCurrentMenSlide(current => {
        const totalSlides = menProducts ? Math.ceil(menProducts.length / 2) : 0;
        return current >= totalSlides - 1 ? 0 : current + 1;
      });
    } else {
      setCurrentWomenSlide(current => {
        const totalSlides = womenProducts ? Math.ceil(womenProducts.length / 2) : 0;
        return current >= totalSlides - 1 ? 0 : current + 1;
      });
    }
  };

  const prevProductSlide = (gender: 'men' | 'women') => {
    if (gender === 'men') {
      setCurrentMenSlide(current => {
        const totalSlides = menProducts ? Math.ceil(menProducts.length / 2) : 0;
        return current <= 0 ? totalSlides - 1 : current - 1;
      });
    } else {
      setCurrentWomenSlide(current => {
        const totalSlides = womenProducts ? Math.ceil(womenProducts.length / 2) : 0;
        return current <= 0 ? totalSlides - 1 : current - 1;
      });
    }
  };

  // Remove touch swipe support for now to avoid TypeScript errors
  useEffect(() => {
    // Will be implemented if needed
  }, []);

  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center overflow-hidden">
        {/* Slides */}
        {heroSlides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-all duration-1000 transform ${
              index === currentSlide 
                ? 'opacity-100 scale-100' 
                : 'opacity-0 scale-105'
            }`}
          >
            <div className="absolute inset-0">
              <Image
                src={slide.image}
                alt={slide.alt}
                fill
                className="object-cover"
                priority={index === 0}
                quality={100}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent" />
            </div>
          </div>
        ))}

        {/* Navigation Buttons */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-white/10 hover:bg-white/20 text-white p-4 rounded-full backdrop-blur-sm transition-all group"
          aria-label="Previous slide"
        >
          <FaArrowLeft className="w-6 h-6 transition-transform group-hover:-translate-x-1" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-white/10 hover:bg-white/20 text-white p-4 rounded-full backdrop-blur-sm transition-all group"
          aria-label="Next slide"
        >
          <FaArrowRight className="w-6 h-6 transition-transform group-hover:translate-x-1" />
        </button>
        
        {/* Content */}
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-2xl">
            <h1 className="text-5xl md:text-6xl font-playfair text-white mb-6 transform transition-all duration-700 delay-300 translate-y-0 opacity-100">
              Discover Your Signature Scent
            </h1>
            <p className="text-xl text-white/90 mb-8 leading-relaxed transform transition-all duration-700 delay-500 translate-y-0 opacity-100">
              Experience luxury fragrances inspired by world-renowned perfumes at a fraction of the price.
            </p>
            <div className="flex gap-4 transform transition-all duration-700 delay-700 translate-y-0 opacity-100">
              <Link
                href="/shop?gender=Homme"
                className="px-8 py-3 bg-[#c8a45d] text-white rounded-full hover:bg-[#c8a45d]/90 transition-colors"
              >
                Shop Men
              </Link>
              <Link
                href="/shop?gender=Femme"
                className="px-8 py-3 border-2 border-white text-white rounded-full hover:bg-white hover:text-[#c8a45d] transition-colors"
              >
                Shop Women
              </Link>
            </div>
          </div>
        </div>

        {/* Slide Indicators */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex gap-3">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`h-2 transition-all duration-500 rounded-full ${
                index === currentSlide 
                  ? 'w-8 bg-white' 
                  : 'w-2 bg-white/50 hover:bg-white/70'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </section>

      {/* Featured Fragrances Section */}
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
                  className="flex transition-transform duration-300 ease-in-out mobile-slides-container will-change-transform"
                  style={{ 
                    transform: activeGender === 'male' 
                      ? `translateX(-${currentMenSlide * 100}%)` 
                      : `translateX(-${currentWomenSlide * 100}%)` 
                  }}
                >
                  {/* Create slides with 2 products per slide */}
                  {(() => {
                    const products = activeGender === 'male' ? menProducts : womenProducts;
                    const isLoading = activeGender === 'male' ? isLoadingMen : isLoadingWomen;
                    
                    if (isLoading) {
                      return (
                        <div className="min-w-full flex-shrink-0">
                          <div className="grid grid-cols-2 gap-3 w-full">
                            {[1, 2].map((i) => (
                              <div key={i} className="animate-pulse flex flex-col w-full">
                                <div className="aspect-square bg-gray-200 rounded-lg mb-2 w-full"></div>
                                <div className="h-3 bg-gray-200 rounded mb-2 w-full"></div>
                                <div className="h-2 bg-gray-200 rounded mb-2 w-3/4"></div>
                                <div className="h-3 bg-gray-200 rounded w-1/3 mt-auto"></div>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    }
                    
                    if (!products || products.length === 0) {
                      return (
                        <div className="min-w-full flex-shrink-0 flex items-center justify-center py-16">
                          <p className="text-gray-500 text-center">No products found.</p>
                        </div>
                      );
                    }

                    // Group products into pairs (2 per slide)
                    const slides = [];
                    for (let i = 0; i < products.length; i += 2) {
                      slides.push(
                        <div key={i} className="min-w-full flex-shrink-0">
                          <div className="grid grid-cols-2 gap-3 w-full">
                            {products.slice(i, i + 2).map((product: Product) => (
        <Link 
          href={`/product/${product._id}`} 
          key={product._id} 
                                className="group text-center flex flex-col w-full"
        >
                                <div className="aspect-square relative mb-2 bg-gray-50 rounded-lg overflow-hidden shadow-sm w-full">
            <Image
              src={product.images[0] || '/images/product-placeholder.svg'}
              alt={product.name}
              fill
                                    sizes="(max-width: 768px) 40vw, 100px"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
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
                    return slides;
                  })()}
                </div>
              </div>

              {/* Navigation buttons - only shown if more than one slide */}
              {(() => {
                const products = activeGender === 'male' ? menProducts : womenProducts;
                const totalSlides = products ? Math.ceil(products.length / 2) : 0;
                
                if (totalSlides <= 1) return null;
                
                return (
                  <>
                    <button 
                      onClick={() => activeGender === 'male' ? prevProductSlide('men') : prevProductSlide('women')}
                      className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 shadow-md w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#c8a45d]/10 transition-colors"
                      aria-label="Previous products"
                    >
                      <FaArrowLeft className="w-3.5 h-3.5 text-[#c8a45d]" />
                    </button>
                    <button 
                      onClick={() => activeGender === 'male' ? nextProductSlide('men') : nextProductSlide('women')}
                      className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 shadow-md w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#c8a45d]/10 transition-colors"
                      aria-label="Next products"
                    >
                      <FaArrowRight className="w-3.5 h-3.5 text-[#c8a45d]" />
                    </button>
                  </>
                );
              })()}

              {/* Slide indicators */}
              <div className="flex justify-center gap-1.5 mt-4">
                {(() => {
                  const products = activeGender === 'male' ? menProducts : womenProducts;
                  const totalSlides = products ? Math.ceil(products.length / 2) : 0;
                  const currentSlide = activeGender === 'male' ? currentMenSlide : currentWomenSlide;
                  
                  if (totalSlides <= 1) return null;
                  
                  return Array.from({ length: totalSlides }).map((_, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        if (activeGender === 'male') {
                          setCurrentMenSlide(index);
                        } else {
                          setCurrentWomenSlide(index);
                        }
                      }}
                      className={`h-2 rounded-full transition-all ${
                        currentSlide === index
                          ? 'w-6 bg-[#c8a45d]'
                          : 'w-2 bg-gray-300'
                      }`}
                      aria-label={`Go to slide ${index + 1}`}
                    />
                  ));
                })()}
              </div>
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
              
              {/* Women's Section */}
              <div className="lg:pr-6">
                <h2 className="text-xl sm:text-2xl font-playfair mb-6 text-center text-[#c8a45d]">FEMME</h2>
                
                {/* Women's Products Slider */}
                <div className="relative px-2">
                  <div className="overflow-hidden rounded-xl">
                    <div 
                      className="flex transition-transform duration-300 ease-in-out"
                      style={{ transform: `translateX(-${currentWomenSlide * 100}%)` }}
                    >
                      {womenProducts?.reduce((slides: React.ReactElement[], _: any, index: number, array: Product[]) => {
                        if (index % 3 === 0) {
                          slides.push(
                            <div key={index} className="min-w-full flex-shrink-0">
                              <div className="grid grid-cols-3 gap-4">
                                {array.slice(index, index + 3).map((product: Product) => (
                                  <Link 
                                    href={`/product/${product._id}`} 
                                    key={product._id} 
                                    className="group text-center"
                                  >
                                    <div className="aspect-square relative mb-3 bg-gray-50 rounded-lg overflow-hidden shadow-sm">
                                      <Image
                                        src={product.images[0] || '/images/product-placeholder.svg'}
                                        alt={product.name}
                                        fill
                                        sizes="(max-width: 1024px) 30vw, 20vw"
                                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                                      />
                                    </div>
                                    <h3 className="text-sm font-medium mb-1 line-clamp-1">{product.name}</h3>
                                    <p className="text-xs text-gray-500 mb-1 line-clamp-2">{product.description?.slice(0, 40) || ''}...</p>
                                    <p className="text-[#c8a45d] font-semibold text-sm">{product.price} DH</p>
                                  </Link>
                                ))}
                              </div>
                            </div>
                          );
                        }
                        return slides;
                      }, [])}
                    </div>
                  </div>
                  
                  {/* Navigation buttons - only shown if more than one slide */}
                  {(() => {
                    const totalSlides = womenProducts ? Math.ceil(womenProducts.length / 3) : 0;
                    
                    if (totalSlides <= 1) return null;
                    
                    return (
                      <>
                        <button 
                          onClick={() => prevProductSlide('women')}
                          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 shadow-md w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#c8a45d]/10 transition-colors"
                          aria-label="Previous products"
                        >
                          <FaArrowLeft className="w-3.5 h-3.5 text-[#c8a45d]" />
                        </button>
                        <button 
                          onClick={() => nextProductSlide('women')}
                          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 shadow-md w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#c8a45d]/10 transition-colors"
                          aria-label="Next products"
                        >
                          <FaArrowRight className="w-3.5 h-3.5 text-[#c8a45d]" />
                        </button>
                      </>
                    );
                  })()}
                  
                  {/* Slide indicators */}
                  <div className="flex justify-center gap-1.5 mt-4">
                    {(() => {
                      const totalSlides = womenProducts ? Math.ceil(womenProducts.length / 3) : 0;
                      
                      if (totalSlides <= 1) return null;
                      
                      return Array.from({ length: totalSlides }).map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentWomenSlide(index)}
                          className={`h-2 rounded-full transition-all ${
                            currentWomenSlide === index
                              ? 'w-6 bg-[#c8a45d]'
                              : 'w-2 bg-gray-300'
                          }`}
                          aria-label={`Go to slide ${index + 1}`}
                        />
                      ));
                    })()}
                  </div>
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

              {/* Men's Section */}
              <div className="lg:pl-6">
                <h2 className="text-xl sm:text-2xl font-playfair mb-6 text-center text-[#c8a45d]">HOMME</h2>
                
                {/* Men's Products Slider */}
                <div className="relative px-2">
                  <div className="overflow-hidden rounded-xl">
                    <div 
                      className="flex transition-transform duration-300 ease-in-out"
                      style={{ transform: `translateX(-${currentMenSlide * 100}%)` }}
                    >
                      {menProducts?.reduce((slides: React.ReactElement[], _: any, index: number, array: Product[]) => {
                        if (index % 3 === 0) {
                          slides.push(
                            <div key={index} className="min-w-full flex-shrink-0">
                              <div className="grid grid-cols-3 gap-4">
                                {array.slice(index, index + 3).map((product: Product) => (
                                  <Link 
                                    href={`/product/${product._id}`} 
                                    key={product._id} 
                                    className="group text-center"
                                  >
                                    <div className="aspect-square relative mb-3 bg-gray-50 rounded-lg overflow-hidden shadow-sm">
                                      <Image
                                        src={product.images[0] || '/images/product-placeholder.svg'}
                                        alt={product.name}
                                        fill
                                        sizes="(max-width: 1024px) 30vw, 20vw"
                                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                                      />
                                    </div>
                                    <h3 className="text-sm font-medium mb-1 line-clamp-1">{product.name}</h3>
                                    <p className="text-xs text-gray-500 mb-1 line-clamp-2">{product.description?.slice(0, 40) || ''}...</p>
                                    <p className="text-[#c8a45d] font-semibold text-sm">{product.price} DH</p>
                                  </Link>
                                ))}
                              </div>
                            </div>
                          );
                        }
                        return slides;
                      }, [])}
                    </div>
                  </div>
                  
                  {/* Navigation buttons - only shown if more than one slide */}
                  {(() => {
                    const totalSlides = menProducts ? Math.ceil(menProducts.length / 3) : 0;
                    
                    if (totalSlides <= 1) return null;
                    
                    return (
                      <>
                        <button 
                          onClick={() => prevProductSlide('men')}
                          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 shadow-md w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#c8a45d]/10 transition-colors"
                          aria-label="Previous products"
                        >
                          <FaArrowLeft className="w-3.5 h-3.5 text-[#c8a45d]" />
                        </button>
                        <button 
                          onClick={() => nextProductSlide('men')}
                          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 shadow-md w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#c8a45d]/10 transition-colors"
                          aria-label="Next products"
                        >
                          <FaArrowRight className="w-3.5 h-3.5 text-[#c8a45d]" />
                        </button>
                      </>
                    );
                  })()}
                  
                  {/* Slide indicators */}
                  <div className="flex justify-center gap-1.5 mt-4">
                    {(() => {
                      const totalSlides = menProducts ? Math.ceil(menProducts.length / 3) : 0;
                      
                      if (totalSlides <= 1) return null;
                      
                      return Array.from({ length: totalSlides }).map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentMenSlide(index)}
                          className={`h-2 rounded-full transition-all ${
                            currentMenSlide === index
                              ? 'w-6 bg-[#c8a45d]'
                              : 'w-2 bg-gray-300'
                          }`}
                          aria-label={`Go to slide ${index + 1}`}
                        />
                      ));
                    })()}
                  </div>
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
            </div>
    </div>
  </div>
</section>

      {/* Featured Collections Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-playfair text-[#c8a45d] mb-4">
              Featured Collection
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Discover our most popular fragrances, crafted with premium ingredients
              and inspired by world-renowned perfumes.
            </p>
          </div>
          
            {isLoadingCategories ? (
            // Loading skeleton with various sizes for desktop and mobile
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 sm:gap-5">
              {/* Large item - full width on mobile, 2x2 on desktop */}
              <div className="col-span-2 row-span-2 bg-gray-100 rounded-lg overflow-hidden shadow-sm">
                <div className="aspect-square sm:aspect-auto sm:h-full animate-pulse"></div>
              </div>
              {/* Regular items */}
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="bg-gray-100 rounded-lg overflow-hidden shadow-sm">
                  <div className="aspect-square animate-pulse"></div>
                </div>
              ))}
            </div>
            ) : categories && categories.length > 0 ? (
            // Modern mobile-first responsive layout with flex for smaller screens
            <div className="flex flex-col space-y-4 sm:space-y-0 sm:grid sm:grid-cols-3 lg:grid-cols-4 sm:gap-5">
              {/* Featured large item */}
              <div className="sm:col-span-2 sm:row-span-2">
                <Link 
                  href={`/shop?category=${encodeURIComponent(categories[0]?.name || '')}`}
                  className="group relative bg-white rounded-lg overflow-hidden shadow-sm transition-transform hover:shadow-md hover:-translate-y-1 h-full block"
                >
                  <div className="aspect-square sm:aspect-auto sm:h-full relative">
                    <Image
                      src={categories[0]?.image || `/images/categories/default.svg`}
                      alt={categories[0]?.name || 'Featured Collection'}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 66vw, 50vw"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = '/images/categories/default.svg';
                      }}
                    />
                  </div>
                  <div className="absolute top-4 right-4 bg-[#c8a45d] text-white text-xs font-medium px-2.5 py-1.5 rounded-full">
                    {categories[0]?.productCount || 15}
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-black/70 to-transparent text-white">
                    <h3 className="font-playfair text-xl sm:text-2xl mb-1">
                      {categories[0]?.name || 'Collection'}
                    </h3>
                    <p className="text-sm text-white/80">
                      {categories[0]?.name === 'Femme' ? 'Women Perfumes' : 
                       categories[0]?.name === 'Homme' ? 'Men Perfumes' :
                       categories[0]?.name === 'Unisexe' ? 'Unisex Perfumes' :
                       categories[0]?.name === 'Deluxe Studio' ? 'Premium Collection' :
                       'Fragrances'}
                    </p>
                  </div>
                </Link>
              </div>
              
              {/* Mobile-optimized grid for regular items */}
              <div className="grid grid-cols-2 gap-4 sm:contents">
                {categories.slice(1, 5).map((category: Category) => (
                  <Link 
                    key={category._id}
                    href={`/shop?category=${encodeURIComponent(category.name)}`}
                    className="group relative bg-white rounded-lg overflow-hidden shadow-sm transition-transform hover:shadow-md hover:-translate-y-1 block"
                  >
                    <div className="aspect-square relative">
                      <Image
                        src={category.image || `/images/categories/${category.slug}.svg`}
                        alt={category.name}
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 40vw, (max-width: 1024px) 33vw, 25vw"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = '/images/categories/default.svg';
                        }}
                      />
                    </div>
                    <div className="absolute top-3 right-3 bg-[#c8a45d] text-white text-xs font-medium px-2 py-1 rounded-full">
                      {category.productCount || 15}
                    </div>
                    <div className="p-3 sm:p-4 text-center">
                      <h3 className="font-playfair text-sm sm:text-xl text-gray-800 mb-0 sm:mb-1 line-clamp-1">
                        {category.name}
                      </h3>
                      <p className="text-xs sm:text-sm text-gray-600 hidden sm:block">
                        {category.name === 'Femme' ? 'Women Perfumes' : 
                         category.name === 'Homme' ? 'Men Perfumes' :
                         category.name === 'Unisexe' ? 'Unisex Perfumes' :
                         category.name === 'Deluxe Studio' ? 'Premium Collection' :
                         'Fragrances'}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
                <p className="text-gray-500">No featured categories found.</p>
                <p className="text-sm text-gray-400 mt-2">
                  Check back soon for our featured collection.
                </p>
              </div>
            )}
          
          <div className="text-center mt-12">
            <Link 
              href="/shop" 
              className="inline-block px-10 py-3 border border-black text-sm uppercase tracking-wide hover:bg-black hover:text-white transition"
            >
              View All Collections
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section - Now moved to be above the About section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: "Premium Quality",
                description: "High-quality ingredients for long-lasting fragrance",
                icon: <FaCrown className="w-8 h-8 text-[#c8a45d]" />
              },
              {
                title: "Free Shipping",
                description: "On orders over $150",
                icon: <FaTruck className="w-8 h-8 text-[#c8a45d]" />
              },
              {
                title: "Cash on Delivery",
                description: "Pay when you receive your order",
                icon: <FaMoneyBillWave className="w-8 h-8 text-[#c8a45d]" />
              }
            ].map((feature, index) => (
              <div
                key={index}
                className="flex flex-col items-center text-center p-8 bg-white rounded-xl shadow-sm border border-gray-100 transition-transform hover:-translate-y-1 hover:shadow-md"
              >
                <div className="w-16 h-16 rounded-full flex items-center justify-center bg-[#f9f5eb] mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-playfair text-gray-800 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-12 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          {/* Mobile Title - Centered on mobile only */}
          <h2 className="font-playfair text-3xl text-[#c8a45d] mb-6 text-center lg:hidden">
            About AVANA PARFUM
          </h2>
          
          {/* Mobile Layout */}
          <div className="lg:hidden">
            {/* Text */}
            <div className="mb-6">
              <p className="text-gray-600 text-base leading-relaxed">
                At AVANA PARFUM, we believe that luxury fragrances should be accessible to everyone. 
                Our collection features premium quality inspired perfumes that capture the essence 
                of world-renowned fragrances.
              </p>
            </div>
            
            {/* Image */}
            <div className="mt-2 mb-8">
              <div className="relative bg-[#e6d5ba] rounded-3xl overflow-hidden">
                <div className="aspect-[4/3] w-full">
                  <div className="absolute inset-0">
                    <Image
                      src="/images/about-avana.jpg"
                      alt="AVANA PARFUM luxury perfume bottle with golden liquid"
                      fill
                      className="object-cover object-center scale-110"
                      sizes="100vw"
                      priority
                      quality={100}
                    />
                  </div>
                </div>
              </div>
            </div>
            
            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 mb-8 max-w-md mx-auto">
              <div className="text-center bg-gray-50 p-3 rounded-lg shadow-sm">
                <h3 className="text-2xl font-playfair text-[#c8a45d] mb-1">100+</h3>
                <p className="text-gray-600 text-sm">Unique Fragrances</p>
              </div>
              <div className="text-center bg-gray-50 p-3 rounded-lg shadow-sm">
                <h3 className="text-2xl font-playfair text-[#c8a45d] mb-1">10k+</h3>
                <p className="text-gray-600 text-sm">Happy Customers</p>
              </div>
            </div>
            
            {/* Button */}
            <div className="text-center">
              <Link
                href="/about"
                className="inline-flex items-center px-6 py-2 bg-[#c8a45d] text-white rounded-full hover:bg-[#c8a45d]/90 transition-colors text-sm"
              >
                Learn More
                <svg
                  className="ml-2 w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </Link>
            </div>
          </div>
          
          {/* Desktop Layout - Original side-by-side design */}
          <div className="hidden lg:grid lg:grid-cols-2 lg:gap-16 lg:items-center">
            {/* Image Column */}
            <div className="order-1">
              <div className="relative bg-[#e6d5ba] rounded-3xl overflow-hidden">
                <div className="aspect-[4/5] w-full">
                  <div className="absolute inset-0">
                    <Image
                      src="/images/about-avana.jpg"
                      alt="AVANA PARFUM luxury perfume bottle with golden liquid"
                      fill
                      className="object-cover object-center scale-110"
                      sizes="(max-width: 1200px) 50vw, 33vw"
                      priority
                      quality={100}
                    />
                  </div>
                </div>
              </div>
            </div>
            
            {/* Content Column */}
            <div className="order-2">
              <h2 className="font-playfair text-5xl text-[#c8a45d] mb-8">
                About AVANA PARFUM
              </h2>
              <div className="space-y-6">
                <p className="text-gray-600 text-lg leading-relaxed">
                  At AVANA PARFUM, we believe that luxury fragrances should be accessible to everyone. 
                  Our collection features premium quality inspired perfumes that capture the essence 
                  of world-renowned fragrances.
                </p>
                <p className="text-gray-600 text-lg leading-relaxed">
                  Each fragrance is meticulously crafted using the finest ingredients,
                  ensuring a long-lasting scent that makes a lasting impression. We
                  take pride in offering you an exceptional olfactory experience at a
                  fraction of the price.
                </p>
                
                <div className="grid grid-cols-2 gap-8 pt-8">
                  <div className="text-center">
                    <h3 className="text-4xl font-playfair text-[#c8a45d] mb-2">100+</h3>
                    <p className="text-gray-600">Unique Fragrances</p>
                  </div>
                  <div className="text-center">
                    <h3 className="text-4xl font-playfair text-[#c8a45d] mb-2">10k+</h3>
                    <p className="text-gray-600">Happy Customers</p>
                  </div>
                </div>
                
                <div className="pt-8">
                  <Link
                    href="/about"
                    className="inline-flex items-center px-8 py-3 bg-[#c8a45d] text-white rounded-full hover:bg-[#c8a45d]/90 transition-colors"
                  >
                    Learn More
                    <svg
                      className="ml-2 w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How to Order */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-4xl font-playfair text-[#c8a45d] mb-4">
              How to Order
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Simple steps to get your favorite fragrance delivered to your doorstep
            </p>
          </div>
          
          {/* Steps - Desktop Version */}
          <div className="hidden md:block">
            <div className="relative">
              {/* Progress Line */}
              <div className="absolute top-1/4 left-0 right-0 h-1 bg-[#e6d5ba]"></div>
              
              {/* Arrows - positioned above the line */}
              <div className="absolute top-1/4 left-[20.5%] transform -translate-y-1/2 -translate-x-1/2 z-20 bg-white rounded-full p-1">
                <FaArrowRight className="text-[#c8a45d] w-5 h-5" />
              </div>
              <div className="absolute top-1/4 left-[45.5%] transform -translate-y-1/2 -translate-x-1/2 z-20 bg-white rounded-full p-1">
                <FaArrowRight className="text-[#c8a45d] w-5 h-5" />
              </div>
              <div className="absolute top-1/4 left-[70.5%] transform -translate-y-1/2 -translate-x-1/2 z-20 bg-white rounded-full p-1">
                <FaArrowRight className="text-[#c8a45d] w-5 h-5" />
              </div>

              {/* Steps */}
              <div className="grid grid-cols-4 gap-6 relative z-10">
                {[
                  {
                    icon: <FaShoppingBag className="w-10 h-10 text-[#c8a45d]" />,
                    title: "Browse Collection",
                    description: "Explore our wide range of luxury inspired fragrances"
              },
              {
                    icon: <FaWhatsapp className="w-10 h-10 text-[#c8a45d]" />,
                    title: "Place Your Order",
                    description: "Message us on WhatsApp and complete the order form"
              },
              {
                    icon: <FaPhone className="w-10 h-10 text-[#c8a45d]" />,
                    title: "Confirmation Call",
                    description: "Receive a quick confirmation call to verify your order"
                  },
                  {
                    icon: <FaBox className="w-10 h-10 text-[#c8a45d]" />,
                    title: "Fast Delivery",
                    description: "Your order will arrive within 3-5 business days"
                  }
                ].map((step, index) => (
                  <div key={index} className="flex flex-col items-center">
                    <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center shadow-lg mb-6 border-4 border-[#e6d5ba]">
                      {step.icon}
                    </div>
                    <div className="text-center">
                      <h3 className="text-xl font-playfair text-gray-800 mb-2">{step.title}</h3>
                      <p className="text-gray-600">{step.description}</p>
                    </div>
              </div>
            ))}
          </div>
        </div>
          </div>

          {/* Steps - Mobile Version */}
          <div className="md:hidden">
            <div className="flex flex-col space-y-8">
              {[
                {
                  icon: <FaShoppingBag className="w-6 h-6 text-white" />,
                  title: "Browse Collection",
                  description: "Explore our wide range of luxury inspired fragrances"
                },
                {
                  icon: <FaWhatsapp className="w-6 h-6 text-white" />,
                  title: "Place Your Order",
                  description: "Message us on WhatsApp and complete the order form"
                },
                {
                  icon: <FaPhone className="w-6 h-6 text-white" />,
                  title: "Confirmation Call",
                  description: "Receive a quick confirmation call to verify your order"
                },
                {
                  icon: <FaBox className="w-6 h-6 text-white" />,
                  title: "Fast Delivery",
                  description: "Your order will arrive within 3-5 business days"
                }
              ].map((step, index) => (
                <div key={index} className="flex items-start">
                  <div className="w-14 h-14 rounded-full bg-[#c8a45d] flex-shrink-0 flex items-center justify-center shadow-md mr-4">
                  {step.icon}
                  </div>
                  <div>
                    <h3 className="text-lg font-playfair text-gray-800 mb-1">{index + 1}. {step.title}</h3>
                    <p className="text-gray-600 text-sm">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
              </div>
          
          {/* Call to Action */}
          <div className="text-center mt-12 md:mt-16">
            <a
              href="https://wa.me/+212XXXxxxXXX?text=Hello, I would like to place an order."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-8 py-3 bg-[#c8a45d] text-white rounded-full hover:bg-[#c8a45d]/90 transition-colors shadow-sm"
            >
              Order on WhatsApp
              <FaWhatsapp className="ml-2 w-5 h-5" />
            </a>
          </div>
        </div>
      </section>

      {/* WhatsApp Button */}
      <WhatsAppButton />

      {/* Shop by Gender CTA Banner */}
      <section className="py-16 bg-[#f8f5f0] relative overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-12">
            <Link 
              href="/shop?gender=Homme" 
              className="px-10 py-4 bg-[#c8a45d] text-white rounded-full text-lg font-medium transition-transform hover:scale-105"
            >
              Shop Men
            </Link>
            <Link 
              href="/shop?gender=Femme" 
              className="px-10 py-4 border-2 border-[#c8a45d] text-[#c8a45d] bg-white rounded-full text-lg font-medium transition-transform hover:scale-105"
            >
              Shop Women
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
