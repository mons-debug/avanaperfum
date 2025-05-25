// components/ProductGrid.tsx
"use client";

import React, { useState, useEffect, useCallback, memo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { FaEye, FaShoppingCart, FaCheck, FaShoppingBag, FaWhatsapp, FaPlus, FaMinus } from 'react-icons/fa';
import { formatPrice } from '@/lib/utils';
import { useTranslation } from './i18n/TranslationProvider';
import { addToCart, removeFromCart, isInCart, ProductWithTranslation } from '@/lib/cart';
import { 
  generateSingleProductWhatsAppURL, 
  addToWhatsAppCart, 
  isInWhatsAppCart,
  removeFromWhatsAppCart
} from '@/lib/whatsapp';

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
  const [isInWhatsAppCartState, setIsInWhatsAppCartState] = useState(false);
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
      setIsInWhatsAppCartState(isInWhatsAppCart(product._id));
      
      // Subscribe to cart changes
      const handleCartChange = (items: any[]) => {
        setIsInCartState(items.some(item => item._id === product._id));
      };
      
      // Subscribe to WhatsApp cart changes
      const handleWhatsAppCartChange = (event: CustomEvent) => {
        setIsInWhatsAppCartState(isInWhatsAppCart(product._id));
      };
      
      if (typeof window !== 'undefined') {
        window.cartListeners = window.cartListeners || [];
        window.cartListeners.push(handleCartChange);
        window.addEventListener('whatsappCartUpdated', handleWhatsAppCartChange as EventListener);
      }
      
      return () => {
        if (typeof window !== 'undefined') {
          if (window.cartListeners) {
          window.cartListeners = window.cartListeners.filter(listener => listener !== handleCartChange);
          }
          window.removeEventListener('whatsappCartUpdated', handleWhatsAppCartChange as EventListener);
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

  const handleAddToWhatsAppCart = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!product._id) {
      console.error('Cannot add product to WhatsApp cart: missing _id');
      return;
    }
    
    // Toggle product in WhatsApp cart
    if (isInWhatsAppCartState) {
      removeFromWhatsAppCart(product._id);
    } else {
      const productName = typeof product.name === 'object' 
        ? product.name[locale as keyof typeof product.name] || product.name.fr || product.name.en || 'Produit'
        : product.name || 'Produit';
      
      const whatsappProduct = {
        _id: product._id,
        name: productName,
        price: product.price,
        volume: typeof product.volume === 'object' 
          ? product.volume[locale as keyof typeof product.volume] || product.volume.fr || product.volume.en || ''
          : product.volume || '',
        inspiredBy: typeof product.inspiredBy === 'object'
          ? product.inspiredBy[locale as keyof typeof product.inspiredBy] || product.inspiredBy.fr || product.inspiredBy.en || ''
          : product.inspiredBy || ''
      };
      
      addToWhatsAppCart(whatsappProduct);
    }
  }, [product, locale, isInWhatsAppCartState]);

  const handleWhatsAppOrder = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const productName = typeof product.name === 'object' 
      ? product.name[locale as keyof typeof product.name] || product.name.fr || product.name.en || 'Produit'
      : product.name || 'Produit';
    
    const whatsappProduct = {
      _id: product._id,
      name: productName,
      price: product.price,
      volume: typeof product.volume === 'object' 
        ? product.volume[locale as keyof typeof product.volume] || product.volume.fr || product.volume.en || ''
        : product.volume || '',
      inspiredBy: typeof product.inspiredBy === 'object'
        ? product.inspiredBy[locale as keyof typeof product.inspiredBy] || product.inspiredBy.fr || product.inspiredBy.en || ''
        : product.inspiredBy || ''
    };
    
    const whatsappUrl = generateSingleProductWhatsAppURL(whatsappProduct);
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  }, [product, locale]);
  
  return (
    <Link 
      href={`/product/${product._id}`}
      className="group block bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100/50 transition-all duration-500 hover:shadow-2xl hover:-translate-y-3 backdrop-blur-sm relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Gradient overlay for modern effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-gray-50/20 pointer-events-none rounded-3xl" />
      
      {/* Product Image with fixed aspect ratio to prevent CLS */}
      <div className="relative aspect-square overflow-hidden rounded-2xl bg-gray-50">
        <Image
          src={imageSrc}
          alt={typeof product.name === 'object' ? (product.name[locale as keyof typeof product.name] || product.name.fr || product.name.en || 'Product') : (product.name || 'Product')}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          priority={index < 6} // Prioritize first 6 images
          loading={index < 6 ? undefined : "lazy"}
          placeholder="blur"
          blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
          onError={() => {
            setImageError(true);
            setImageSrc('/images/product-placeholder.svg');
          }}
        />
        
        {/* Desktop-only quick actions overlay */}
        <div 
          className={`absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent items-center justify-center transition-all duration-500 hidden md:flex ${isHovered ? 'opacity-100' : 'opacity-0'}`}
        >
          <div className="flex gap-4">
            <button 
              onClick={handleAddToCart}
              className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-xl transition-all duration-400 backdrop-blur-md ${
                isInCartState 
                  ? 'bg-emerald-500/90 text-white scale-110 rotate-6' 
                  : 'bg-white/90 hover:bg-[#c8a45d] hover:text-white hover:scale-110 hover:rotate-6'
              }`}
              aria-label={isInCartState ? "Retirer du panier" : "Ajouter au panier"}
            >
              {isInCartState ? <FaCheck className="text-lg" /> : <FaShoppingCart className="text-lg" />}
            </button>
            <button 
              onClick={handleAddToWhatsAppCart}
              className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-xl transition-all duration-400 backdrop-blur-md ${
                isInWhatsAppCartState 
                  ? 'bg-green-600/90 text-white scale-110 -rotate-6' 
                  : 'bg-white/90 hover:bg-green-500 hover:text-white hover:scale-110 hover:-rotate-6'
              }`}
              aria-label="Ajouter à la liste WhatsApp"
            >
              {isInWhatsAppCartState ? <FaCheck className="text-lg" /> : <FaPlus className="text-lg" />}
            </button>
            <div 
              className="w-14 h-14 rounded-2xl bg-white/90 flex items-center justify-center shadow-xl hover:bg-[#c8a45d] hover:text-white transition-all duration-400 cursor-pointer backdrop-blur-md hover:scale-110"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
            >
              <FaEye className="text-lg" />
            </div>
          </div>
        </div>
        
        {/* Enhanced gender badge */}
        {product.gender && (
          <div className="absolute top-4 left-4 bg-gradient-to-r from-gray-900/80 to-gray-800/80 text-white text-xs py-2 px-4 rounded-full backdrop-blur-sm font-semibold shadow-lg">
            {product.gender === 'Homme' ? '♂ Homme' : '♀ Femme'}
          </div>
        )}
        
        {/* Enhanced category badge */}
        {product.category && (
          <div className="absolute top-4 right-4 bg-gradient-to-r from-[#c8a45d] to-[#d4b366] text-white text-xs py-2 px-4 rounded-full backdrop-blur-sm font-semibold shadow-lg">
            {product.category}
          </div>
        )}
      </div>
      
      {/* Product Info with improved spacing and typography */}
      <div className="p-6 min-h-[200px] flex flex-col relative z-10">
        <h3 className="text-gray-800 font-bold text-lg mb-2 line-clamp-2 group-hover:text-[#c8a45d] transition-colors leading-tight">
            {typeof product.name === 'object' ? (product.name[locale as keyof typeof product.name] || product.name.fr || product.name.en) : product.name}
          </h3>
          
          {product.inspiredBy && (
          <p className="text-gray-500 text-sm mb-4 line-clamp-1 leading-relaxed font-medium">
            ✨ Inspiré de {typeof product.inspiredBy === 'object' ? (product.inspiredBy[locale as keyof typeof product.inspiredBy] || product.inspiredBy.en) : product.inspiredBy}
            </p>
          )}
          
        <div className="flex justify-between items-center mb-5">
          <span className="text-[#c8a45d] font-black text-2xl">{product.price} DH</span>
            {product.volume && (
            <span className="text-gray-500 text-sm bg-gray-100 px-3 py-1.5 rounded-full font-medium">{typeof product.volume === 'object' ? (product.volume[locale as keyof typeof product.volume] || product.volume.fr || product.volume.en) : product.volume}</span>
            )}
        </div>
        
        {/* Ingredients section */}
        {product.ingredients && (
          <div className="mb-4">
            <p className="text-gray-400 text-xs font-medium mb-1">Ingrédients</p>
            <p className="text-gray-600 text-xs line-clamp-3 leading-relaxed">
              {typeof product.ingredients === 'object' 
                ? (product.ingredients[locale as keyof typeof product.ingredients] || product.ingredients.fr || product.ingredients.en)
                : product.ingredients}
            </p>
          </div>
        )}
        
        {/* Action buttons - Always visible for mobile */}
        <div className="mt-auto space-y-3">
          {/* All buttons in one row with equal sizes */}
          <div className="flex gap-2">
        <button
              onClick={handleAddToCart}
              className={`flex-1 py-2.5 rounded-xl text-base font-medium transition-all duration-300 flex items-center justify-center ${
            isInCartState 
                  ? 'bg-gradient-to-r from-emerald-50 to-green-50 text-emerald-700 border border-emerald-200 hover:from-emerald-100 hover:to-green-100'
                  : 'bg-gradient-to-r from-[#c8a45d] to-[#d4b366] text-white hover:from-[#b08d48] hover:to-[#c8a45d] shadow-sm hover:shadow-md'
              }`}
            >
              <span className="opacity-70">
                {isInCartState ? <FaCheck /> : <FaShoppingCart />}
              </span>
            </button>

            <button
              onClick={handleWhatsAppOrder}
              className="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white py-2.5 rounded-xl font-medium text-base transition-all duration-300 flex items-center justify-center hover:from-green-600 hover:to-green-700 hover:shadow-md shadow-sm"
            >
              <span className="opacity-70">
                <FaWhatsapp />
              </span>
            </button>

            <button
              onClick={handleAddToWhatsAppCart}
              className={`flex-1 py-2.5 rounded-xl text-base font-medium transition-all duration-300 flex items-center justify-center ${
                isInWhatsAppCartState 
                  ? 'bg-gradient-to-r from-green-50 to-emerald-50 text-green-700 border border-green-200 hover:from-green-100 hover:to-emerald-100'
                  : 'bg-white text-gray-600 border border-gray-200 hover:border-green-300 hover:text-green-600 hover:bg-green-50 shadow-sm'
              }`}
            >
              <span className="opacity-70">
                {isInWhatsAppCartState ? <FaCheck /> : <FaPlus />}
              </span>
        </button>
          </div>
        </div>
      </div>
    </Link>
  );
});
GridProductCard.displayName = 'GridProductCard';

// Memoized ListProductCard for better performance
const ListProductCard = memo(({ product, index }: { product: Product; index: number }) => {
  const { t, locale } = useTranslation();
  const router = useRouter();
  const [isInCartState, setIsInCartState] = useState(false);
  const [isInWhatsAppCartState, setIsInWhatsAppCartState] = useState(false);
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
    setIsInWhatsAppCartState(isInWhatsAppCart(product._id));
    
    const handleCartChange = (items: any[]) => {
      setIsInCartState(items.some(item => item._id === product._id));
    };
    
    const handleWhatsAppCartChange = (event: CustomEvent) => {
      setIsInWhatsAppCartState(isInWhatsAppCart(product._id));
    };
    
    if (typeof window !== 'undefined') {
      window.cartListeners = window.cartListeners || [];
      window.cartListeners.push(handleCartChange);
      window.addEventListener('whatsappCartUpdated', handleWhatsAppCartChange as EventListener);
    }
    
    return () => {
      if (typeof window !== 'undefined') {
        if (window.cartListeners) {
        window.cartListeners = window.cartListeners.filter(listener => listener !== handleCartChange);
        }
        window.removeEventListener('whatsappCartUpdated', handleWhatsAppCartChange as EventListener);
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

  const handleWhatsAppOrder = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const productName = typeof product.name === 'object' 
      ? product.name[locale as keyof typeof product.name] || product.name.fr || product.name.en || 'Produit'
      : product.name || 'Produit';
    
    const whatsappProduct = {
      _id: product._id,
      name: productName,
      price: product.price,
      volume: typeof product.volume === 'object' 
        ? product.volume[locale as keyof typeof product.volume] || product.volume.fr || product.volume.en || ''
        : product.volume || '',
      inspiredBy: typeof product.inspiredBy === 'object'
        ? product.inspiredBy[locale as keyof typeof product.inspiredBy] || product.inspiredBy.fr || product.inspiredBy.en || ''
        : product.inspiredBy || ''
    };
    
    const whatsappUrl = generateSingleProductWhatsAppURL(whatsappProduct);
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  }, [product, locale]);
  
  return (
    <Link 
      href={`/product/${product._id}`}
      className="flex border border-gray-100/50 rounded-2xl overflow-hidden shadow-sm bg-white hover:shadow-xl transition-all duration-500 min-h-[180px] hover:-translate-y-1 backdrop-blur-sm"
    >
      {/* Product Image with fixed dimensions */}
      <div className="relative w-36 h-36 md:w-44 md:h-44 flex-shrink-0 bg-gradient-to-br from-gray-50 to-gray-100">
        <Image
          src={imageSrc}
          alt={typeof product.name === 'object' ? (product.name[locale as keyof typeof product.name] || product.name.fr || product.name.en || 'Product') : (product.name || 'Product')}
          fill
          sizes="(max-width: 768px) 144px, 176px"
          className="object-cover transition-transform duration-500 hover:scale-105"
          priority={index < 4}
          loading={index < 4 ? undefined : "lazy"}
          placeholder="blur"
          blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
          onError={() => {
            setImageError(true);
            setImageSrc('/images/product-placeholder.svg');
          }}
        />
        
        {/* Gender badge */}
        {product.gender && (
          <div className="absolute top-3 left-3 bg-gradient-to-r from-gray-900/80 to-gray-800/80 text-white text-xs py-1.5 px-3 rounded-full backdrop-blur-sm font-semibold">
            {product.gender === 'Homme' ? '♂ Homme' : '♀ Femme'}
          </div>
        )}
      </div>
      
      {/* Product Info */}
      <div className="flex-1 p-5 flex flex-col">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="text-gray-800 font-bold text-xl mb-2 line-clamp-1 hover:text-[#c8a45d] transition-colors">
                {typeof product.name === 'object' ? (product.name[locale as keyof typeof product.name] || product.name.en) : product.name}
              </h3>
              
              {product.inspiredBy && (
              <p className="text-gray-500 text-sm mb-2 line-clamp-1 font-medium">
                ✨ {t('product.inspiredBy', 'Inspiré de')} {typeof product.inspiredBy === 'object' ? (product.inspiredBy[locale as keyof typeof product.inspiredBy] || product.inspiredBy.fr || product.inspiredBy.en) : product.inspiredBy}
                </p>
              )}
              
              {product.category && (
              <span className="inline-block bg-gradient-to-r from-[#c8a45d] to-[#d4b366] text-white text-xs py-1.5 px-3 rounded-full mb-3 font-semibold">
                  {product.category}
                </span>
              )}
          </div>
          
          <button 
            onClick={handleAddToCart}
            className={`ml-4 p-3 rounded-2xl transition-all duration-300 shadow-md hover:shadow-lg ${
              isInCartState 
                ? 'text-emerald-600 bg-emerald-50 border border-emerald-200 scale-105' 
                : 'text-gray-400 hover:text-[#c8a45d] hover:bg-[#c8a45d]/10 bg-gray-50 hover:scale-105'
            }`}
          >
            {isInCartState ? <FaCheck className="text-lg" /> : <FaShoppingCart className="text-lg" />}
          </button>
        </div>
        
        {product.description && (
          <p className="text-gray-600 text-sm line-clamp-2 mb-4 mt-1 flex-1 leading-relaxed">
            {typeof product.description === 'object' ? 
              (product.description[locale as keyof typeof product.description] || product.description.en) : 
              product.description}
          </p>
        )}
        
        <div className="mt-auto space-y-3">
          <div className="flex items-center justify-between">
          <div className="flex items-baseline">
              <span className="text-[#c8a45d] font-black text-2xl">{product.price} DH</span>
            {product.volume && (
                <span className="text-gray-500 text-sm ml-3 bg-gray-100 px-2 py-1 rounded-full font-medium">{typeof product.volume === 'object' ? (product.volume[locale as keyof typeof product.volume] || product.volume.fr || product.volume.en) : product.volume}</span>
            )}
            </div>
          </div>
          
          {/* Ingredients section */}
          {product.ingredients && (
            <div className="mb-2">
              <p className="text-gray-400 text-xs font-medium mb-1">Ingrédients</p>
              <p className="text-gray-600 text-xs line-clamp-2 leading-relaxed">
                {typeof product.ingredients === 'object' 
                  ? (product.ingredients[locale as keyof typeof product.ingredients] || product.ingredients.fr || product.ingredients.en)
                  : product.ingredients}
              </p>
            </div>
          )}
          
          {/* Modern button layout */}
          <div className="space-y-2">
            <div className="flex gap-2">
            <button 
                onClick={handleAddToCart}
                className={`flex-1 px-4 py-2.5 rounded-xl text-base font-medium transition-all duration-300 flex items-center justify-center ${
                isInCartState 
                    ? 'bg-gradient-to-r from-emerald-50 to-green-50 text-emerald-700 border border-emerald-200'
                    : 'bg-gradient-to-r from-[#c8a45d] to-[#d4b366] hover:from-[#b08d48] hover:to-[#c8a45d] text-white shadow-sm hover:shadow-md'
                }`}
              >
                <span className="opacity-70">
                  {isInCartState ? <FaCheck /> : <FaShoppingCart />}
                </span>
              </button>
              
              <button 
                onClick={handleWhatsAppOrder}
                className="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white py-2.5 rounded-xl font-medium text-base transition-all duration-300 flex items-center justify-center hover:from-green-600 hover:to-green-700 hover:shadow-md shadow-sm"
              >
                <span className="opacity-70">
                  <FaWhatsapp />
                </span>
            </button>
            
              <button 
                className="flex-1 px-4 py-2.5 rounded-xl text-base font-medium transition-all duration-300 flex items-center justify-center bg-white text-gray-600 border border-gray-200 hover:border-green-300 hover:text-green-600 hover:bg-green-50 shadow-sm"
              >
                <span className="opacity-70">
                  <FaPlus />
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
});
ListProductCard.displayName = 'ListProductCard'; 