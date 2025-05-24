// components/ProductGrid.tsx
"use client";

import React, { useState, useEffect } from 'react';
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

export default function ProductGrid({ products, viewMode = 'grid' }: ProductGridProps) {
  if (!products || products.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-500">No products available.</p>
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

function GridProductCard({ product, index }: { product: Product; index: number }) {
  const { t, locale } = useTranslation();
  const router = useRouter();
  const [isHovered, setIsHovered] = useState(false);
  const [isInCartState, setIsInCartState] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [imageSrc, setImageSrc] = useState<string>('/images/product-placeholder.svg');
  
  // Log product information to help diagnose problems
  useEffect(() => {
    if (!product._id) {
      console.warn(`Product at index ${index} has no _id:`, product);
    }
  }, [product, index]);
  
  // Set image src with cache busting
  useEffect(() => {
    if (product.images?.[0]) {
      const imgSrc = product.images[0];
      // Add cache busting parameter for local images
      if (typeof imgSrc === 'string') {
        if (imgSrc.startsWith('/')) {
          setImageSrc(`${imgSrc}?t=${Date.now()}`);
        } else {
          setImageSrc(imgSrc);
        }
      }
    }
  }, [product, product.images]);
  
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
  
  const handleAddToCart = (e: React.MouseEvent) => {
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
  };
  
  return (
    <Link 
      href={`/product/${product._id}`}
      className="group block bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 transition-all hover:shadow-md hover:-translate-y-1 cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={(e) => {
        // Ensure the link works properly on first click/tap on mobile
        if (window.innerWidth <= 768) {
          window.location.href = `/product/${product._id}`;
        }
      }}
    >
      {/* Product Image */}
      <div className="relative w-full aspect-square overflow-hidden mb-2 rounded-md bg-gray-100">
        <Image
          src={imageSrc}
          alt={typeof product.name === 'object' ? (product.name[locale as keyof typeof product.name] || product.name.fr || product.name.en || 'Product') : (product.name || 'Product')}
          fill
          className="object-cover"
          unoptimized={true} // Disable Next.js image optimization to avoid caching
          priority={true} // Load this image earlier
          onError={() => {
            console.error(`Image error for product ${product._id}: ${product.images[0]}`);
            setImageError(true);
            setImageSrc('/images/product-placeholder.svg');
          }}
        />
        
        {/* Quick actions */}
        <div 
          className={`absolute inset-0 bg-black/5 flex items-center justify-center transition-opacity ${isHovered ? 'opacity-100' : 'opacity-0'}`}
          data-component-name="GridProductCard"
        >
          <div className="flex gap-2">
            <button 
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleAddToCart(e);
              }}
              className={`w-10 h-10 rounded-full flex items-center justify-center shadow-md transition-colors ${
                isInCartState 
                  ? 'bg-[#c8a45d] text-white' 
                  : 'bg-white hover:bg-[#c8a45d] hover:text-white'
              }`}
              aria-label={isInCartState ? "Remove from cart" : "Add to cart"}
            >
              {isInCartState ? <FaCheck /> : <FaShoppingCart />}
            </button>
            <div 
              className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-md hover:bg-[#c8a45d] hover:text-white transition-colors cursor-pointer"
              onClick={(e) => {
                e.preventDefault();
                // This is just a visual button, the entire card is clickable
              }}
            >
              <FaEye />
            </div>
          </div>
        </div>
        
        {/* Gender badge */}
        {product.gender && (
          <div className="absolute top-2 left-2 bg-gray-800/80 text-white text-xs py-1 px-2 rounded">
            {product.gender === 'Homme' ? t('footer.links.forHim', 'For Him') : 
             product.gender === 'Femme' ? t('footer.links.forHer', 'For Her') : 
             product.gender === 'Mixte' || product.gender === 'Unisexe' ? t('shop.unisex', 'Unisex') : product.gender}
          </div>
        )}
        
        {/* Category badge, if available */}
        {product.category && (
          <div className="absolute top-2 right-2 bg-[#c8a45d] text-white text-xs py-1 px-2 rounded">
            {product.category}
          </div>
        )}
      </div>
      
      {/* Product Info */}
      <div className="p-4">
        <div className="block">
          <h3 className="text-gray-800 font-medium text-lg mb-1 line-clamp-1 group-hover:text-[#c8a45d] transition-colors">
            {typeof product.name === 'object' ? (product.name[locale as keyof typeof product.name] || product.name.fr || product.name.en) : product.name}
          </h3>
          
          {product.inspiredBy && (
            <p className="text-gray-500 text-sm mb-2 line-clamp-1">
              {t('product.inspiredBy', 'Inspired by')} {typeof product.inspiredBy === 'object' ? (product.inspiredBy[locale] || product.inspiredBy.en) : product.inspiredBy}
            </p>
          )}
          
          <div className="flex justify-between items-center mt-2">
            <span className="text-[#c8a45d] font-semibold">{product.price} {t('product.currency', 'DH')}</span>
            {product.volume && (
              <span className="text-gray-500 text-sm">{typeof product.volume === 'object' ? (product.volume[locale as keyof typeof product.volume] || product.volume.fr || product.volume.en) : product.volume}</span>
            )}
          </div>
        </div>
        
        {/* Add to Cart button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            handleAddToCart(e);
          }}
          className={`w-full mt-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center ${
            isInCartState 
              ? 'bg-green-100 text-green-700 border border-green-200'
              : 'bg-[#c8a45d] text-white hover:bg-[#b08d48]'
          }`}
        >
          {isInCartState ? (
            <>
              <FaCheck className="mr-2" />
              {t('product.inCart', 'In Cart')}
            </>
          ) : (
            <>
              <FaShoppingCart className="mr-2" />
              {t('product.addToCart', 'Add to Cart')}
            </>
          )}
        </button>
      </div>
    </Link>
  );
}

function ListProductCard({ product, index }: { product: Product; index: number }) {
  const { t, locale } = useTranslation();
  const router = useRouter();
  const [isInCartState, setIsInCartState] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [imageSrc, setImageSrc] = useState<string>('/images/product-placeholder.svg');
  
  // Log product information to help diagnose problems
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log(`List product card for index ${index}:`, product);
    }
  }, [product, index]);
  
  // Set image src with cache busting
  useEffect(() => {
    if (product.images?.[0]) {
      const imgSrc = product.images[0];
      // Add cache busting parameter for local images
      if (typeof imgSrc === 'string') {
        if (imgSrc.startsWith('/')) {
          setImageSrc(`${imgSrc}?t=${Date.now()}`);
        } else {
          setImageSrc(imgSrc);
        }
      }
    } else {
      setImageSrc('/images/product-placeholder.svg');
    }
  }, [product, product.images]);
  
  useEffect(() => {
    // Check if product is in cart on initial load
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
  }, [product._id]);
  
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isInCartState) {
      removeFromCart(product._id);
    } else {
      addToCart(product);
    }
  };
  
  return (
    <Link 
      href={`/product/${product._id}`}
      className="flex border border-gray-100 rounded-xl overflow-hidden shadow-sm bg-white hover:shadow-md transition-all cursor-pointer"
      onClick={(e) => {
        // Ensure the link works properly on first click/tap on mobile
        if (window.innerWidth <= 768) {
          window.location.href = `/product/${product._id}`;
        }
      }}
    >
      {/* Product Image */}
      <div className="relative w-32 h-32 md:w-40 md:h-40 flex-shrink-0">
        <Image
          src={imageSrc}
          alt={typeof product.name === 'object' ? (product.name[locale as keyof typeof product.name] || product.name.fr || product.name.en || 'Product') : (product.name || 'Product')}
          fill
          sizes="(max-width: 768px) 128px, 160px"
          className="object-cover"
          onLoad={() => setImageLoaded(true)}
          priority={true}
          unoptimized={true} /* Disable Next.js image optimization to avoid caching */
          onError={(e) => {
            console.log(`Error loading image for product ${product._id || index}`, imageSrc);
            setImageSrc('/images/product-placeholder.svg');
          }}
        />
        
        {/* Gender badge */}
        {product.gender && (
          <div className="absolute top-2 left-2 bg-gray-800/80 text-white text-xs py-1 px-2 rounded">
            {product.gender === 'Homme' ? t('footer.links.forHim', 'For Him') : 
             product.gender === 'Femme' ? t('footer.links.forHer', 'For Her') : 
             product.gender === 'Mixte' || product.gender === 'Unisexe' ? t('shop.unisex', 'Unisex') : product.gender}
          </div>
        )}
      </div>
      
      {/* Product Info */}
      <div className="flex-1 p-4 flex flex-col">
        <div className="flex items-start justify-between">
          <div>
            <div className="block">
              <h3 className="text-gray-800 font-medium text-lg mb-1 line-clamp-1 hover:text-[#c8a45d] transition-colors">
                {typeof product.name === 'object' ? (product.name[locale as keyof typeof product.name] || product.name.en) : product.name}
              </h3>
              
              {product.inspiredBy && (
                <p className="text-gray-500 text-sm mb-1">
                  {t('product.inspiredBy', 'Inspired by')} {typeof product.inspiredBy === 'object' ? (product.inspiredBy[locale as keyof typeof product.inspiredBy] || product.inspiredBy.fr || product.inspiredBy.en) : product.inspiredBy}
                </p>
              )}
              
              {product.category && (
                <span className="inline-block bg-gray-100 text-gray-700 text-xs py-1 px-2 rounded mb-2">
                  {product.category}
                </span>
              )}
            </div>
            
            {/* Mobile Add to Cart button */}
            <div className="mt-3 block md:hidden">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleAddToCart(e);
                }}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${isInCartState 
                  ? 'bg-green-100 text-green-700 border border-green-200'
                  : 'bg-[#c8a45d] text-white hover:bg-[#b08d48]'
                }`}
              >
                {isInCartState ? t('product.inCart', 'In Cart') : t('product.addToCart', 'Add to Cart')}
              </button>
            </div>
          </div>
          
          <button 
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleAddToCart(e);
            }}
            className={`p-2 rounded-full ${
              isInCartState 
                ? 'text-green-600 bg-green-50' 
                : 'text-gray-400 hover:text-[#c8a45d] hover:bg-gray-50'
            }`}
          >
            {isInCartState ? <FaCheck /> : <FaShoppingCart />}
          </button>
        </div>
        
        {product.description && (
          <p className="text-gray-600 text-sm line-clamp-2 mb-3 mt-1">
            {typeof product.description === 'object' ? 
              (product.description[locale as keyof typeof product.description] || product.description.en) : 
              product.description}
          </p>
        )}
        
        <div className="mt-auto flex items-center justify-between">
          <div className="flex items-baseline">
            <span className="text-[#c8a45d] font-semibold text-lg">{product.price} {t('product.currency', 'DH')}</span>
            {product.volume && (
              <span className="text-gray-500 text-sm ml-2">{typeof product.volume === 'object' ? (product.volume[locale as keyof typeof product.volume] || product.volume.fr || product.volume.en) : product.volume}</span>
            )}
          </div>
          
          <div className="flex space-x-2">
            <button 
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleAddToCart(e);
              }}
              className={`px-4 py-1.5 rounded-lg text-sm transition-colors flex items-center ${
                isInCartState 
                  ? 'bg-green-100 text-green-700'
                  : 'bg-[#c8a45d] hover:bg-[#b08d48] text-white'
              }`}
            >
              {isInCartState ? (
                <>
                  <FaCheck className="mr-1" />
                  {t('product.inCart', 'In Cart')}
                </>
              ) : (
                <>
                  <FaShoppingCart className="mr-1" />
                  {t('product.addToCart', 'Add to Cart')}
                </>
              )}
            </button>
            
            <div 
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-1.5 rounded-lg text-sm transition-colors flex items-center cursor-pointer"
              onClick={(e) => {
                e.preventDefault();
                // This is just a visual button, the entire card is clickable
              }}
            >
              {t('product.details', 'Details')}
              <FaEye className="ml-1" />
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
} 