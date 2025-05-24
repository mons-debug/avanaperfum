'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FaArrowLeft, FaTrash, FaMinus, FaPlus, FaWhatsapp, FaShoppingCart } from 'react-icons/fa';
import { getCartTotal, updateCartItemQuantity, removeFromCart, clearCart } from '@/lib/cart';
import OrderModal from '@/components/OrderModal';

// CartProduct type matches the one in lib/cart.ts
type CartProduct = {
  _id: string;
  name: string;
  price: number;
  images: string[];
  inspiredBy?: string;
  volume?: string;
  quantity: number;
};

// Shipping settings type
interface ShippingSettings {
  shippingFee: number;
  freeShippingThreshold: number;
  currency: string;
}

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartProduct[]>([]);
  const [cartTotal, setCartTotal] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<CartProduct | null>(null);
  const [shippingSettings, setShippingSettings] = useState<ShippingSettings>({
    shippingFee: 30,
    freeShippingThreshold: 250,
    currency: 'DH'
  });
  
  // Determine if order qualifies for free shipping
  const qualifiesForFreeShipping = cartTotal >= shippingSettings.freeShippingThreshold;
  
  // Calculate shipping fee
  const shippingFee = qualifiesForFreeShipping ? 0 : shippingSettings.shippingFee;
  
  // Calculate final price including shipping
  const totalWithShipping = cartTotal + shippingFee;
  
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Initialize cart from window
      window.cartItems = window.cartItems || [];
      setCartItems([...window.cartItems]);
      setCartTotal(getCartTotal());
      
      // Listen for cart updates
      const handleCartChange = (items: CartProduct[]) => {
        setCartItems([...items]);
        setCartTotal(getCartTotal());
      };
      
      window.cartListeners = window.cartListeners || [];
      window.cartListeners.push(handleCartChange);
      
      return () => {
        if (window.cartListeners) {
          window.cartListeners = window.cartListeners.filter(listener => listener !== handleCartChange);
        }
      };
    }
  }, []);
  
  // Fetch shipping settings
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch('/api/settings');
        const data = await response.json();
        
        if (data.success && data.data) {
          setShippingSettings({
            shippingFee: data.data.shippingFee,
            freeShippingThreshold: data.data.freeShippingThreshold,
            currency: data.data.currency || 'DH'
          });
        }
      } catch (error) {
        console.error('Failed to fetch shipping settings:', error);
      }
    };
    
    fetchSettings();
  }, []);
  
  const handleQuantityChange = (productId: string, quantity: number) => {
    updateCartItemQuantity(productId, quantity);
  };
  
  const handleRemoveItem = (productId: string) => {
    removeFromCart(productId);
  };
  
  const handleClearCart = () => {
    clearCart();
  };
  
  const openOrderModal = () => {
    setSelectedProduct(null);
    setIsModalOpen(true);
  };
  
  return (
    <div className="min-h-screen pt-[120px] pb-16">
      <div className="container mx-auto px-4">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-3xl font-playfair text-gray-800">Your Cart</h1>
          <Link href="/shop" className="flex items-center text-gray-600 hover:text-[#c8a45d] transition-colors">
            <FaArrowLeft className="mr-2" />
            <span>Continue Shopping</span>
          </Link>
        </div>
        
        {cartItems.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <FaShoppingCart className="text-gray-400 text-3xl" />
            </div>
            <h2 className="text-2xl font-playfair text-gray-800 mb-3">Your Cart is Empty</h2>
            <p className="text-gray-600 mb-6">Add some products to your cart to get started.</p>
            <Link href="/shop" className="inline-block bg-[#c8a45d] hover:bg-[#b08d48] text-white px-6 py-3 rounded-lg transition-colors">
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Cart Items */}
            <div className="lg:w-2/3">
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="flex items-center justify-between p-6 border-b border-gray-100">
                  <h2 className="text-xl font-medium text-gray-800">Shopping Cart ({cartItems.length} items)</h2>
                  <button 
                    onClick={handleClearCart}
                    className="text-red-500 hover:text-red-600 transition-colors flex items-center"
                  >
                    <FaTrash className="mr-2" />
                    Clear Cart
                  </button>
                </div>
                
                <div className="divide-y divide-gray-100">
                  {cartItems.map((item) => (
                    <div key={item._id} className="p-6 flex items-center flex-wrap md:flex-nowrap">
                      {/* Product Image */}
                      <div className="relative w-20 h-20 flex-shrink-0 mr-4">
                        <Image
                          src={item.images[0] || '/images/product-placeholder.svg'}
                          alt={item.name}
                          fill
                          sizes="80px"
                          className="object-cover rounded-md"
                        />
                      </div>
                      
                      {/* Product Info */}
                      <div className="flex-1 min-w-0 mr-4 md:mr-6">
                        <h3 className="text-gray-800 font-medium text-lg mb-1 truncate">
                          {item.name}
                        </h3>
                        
                        {item.inspiredBy && (
                          <p className="text-gray-500 text-sm mb-2">
                            Inspired by {item.inspiredBy}
                          </p>
                        )}
                        
                        {item.volume && (
                          <span className="inline-block bg-gray-100 text-gray-700 text-xs py-1 px-2 rounded">
                            {item.volume}
                          </span>
                        )}
                      </div>
                      
                      {/* Quantity Controls */}
                      <div className="flex items-center mr-4 md:mr-6 mt-3 md:mt-0">
                        <button
                          onClick={() => handleQuantityChange(item._id, item.quantity - 1)}
                          className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded-l-md hover:bg-gray-200 transition-colors"
                        >
                          <FaMinus size={10} />
                        </button>
                        <div className="w-10 h-8 flex items-center justify-center border-t border-b border-gray-200">
                          {item.quantity}
                        </div>
                        <button
                          onClick={() => handleQuantityChange(item._id, item.quantity + 1)}
                          className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded-r-md hover:bg-gray-200 transition-colors"
                        >
                          <FaPlus size={10} />
                        </button>
                      </div>
                      
                      {/* Price & Remove */}
                      <div className="flex flex-col items-end justify-between h-full mt-3 md:mt-0">
                        <div className="text-[#c8a45d] font-semibold">{(item.price * item.quantity).toFixed(2)} DH</div>
                        <button
                          onClick={() => handleRemoveItem(item._id)}
                          className="text-red-500 hover:text-red-600 transition-colors mt-2"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Order Summary */}
            <div className="lg:w-1/3">
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                  <h2 className="text-xl font-medium text-gray-800">Order Summary</h2>
                </div>
                
                <div className="p-6">
                  <div className="flex justify-between mb-4">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium">{cartTotal.toFixed(2)} DH</span>
                  </div>
                  
                  <div className="flex justify-between mb-4">
                    <span className="text-gray-600">Shipping</span>
                    {qualifiesForFreeShipping ? (
                      <span className="text-green-600 font-medium">Free</span>
                    ) : (
                      <span className="font-medium">{shippingFee.toFixed(2)} DH</span>
                    )}
                  </div>
                  
                  {!qualifiesForFreeShipping && cartTotal > 0 && (
                    <div className="mb-4 bg-blue-50 p-3 rounded-lg text-xs text-blue-700">
                      Add {(shippingSettings.freeShippingThreshold - cartTotal).toFixed(2)} DH more to qualify for free shipping!
                    </div>
                  )}
                  
                  <div className="border-t border-gray-100 pt-4 mb-6">
                    <div className="flex justify-between">
                      <span className="text-gray-800 font-medium">Total</span>
                      <span className="text-[#c8a45d] font-bold text-xl">{totalWithShipping.toFixed(2)} DH</span>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => cartItems.length > 0 && openOrderModal()}
                    className="w-full bg-[#c8a45d] text-white py-3 rounded-lg hover:bg-[#b08d48] transition-colors font-medium flex items-center justify-center"
                  >
                    Proceed to Checkout
                  </button>
                  
                  <Link
                    href={`https://wa.me/+212674428593?text=${encodeURIComponent(
                      `Hello, I'd like to order the following items:\n\n${cartItems.map(
                        item => `${item.quantity}x ${item.name} - ${item.price} DH each`
                      ).join('\n')}\n\nSubtotal: ${cartTotal} DH\nShipping: ${qualifiesForFreeShipping ? 'Free' : `${shippingFee} DH`}\nTotal: ${totalWithShipping} DH`
                    )}`}
                    target="_blank"
                    className="w-full mt-4 flex items-center justify-center bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 transition-colors font-medium"
                  >
                    <FaWhatsapp className="mr-2" size={20} />
                    Order via WhatsApp
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {isModalOpen && (
        <OrderModal
          product={selectedProduct || cartItems[0]}
          cartItems={cartItems}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
} 