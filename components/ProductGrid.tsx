// components/ProductGrid.tsx
"use client";

import Link from 'next/link';
import Image from 'next/image';
import { FaEye, FaShoppingCart, FaCheck } from 'react-icons/fa';
import { useState, useEffect } from 'react';
import { addToCart, removeFromCart, isInCart } from '@/lib/cart';

type Product = {
  _id: string;
  name: string;
  inspiredBy?: string;
  description?: string;
  price: number;
  volume?: string;
  images: string[];
  gender?: string;
  category?: string;
};

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
  const [isHovered, setIsHovered] = useState(false);
  const [isInCartState, setIsInCartState] = useState(false);
  
  // Log product information to help diagnose problems
  useEffect(() => {
    if (!product._id) {
      console.warn(`Product at index ${index} has no _id:`, product);
    }
  }, [product, index]);
  
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
    <div 
      className="group bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 transition-all hover:shadow-md hover:-translate-y-1"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Product Image */}
      <div className="relative aspect-square">
        <Image
          src={product.images[0] || '/images/product-placeholder.svg'}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
          className="object-cover"
        />
        
        {/* Quick actions */}
        <div className={`absolute inset-0 bg-black/5 flex items-center justify-center transition-opacity ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
          <div className="flex gap-2">
            <button 
              onClick={handleAddToCart}
              className={`w-10 h-10 rounded-full flex items-center justify-center shadow-md transition-colors ${
                isInCartState 
                  ? 'bg-[#c8a45d] text-white' 
                  : 'bg-white hover:bg-[#c8a45d] hover:text-white'
              }`}
              aria-label={isInCartState ? "Remove from cart" : "Add to cart"}
            >
              {isInCartState ? <FaCheck /> : <FaShoppingCart />}
            </button>
            <Link
              href={`/product/${product._id}`}
              className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-md hover:bg-[#c8a45d] hover:text-white transition-colors"
            >
              <FaEye />
            </Link>
          </div>
        </div>
        
        {/* Gender badge */}
        {product.gender && (
          <div className="absolute top-2 left-2 bg-gray-800/80 text-white text-xs py-1 px-2 rounded">
            {product.gender}
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
        <Link href={`/product/${product._id}`} className="block">
          <h3 className="text-gray-800 font-medium text-lg mb-1 line-clamp-1 group-hover:text-[#c8a45d] transition-colors">
            {product.name}
          </h3>
          
          {product.inspiredBy && (
            <p className="text-gray-500 text-sm mb-2 line-clamp-1">
              Inspired by {product.inspiredBy}
            </p>
          )}
          
          <div className="flex justify-between items-center mt-2">
            <span className="text-[#c8a45d] font-semibold">{product.price} DH</span>
            {product.volume && (
              <span className="text-gray-500 text-sm">{product.volume}</span>
            )}
          </div>
        </Link>
        
        {/* Add to Cart button */}
        <button
          onClick={handleAddToCart}
          className={`w-full mt-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center ${
            isInCartState 
              ? 'bg-green-100 text-green-700 border border-green-200'
              : 'bg-[#c8a45d] text-white hover:bg-[#b08d48]'
          }`}
        >
          {isInCartState ? (
            <>
              <FaCheck className="mr-2" />
              Added to Cart
            </>
          ) : (
            <>
              <FaShoppingCart className="mr-2" />
              Add to Cart
            </>
          )}
        </button>
      </div>
    </div>
  );
}

function ListProductCard({ product, index }: { product: Product; index: number }) {
  const [isInCartState, setIsInCartState] = useState(false);
  
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
    if (isInCartState) {
      removeFromCart(product._id);
    } else {
      addToCart(product);
    }
  };
  
  return (
    <div className="flex border border-gray-100 rounded-xl overflow-hidden shadow-sm bg-white hover:shadow-md transition-all">
      {/* Product Image */}
      <div className="relative w-32 h-32 md:w-40 md:h-40 flex-shrink-0">
        <Image
          src={product.images[0] || '/images/product-placeholder.svg'}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 128px, 160px"
          className="object-cover"
        />
        
        {/* Gender badge */}
        {product.gender && (
          <div className="absolute top-2 left-2 bg-gray-800/80 text-white text-xs py-1 px-2 rounded">
            {product.gender}
          </div>
        )}
      </div>
      
      {/* Product Info */}
      <div className="flex-1 p-4 flex flex-col">
        <div className="flex items-start justify-between">
          <div>
            <Link href={`/product/${product._id}`} className="block">
              <h3 className="text-gray-800 font-medium text-lg mb-1 hover:text-[#c8a45d] transition-colors">
                {product.name}
              </h3>
            </Link>
            
            {product.inspiredBy && (
              <p className="text-gray-500 text-sm mb-1">
                Inspired by {product.inspiredBy}
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
            {product.description}
          </p>
        )}
        
        <div className="mt-auto flex items-center justify-between">
          <div className="flex items-baseline">
            <span className="text-[#c8a45d] font-semibold text-lg">{product.price} DH</span>
            {product.volume && (
              <span className="text-gray-500 text-sm ml-2">{product.volume}</span>
            )}
          </div>
          
          <div className="flex space-x-2">
            <button 
              onClick={handleAddToCart}
              className={`px-4 py-1.5 rounded-lg text-sm transition-colors flex items-center ${
                isInCartState 
                  ? 'bg-green-100 text-green-700'
                  : 'bg-[#c8a45d] hover:bg-[#b08d48] text-white'
              }`}
            >
              {isInCartState ? (
                <>
                  <FaCheck className="mr-1" />
                  Added
                </>
              ) : (
                <>
                  <FaShoppingCart className="mr-1" />
                  Add to Cart
                </>
              )}
            </button>
            
            <Link 
              href={`/product/${product._id}`}
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-1.5 rounded-lg text-sm transition-colors flex items-center"
            >
              Details
              <FaEye className="ml-1" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 