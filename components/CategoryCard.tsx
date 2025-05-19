'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface CategoryProps {
  category: {
    _id: string;
    name: string;
    slug: string;
    description?: string;
    image?: string;
    featured?: boolean;
  };
}

const CategoryCard: React.FC<CategoryProps> = ({ category }) => {
  const { name, slug, image } = category;
  
  // Default descriptions for known categories
  const getDescription = () => {
    switch (name) {
      case 'Deluxe Studio':
        return 'Exclusive fragrances crafted in our premium studio collection';
      case 'Femme':
        return 'Elegant and sophisticated fragrances for women';
      case 'Homme':
        return 'Bold and refined fragrances for men';
      case 'Unisexe':
        return 'Universal fragrances that transcend gender boundaries';
      case 'avana specials':
        return 'Limited edition and special releases from AVANA PARFUM';
      default:
        return category.description;
    }
  };
  
  // Image handling with fallback chain:
  // 1. Uploaded image
  // 2. SVG by slug
  // 3. Default SVG
  const [imgSrc, setImgSrc] = useState<string>(
    image || `/images/categories/${slug}.svg`
  );
  
  // Handle image error - try SVG before falling back to default
  const handleImageError = () => {
    if (imgSrc === image) {
      // If the uploaded image failed, try the SVG
      setImgSrc(`/images/categories/${slug}.svg`);
    } else {
      // If both failed, use default
      setImgSrc('/images/categories/default.svg');
    }
  };
  
  return (
    <Link 
      href={`/shop?category=${encodeURIComponent(name)}`}
      className="group block relative h-[400px] rounded-xl overflow-hidden shadow-lg transition-transform duration-300 hover:scale-[1.02]"
    >
      <Image
        src={imgSrc}
        alt={name}
        fill
        className="object-cover transition-transform duration-700 group-hover:scale-110"
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        onError={handleImageError}
        priority
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent">
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <h3 className="text-2xl font-display text-white mb-2">{name}</h3>
          <p className="text-white/80 text-sm line-clamp-2 mb-4">
            {getDescription()}
          </p>
          <span className="inline-flex items-center text-sm text-white bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
            View Collection
          </span>
        </div>
      </div>
    </Link>
  );
};

export default CategoryCard; 