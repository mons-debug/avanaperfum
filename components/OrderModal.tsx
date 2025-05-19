"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FaTimes, FaShoppingBag, FaUserAlt, FaEnvelope, FaPhone, FaHashtag } from 'react-icons/fa';
import { getImageSrc, imageConfig } from '@/lib/utils/image';
import Image from 'next/image';
import Link from 'next/link';

interface ShippingSettings {
  shippingFee: number;
  freeShippingThreshold: number;
  currency: string;
}

interface OrderModalProps {
  product: {
    _id: string;
    name: string;
    price: number;
    images: string[];
    volume?: string;
    inspiredBy?: string;
    quantity?: number;
  };
  onClose: () => void;
  cartItems?: Array<{
    _id: string;
    name: string;
    price: number;
    images: string[];
    volume?: string;
    inspiredBy?: string;
    quantity: number;
  }>;
}

const OrderModal: React.FC<OrderModalProps> = ({ product, onClose, cartItems }) => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    quantity: product.quantity || 1,
    address: '',
    city: '',
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [shippingSettings, setShippingSettings] = useState<ShippingSettings>({
    shippingFee: 30,
    freeShippingThreshold: 250,
    currency: 'DH'
  });
  
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
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };
  
  const increaseQuantity = () => {
    setFormData(prev => ({
      ...prev,
      quantity: prev.quantity + 1
    }));
  };
  
  const decreaseQuantity = () => {
    if (formData.quantity > 1) {
      setFormData(prev => ({
        ...prev,
        quantity: prev.quantity - 1
      }));
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    
    try {
      // If we have cart items, submit all of them
      const orderData = cartItems 
        ? { 
            ...formData, 
            items: cartItems.map(item => ({ id: item._id, quantity: item.quantity })),
            subtotal: cartTotal,
            shipping: shippingFee,
            total: totalPrice
          }
        : { 
            ...formData, 
            product: product._id,
            subtotal: singleProductTotal,
            shipping: shippingFee,
            total: totalPrice
          };

      console.log('Submitting order data:', orderData);
      
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit order');
      }
      
      // Success - redirect to thank you page
      router.push('/thank-you');
    } catch (err: any) {
      setError(err.message || 'An error occurred while placing your order');
      setIsSubmitting(false);
    }
  };
  
  // Calculate total price for a single product
  const singleProductTotal = product.price * formData.quantity;
  
  // Calculate total price for cart items if present
  const cartTotal = cartItems 
    ? cartItems.reduce((total, item) => total + (item.price * item.quantity), 0)
    : 0;
    
  // Determine the subtotal (before shipping)
  const subtotal = cartItems ? cartTotal : singleProductTotal;
  
  // Determine if order qualifies for free shipping
  const qualifiesForFreeShipping = subtotal >= shippingSettings.freeShippingThreshold;
  
  // Calculate shipping fee
  const shippingFee = qualifiesForFreeShipping ? 0 : shippingSettings.shippingFee;
  
  // Calculate final price including shipping
  const totalPrice = subtotal + shippingFee;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-4">
            <h2 className="text-2xl font-playfair font-semibold text-gray-800">Complete Your Order</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Close modal"
            >
              <FaTimes size={20} />
            </button>
          </div>

          {/* Product Summary - Show either cart items or single product */}
          {cartItems && cartItems.length > 0 ? (
            <div className="mb-6 space-y-4">
              <h3 className="font-medium text-gray-800">Your Cart Items</h3>
              {cartItems.map((item) => (
                <div key={item._id} className="flex gap-4 p-4 bg-gray-50 rounded-lg">
                  <div className="relative h-16 w-16 flex-shrink-0 rounded-lg overflow-hidden">
                    <Image
                      src={getImageSrc(item.images[0])}
                      alt={item.name}
                      fill
                      sizes={imageConfig.product.sizes.thumbnail}
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <h4 className="font-medium text-gray-800">{item.name}</h4>
                      <span className="text-sm font-medium">x{item.quantity}</span>
                    </div>
                    {item.inspiredBy && (
                      <p className="text-gray-500 text-xs">Inspired by {item.inspiredBy}</p>
                    )}
                    <div className="flex justify-between mt-1">
                      <span className="text-[#c8a45d] text-sm">{item.price.toFixed(2)} DH</span>
                      <span className="text-[#c8a45d] font-medium">{(item.price * item.quantity).toFixed(2)} DH</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
          <div className="flex gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
              <div className="relative h-24 w-24 flex-shrink-0 rounded-lg overflow-hidden">
              <Image
                src={getImageSrc(product.images[0])}
                alt={product.name}
                fill
                sizes={imageConfig.product.sizes.thumbnail}
                  className="object-cover"
              />
            </div>
            <div>
                <h3 className="font-medium text-gray-800">{product.name}</h3>
                {product.inspiredBy && (
                  <p className="text-gray-500 text-sm">Inspired by {product.inspiredBy}</p>
                )}
                {product.volume && (
                  <p className="text-gray-500 text-sm">{product.volume}</p>
                )}
                <p className="text-[#c8a45d] font-medium mt-1">{product.price.toFixed(2)} DH</p>
              </div>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Full Name *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <FaUserAlt className="text-gray-400" />
                </div>
              <input
                id="name"
                name="name"
                  type="text"
                  required
                value={formData.name}
                onChange={handleChange}
                  placeholder="Your full name"
                  className="pl-10 w-full rounded-lg border border-gray-200 p-2.5 focus:ring-1 focus:ring-[#c8a45d] focus:border-[#c8a45d]"
              />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address <span className="text-gray-500 font-normal">(Optional)</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <FaEnvelope className="text-gray-400" />
                </div>
              <input
                id="email"
                name="email"
                  type="email"
                value={formData.email}
                onChange={handleChange}
                  placeholder="Your email address (optional)"
                  className="pl-10 w-full rounded-lg border border-gray-200 p-2.5 focus:ring-1 focus:ring-[#c8a45d] focus:border-[#c8a45d]"
              />
              </div>
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <FaPhone className="text-gray-400" />
                </div>
              <input
                id="phone"
                name="phone"
                  type="tel"
                  required
                value={formData.phone}
                onChange={handleChange}
                  placeholder="Your phone number"
                  className="pl-10 w-full rounded-lg border border-gray-200 p-2.5 focus:ring-1 focus:ring-[#c8a45d] focus:border-[#c8a45d]"
              />
              </div>
            </div>

            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                Delivery Address *
              </label>
              <div className="relative">
                <textarea
                  id="address"
                  name="address"
                  required
                  value={formData.address}
                onChange={handleChange}
                  placeholder="Street address, building, apartment number, etc."
                  className="w-full rounded-lg border border-gray-200 p-2.5 focus:ring-1 focus:ring-[#c8a45d] focus:border-[#c8a45d]"
                  rows={2}
                />
              </div>
            </div>

            <div>
              <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                City *
              </label>
              <div className="relative">
                <input
                  id="city"
                  name="city"
                  type="text"
                  required
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="Your city"
                  className="w-full rounded-lg border border-gray-200 p-2.5 focus:ring-1 focus:ring-[#c8a45d] focus:border-[#c8a45d]"
                />
              </div>
            </div>

            {/* Quantity selector - only show for single product, not cart */}
            {!cartItems && (
            <div>
              <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">
                Quantity
              </label>
                <div className="flex items-center">
                  <button 
                    type="button"
                    onClick={decreaseQuantity}
                    className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded-l-lg border border-gray-300 transition-colors"
                  >
                    -
                  </button>
              <input
                type="number"
                id="quantity"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                min="1"
                required
                    className="w-16 py-2 px-3 text-center border-t border-b border-gray-300 focus:outline-none focus:ring-0"
                  />
                  <button 
                    type="button"
                    onClick={increaseQuantity}
                    className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded-r-lg border border-gray-300 transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>
            )}
            
            {/* Order summary */}
            <div className="mt-6 bg-gray-50 p-4 rounded-lg">
              {!cartItems ? (
                <>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600">Price:</span>
                    <span>{product.price.toFixed(2)} DH</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600">Quantity:</span>
                    <span>{formData.quantity}</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600">Subtotal:</span>
                    <span>{singleProductTotal.toFixed(2)} DH</span>
                  </div>
                </>
              ) : (
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Subtotal:</span>
                  <span>{cartTotal.toFixed(2)} DH</span>
                </div>
              )}
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Shipping:</span>
                {qualifiesForFreeShipping ? (
                  <span className="text-green-600 font-medium">Free</span>
                ) : (
                  <span>{shippingFee.toFixed(2)} DH</span>
                )}
              </div>
              {!qualifiesForFreeShipping && (
                <div className="text-xs text-gray-500 mb-2">
                  Add {(shippingSettings.freeShippingThreshold - subtotal).toFixed(2)} DH more to qualify for free shipping
                </div>
              )}
              <div className="flex justify-between font-medium text-lg border-t border-gray-200 pt-2 mt-2">
                <span>Total:</span>
                <span className="text-[#c8a45d]">{totalPrice.toFixed(2)} DH</span>
              </div>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#c8a45d] text-white py-3 px-6 rounded-lg hover:bg-[#b08d48] transition-colors flex items-center justify-center gap-2 font-medium disabled:opacity-70"
              >
                <FaShoppingBag />
                {isSubmitting ? 'Processing...' : 'Place Order'}
              </button>
              <p className="text-center text-gray-500 text-sm mt-3">
                By placing your order, you agree to our <Link href="/terms" className="text-[#c8a45d] hover:underline">Terms and Conditions</Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default OrderModal; 