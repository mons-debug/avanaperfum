// components/ProductGrid.tsx
"use client";

import React, { useState, useEffect, useCallback, memo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { FaEye, FaShoppingCart, FaCheck, FaShoppingBag } from 'react-icons/fa';
import { formatPrice } from '@/lib/utils';
import { useTranslation } from './i18n/TranslationProvider';
import { addToCart, removeFromCart, isInCart, ProductWithTranslation } from '@/lib/cart';

type ITranslation = {
  en: string;
  fr: string;
  [key: string]: string;
};

// Use the ProductWithTranslation type from cart.ts
type Product = ProductWithTranslation;

interface ProductGridProps {
  products: Product[];
  viewMode?: 'grid' | 'list';
}

// Memoized loading skeleton
const ProductSkeleton = memo(() => (
  <div className="animate-pulse bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100">
    <div className="aspect-square bg-gray-200 rounded-md mb-2"></div>
    <div className="p-4">
      <div className="h-4 bg-gray-200 rounded mb-2"></div>
      <div className="h-3 bg-gray-200 rounded mb-2 w-3/4"></div>
      <div className="h-4 bg-gray-200 rounded w-1/3"></div>
    </div>
  </div>
));
ProductSkeleton.displayName = 'ProductSkeleton';

export default function ProductGrid({ products, viewMode = 'grid' }: ProductGridProps) {
  if (!products || products.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-500">Aucun produit disponible.</p>
      </div>
    );
  }

  // Add logging to help diagnose issues
  console.log(`Rendering ProductGrid with ${products.length} products in ${viewMode} mode`);
  
  return (
    <div className={viewMode === 'grid' 
      ? 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4 md:gap-6' 
      : 'space-y-4'
    }>
      {products.map((product, index) => {
        if (!product) {
          console.warn(`Product at index ${index} is undefined`);
          return null;
        }
        
        // Use index as key fallback if _id is missing
        const key = product._id || `product-${index}`;
        
        return viewMode === 'grid' 
          ? <GridProductCard key={key} product={product} index={index} />
          : <ListProductCard key={key} product={product} index={index} />;
      })}
    </div>
  );
}

// Memoized GridProductCard for better performance
const GridProductCard = memo(({ product, index }: { product: Product; index: number }) => {
  const { t, locale } = useTranslation();
  const router = useRouter();
  const [isHovered, setIsHovered] = useState(false);
  const [isInCartState, setIsInCartState] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [imageSrc, setImageSrc] = useState<string>('/images/product-placeholder.svg');
  
  // Set image src with cache busting
  useEffect(() => {
    if (product.images?.[0]) {
      const imgSrc = product.images[0];
      if (typeof imgSrc === 'string') {
        setImageSrc(imgSrc);
      }
    } else {
      setImageSrc('/images/product-placeholder.svg');
    }
  }, [product.images]);
  
  useEffect(() => {
    // Check if product is in cart on initial load
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

  const handleCardClick = useCallback((e: React.MouseEvent) => {
    // Prevent default to avoid any unwanted behavior
    e.preventDefault();
    // Use router.push for smooth navigation
    router.push(`/product/${product._id}`);
  }, [router, product._id]);
  
  return (
    <div 
      className="group block bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 transition-all hover:shadow-md hover:-translate-y-1 cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleCardClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          handleCardClick(e as any);
        }
      }}
    >
      {/* Product Image with fixed aspect ratio to prevent CLS */}
      <div className="relative w-full aspect-square overflow-hidden mb-2 rounded-md bg-gray-100">
        <Image
          src={imageSrc}
          alt={typeof product.name === 'object' ? (product.name[locale as keyof typeof product.name] || product.name.fr || product.name.en || 'Product') : (product.name || 'Product')}
          fill
          className="object-cover transition-opacity duration-300"
          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
          unoptimized={true}
          priority={index < 6} // Prioritize first 6 images
          onError={() => {
            setImageError(true);
            setImageSrc('/images/product-placeholder.svg');
          }}
        />
        
        {/* Quick actions overlay */}
        <div 
          className={`absolute inset-0 bg-black/5 flex items-center justify-center transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}
        >
          <div className="flex gap-2">
            <button 
              onClick={handleAddToCart}
              className={`w-10 h-10 rounded-full flex items-center justify-center shadow-md transition-all duration-200 ${
                isInCartState 
                  ? 'bg-[#c8a45d] text-white scale-110' 
                  : 'bg-white hover:bg-[#c8a45d] hover:text-white'
              }`}
              aria-label={isInCartState ? "Retirer du panier" : "Ajouter au panier"}
            >
              {isInCartState ? <FaCheck /> : <FaShoppingCart />}
            </button>
            <div 
              className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-md hover:bg-[#c8a45d] hover:text-white transition-all duration-200 cursor-pointer"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
            >
              <FaEye />
            </div>
          </div>
        </div>
        
        {/* Gender badge */}
        {product.gender && (
          <div className="absolute top-2 left-2 bg-gray-800/80 text-white text-xs py-1 px-2 rounded backdrop-blur-sm">
            {product.gender === 'Homme' ? 'Homme' : 'Femme'}
          </div>
        )}
        
        {/* Category badge */}
        {product.category && (
          <div className="absolute top-2 right-2 bg-[#c8a45d] text-white text-xs py-1 px-2 rounded backdrop-blur-sm">
            {product.category}
          </div>
        )}
      </div>
      
      {/* Product Info with fixed heights to prevent layout shift */}
      <div className="p-4 min-h-[120px] flex flex-col">
        <h3 className="text-gray-800 font-medium text-lg mb-1 line-clamp-1 group-hover:text-[#c8a45d] transition-colors leading-tight">
          {typeof product.name === 'object' ? (product.name[locale as keyof typeof product.name] || product.name.fr || product.name.en) : product.name}
        </h3>
        
        {product.inspiredBy && (
          <p className="text-gray-500 text-sm mb-2 line-clamp-1 leading-tight">
            Inspiré de {typeof product.inspiredBy === 'object' ? (product.inspiredBy[locale] || product.inspiredBy.en) : product.inspiredBy}
          </p>
        )}
        
        <div className="flex justify-between items-center mt-auto">
          <span className="text-[#c8a45d] font-semibold text-lg">{product.price} DH</span>
          {product.volume && (
            <span className="text-gray-500 text-sm">{typeof product.volume === 'object' ? (product.volume[locale as keyof typeof product.volume] || product.volume.fr || product.volume.en) : product.volume}</span>
          )}
        </div>
        
        {/* Add to Cart button */}
        <button
          onClick={handleAddToCart}
          className={`w-full mt-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center justify-center ${
            isInCartState 
              ? 'bg-green-100 text-green-700 border border-green-200'
              : 'bg-[#c8a45d] text-white hover:bg-[#b08d48] hover:scale-105'
          }`}
        >
          {isInCartState ? (
            <>
              <FaCheck className="mr-2" />
              Dans le panier
            </>
          ) : (
            <>
              <FaShoppingCart className="mr-2" />
              Ajouter au panier
            </>
          )}
        </button>
      </div>
    </div>
  );
});
GridProductCard.displayName = 'GridProductCard';

// Memoized ListProductCard for better performance
const ListProductCard = memo(({ product, index }: { product: Product; index: number }) => {
  const { t, locale } = useTranslation();
  const router = useRouter();
  const [isInCartState, setIsInCartState] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [imageSrc, setImageSrc] = useState<string>('/images/product-placeholder.svg');
  
  // Set image src with cache busting
  useEffect(() => {
    if (product.images?.[0]) {
      const imgSrc = product.images[0];
      if (typeof imgSrc === 'string') {
        setImageSrc(imgSrc);
      }
    } else {
      setImageSrc('/images/product-placeholder.svg');
    }
  }, [product.images]);
  
  useEffect(() => {
    setIsInCartState(isInCart(product._id));
    
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
  }, [product._id]);
  
  const handleAddToCart = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isInCartState) {
      removeFromCart(product._id);
    } else {
      addToCart(product);
    }
  }, [product, isInCartState]);

  const handleCardClick = useCallback((e: React.MouseEvent) => {
    // Prevent default to avoid any unwanted behavior
    e.preventDefault();
    // Use router.push for smooth navigation
    router.push(`/product/${product._id}`);
  }, [router, product._id]);
  
  return (
    <div 
      className="flex border border-gray-100 rounded-xl overflow-hidden shadow-sm bg-white hover:shadow-md transition-all cursor-pointer min-h-[160px]"
      onClick={handleCardClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          handleCardClick(e as any);
        }
      }}
    >
      {/* Product Image with fixed dimensions */}
      <div className="relative w-32 h-32 md:w-40 md:h-40 flex-shrink-0">
        <Image
          src={imageSrc}
          alt={typeof product.name === 'object' ? (product.name[locale as keyof typeof product.name] || product.name.fr || product.name.en || 'Product') : (product.name || 'Product')}
          fill
          sizes="(max-width: 768px) 128px, 160px"
          className="object-cover"
          priority={index < 4}
          unoptimized={true}
          onError={() => {
            setImageError(true);
            setImageSrc('/images/product-placeholder.svg');
          }}
        />
        
        {/* Gender badge */}
        {product.gender && (
          <div className="absolute top-2 left-2 bg-gray-800/80 text-white text-xs py-1 px-2 rounded backdrop-blur-sm">
            {product.gender === 'Homme' ? 'Homme' : 'Femme'}
          </div>
        )}
      </div>
      
      {/* Product Info */}
      <div className="flex-1 p-4 flex flex-col">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="text-gray-800 font-medium text-lg mb-1 line-clamp-1 hover:text-[#c8a45d] transition-colors">
              {typeof product.name === 'object' ? (product.name[locale as keyof typeof product.name] || product.name.en) : product.name}
            </h3>
            
            {product.inspiredBy && (
              <p className="text-gray-500 text-sm mb-1 line-clamp-1">
                Inspiré de {typeof product.inspiredBy === 'object' ? (product.inspiredBy[locale as keyof typeof product.inspiredBy] || product.inspiredBy.fr || product.inspiredBy.en) : product.inspiredBy}
              </p>
            )}
            
            {product.category && (
              <span className="inline-block bg-gray-100 text-gray-700 text-xs py-1 px-2 rounded mb-2">
                {product.category}
              </span>
            )}
          </div>
          
          <button 
            onClick={handleAddToCart}
            className={`ml-4 p-2 rounded-full transition-all duration-200 ${
              isInCartState 
                ? 'text-green-600 bg-green-50' 
                : 'text-gray-400 hover:text-[#c8a45d] hover:bg-gray-50'
            }`}
          >
            {isInCartState ? <FaCheck /> : <FaShoppingCart />}
          </button>
        </div>
        
        {product.description && (
          <p className="text-gray-600 text-sm line-clamp-2 mb-3 mt-1 flex-1">
            {typeof product.description === 'object' ? 
              (product.description[locale as keyof typeof product.description] || product.description.en) : 
              product.description}
          </p>
        )}
        
        <div className="mt-auto flex items-center justify-between">
          <div className="flex items-baseline">
            <span className="text-[#c8a45d] font-semibold text-lg">{product.price} DH</span>
            {product.volume && (
              <span className="text-gray-500 text-sm ml-2">{typeof product.volume === 'object' ? (product.volume[locale as keyof typeof product.volume] || product.volume.fr || product.volume.en) : product.volume}</span>
            )}
          </div>
          
          <button 
            onClick={handleAddToCart}
            className={`px-4 py-1.5 rounded-lg text-sm transition-all duration-200 flex items-center ${
              isInCartState 
                ? 'bg-green-100 text-green-700'
                : 'bg-[#c8a45d] hover:bg-[#b08d48] text-white hover:scale-105'
            }`}
          >
            {isInCartState ? (
              <>
                <FaCheck className="mr-1" />
                Dans le panier
              </>
            ) : (
              <>
                <FaShoppingCart className="mr-1" />
                Ajouter au panier
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
});
ListProductCard.displayName = 'ListProductCard'; 