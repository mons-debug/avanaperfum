'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';

const HeroSection: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [bgColor, setBgColor] = useState<string>('transparent');
  
  // Handle image error 
  const handleImageError = () => {
    setBgColor('#1a365d');
  };

  const heroSlides = [
    {
      image: '/images/hero3.jpg',
      mobileImage: '/images/heromobile.png',
      alt: 'AVANA PARFUM luxury fragrance by the ocean at sunset',
      position: 'object-[90%_center] sm:object-[80%_center] lg:object-[75%_center]'
    },
    {
      image: '/images/hero2.jpg',
      mobileImage: '/images/heromobile.png',
      alt: 'AVANA PARFUM premium collection with elegant packaging',
      position: 'object-[75%_center] sm:object-[80%_center] lg:object-[85%_center]'
    },
    {
      image: '/images/hero-avana.jpg',
      mobileImage: '/images/heromobile.png',
      alt: 'AVANA PARFUM signature perfume collection',
      position: 'object-center sm:object-center lg:object-center'
    }
  ];

  // Auto-advance slides every 7 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((current) => (current === heroSlides.length - 1 ? 0 : current + 1));
    }, 7000);

    return () => clearInterval(timer);
  }, [heroSlides.length]);

  // Arrow navigation functions removed as per request
  
  return (
    <section className="relative h-[85vh] sm:h-[90vh] md:h-screen flex items-center justify-center overflow-hidden">
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
          <div className="absolute inset-0 overflow-hidden">
            {/* Mobile-optimized image container */}
            <div className="relative h-full w-full md:hidden">
              <Image
                src={slide.mobileImage}
                alt={slide.alt}
                fill
                className="object-cover object-center"
                style={{ objectFit: 'cover' }}
                priority={index === 0}
                loading={index === 0 ? undefined : "lazy"}
                quality={90}
                sizes="100vw"
                placeholder="blur"
                blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
              />
            </div>
            
            {/* Desktop image container */}
            <div className="relative h-full w-full hidden md:block">
              <Image
                src={slide.image}
                alt={slide.alt}
                fill
                className={`object-cover ${slide.position}`}
                priority={index === 0}
                loading={index === 0 ? undefined : "lazy"}
                quality={90}
                sizes="100vw"
                placeholder="blur"
                blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
              />
            </div>
            {/* Enhanced overlay for better text readability */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-black/20" />
            {/* Additional overlay for better text readability */}
            <div className="absolute inset-0 bg-black/20" />
            {/* Mobile-specific additional overlay for better readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/30 md:hidden" />
          </div>
        </div>
      ))}

      {/* Navigation Buttons Removed */}
      
      {/* Content */}
      <div className="container mx-auto px-4 md:px-6 lg:px-8 relative z-10">
        <div className="max-w-xl lg:max-w-2xl">
          {/* Enhanced text with better shadows and mobile optimization */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white mb-4 md:mb-6 leading-tight" 
              style={{ 
                textShadow: '2px 2px 8px rgba(0,0,0,0.8), 0 0 20px rgba(0,0,0,0.6)', 
                WebkitTextStroke: '1px rgba(0,0,0,0.1)' 
              }}>
            Parfums Inspirés de Luxe
          </h1>
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-white/95 mb-6 md:mb-8 leading-relaxed font-medium"
             style={{ 
               textShadow: '1px 1px 6px rgba(0,0,0,0.8), 0 0 15px rgba(0,0,0,0.5)' 
             }}>
            Découvrez notre collection exclusive de parfums inspirés des plus grandes maisons de parfumerie
          </p>
          <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
            <Link
              href="/shop?gender=Homme"
              className="px-6 py-3 md:px-8 md:py-4 bg-[#c8a45d] hover:bg-[#b08d48] text-white font-semibold rounded-full transition-all duration-300 text-sm md:text-base shadow-xl hover:shadow-2xl hover:scale-105 text-center"
            >
              Homme
            </Link>
            <Link
              href="/shop?gender=Femme"
              className="px-6 py-3 md:px-8 md:py-4 border-2 border-white text-white rounded-full hover:bg-white hover:text-[#c8a45d] transition-all duration-300 text-sm md:text-base shadow-xl hover:shadow-2xl hover:scale-105 backdrop-blur-sm text-center font-semibold"
            >
              Femme
            </Link>
          </div>
        </div>
      </div>

      {/* Slide Indicators - Enhanced for better visibility */}
      <div className="absolute bottom-6 md:bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-2 md:gap-3 bg-black/30 px-3 py-1.5 rounded-full backdrop-blur-md">
        {heroSlides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`relative overflow-hidden transition-all duration-500 ease-out ${
              index === currentSlide 
                ? 'w-6 md:w-8 h-1 bg-white shadow-lg' 
                : 'w-1 h-1 bg-white/50 hover:bg-white/80 hover:scale-125'
            } rounded-full`}
            aria-label={`Go to slide ${index + 1}`}
          >
            {index === currentSlide && (
              <div className="absolute inset-0 bg-gradient-to-r from-[#c8a45d] to-white rounded-full animate-pulse"></div>
            )}
          </button>
        ))}
      </div>
    </section>
  );
};

export default HeroSection; 