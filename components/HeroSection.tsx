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
      alt: 'AVANA PARFUM luxury fragrance by the ocean at sunset',
      position: 'object-[90%_center] sm:object-[80%_center] lg:object-[75%_center]'
    },
    {
      image: '/images/hero2.jpg',
      alt: 'AVANA PARFUM premium collection with elegant packaging',
      position: 'object-[75%_center] sm:object-[80%_center] lg:object-[85%_center]'
    },
    {
      image: '/images/hero-avana.jpg',
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
    <section className="relative h-[80vh] md:h-screen flex items-center overflow-hidden">
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
            {/* For mobile devices, we'll use a special container with adjusted sizing */}
            {/* For mobile devices */}
            <div className="relative h-full w-full md:hidden">
              <Image
                src={slide.image === '/images/hero-avana.jpg' ? '/images/heromobile.png' : slide.image}
                alt={slide.alt}
                fill
                className={`object-cover ${slide.position}`}
                style={{ objectFit: 'cover' }}
                priority={index === 0}
                quality={90}
                sizes="100vw"
              />
            </div>
            
            {/* For larger screens */}
            <div className="relative h-full w-full hidden md:block">
              <Image
                src={slide.image}
                alt={slide.alt}
                fill
                className={`object-cover ${slide.position}`}
                priority={index === 0}
                quality={90}
                sizes="100vw"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent" />
          </div>
        </div>
      ))}

      {/* Navigation Buttons Removed */}
      
      {/* Content */}
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-xl">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 md:mb-6">
            Parfums Inspirés de Luxe
          </h1>
          <p className="text-lg md:text-xl text-white/90 mb-6 md:mb-8">
            Découvrez notre collection exclusive
          </p>
          <div className="flex flex-wrap gap-3 md:gap-4">
            <Link
              href="/shop?gender=Homme"
              className="px-6 py-2.5 md:px-8 md:py-3 bg-[#c8a45d] hover:bg-[#c8a45d]/90 text-white font-medium rounded-full transition-colors text-sm md:text-base"
            >
              Pour Lui
            </Link>
            <Link
              href="/shop?gender=Femme"
              className="px-6 py-2.5 md:px-8 md:py-3 border-2 border-white text-white rounded-full hover:bg-white hover:text-[#c8a45d] transition-colors text-sm md:text-base"
            >
              Pour Elle
            </Link>
          </div>
        </div>
      </div>

      {/* Slide Indicators - Modern Design */}
      <div className="absolute bottom-6 md:bottom-8 left-1/2 -translate-x-1/2 z-10 flex gap-3 md:gap-4">
        {heroSlides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`relative overflow-hidden transition-all duration-500 ease-out ${
              index === currentSlide 
                ? 'w-8 md:w-12 h-1.5 bg-white/90 shadow-lg' 
                : 'w-1.5 h-1.5 bg-white/40 hover:bg-white/60 hover:scale-110'
            } rounded-full backdrop-blur-sm`}
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