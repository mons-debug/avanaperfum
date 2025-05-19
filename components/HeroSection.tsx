'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

const HeroSection: React.FC = () => {
  const [bgColor, setBgColor] = useState<string>('transparent');
  
  // Handle image error 
  const handleImageError = () => {
    setBgColor('#1a365d');
  };
  
  return (
    <section className="relative h-[80vh] flex items-center">
      {/* Background Image */}
      <div className="absolute inset-0" style={{ backgroundColor: bgColor }}>
        <Image
          src="/images/hero-bg.jpg"
          alt="Luxury Perfumes"
          fill
          priority
          className="object-cover"
          sizes="100vw"
          onError={handleImageError}
        />
        <div className="absolute inset-0 bg-black/50" />
      </div>
      
      {/* Content */}
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-xl">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
            Luxury Fragrances For Less
          </h1>
          <p className="text-lg md:text-xl text-white/90 mb-8">
            Premium quality perfumes inspired by world-renowned fragrances at affordable prices.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/shop"
              className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-full transition-colors"
            >
              Shop Now
            </Link>
            <Link
              href="/about"
              className="px-8 py-3 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white font-medium rounded-full transition-colors"
            >
              Learn More
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection; 