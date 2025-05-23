"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FaTimes, FaShoppingBag, FaUserAlt, FaEnvelope, FaPhone, FaHashtag } from 'react-icons/fa';
import { getImageSrc, imageConfig } from '@/lib/utils/image';
import Image from 'next/image';
import Link from 'next/link';
import { useTranslation } from '@/components/i18n/TranslationProvider';

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
  const { t } = useTranslation();
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
            <h2 className="text-2xl font-playfair font-semibold text-gray-800">{t('order.completeOrder')}</h2>
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
              <h3 className="font-medium text-gray-800">{t('order.cartItems')}</h3>
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
                      <span className="text-sm font-medium">{t('order.qty')}: {item.quantity}</span>
                    </div>
                    {item.inspiredBy && (
                      <p className="text-gray-500 text-xs">{t('product.inspiredBy')} {item.inspiredBy}</p>
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
                  <p className="text-gray-500 text-sm">{t('product.inspiredBy')} {product.inspiredBy}</p>
                )}
                {product.volume && (
                  <p className="text-gray-500 text-sm">{t('product.volume')}: {product.volume}</p>
                )}
                <p className="text-[#c8a45d] font-medium mt-1">{product.price.toFixed(2)} DH</p>
              </div>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
              {t('order.error')}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                {t('order.fullName')} *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaUserAlt className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent text-sm"
                  placeholder={t('order.namePlaceholder')}
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                {t('order.emailAddress')} {t('order.emailOptional')}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaEnvelope className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent text-sm"
                  placeholder={t('order.emailPlaceholder')}
                />
              </div>
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                {t('order.phoneNumber')} *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaPhone className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent text-sm"
                  placeholder={t('order.phonePlaceholder')}
                />
              </div>
            </div>

            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                {t('order.deliveryAddress')} *
              </label>
              <textarea
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent text-sm"
                placeholder={t('order.addressPlaceholder')}
              />
            </div>

            <div>
              <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                {t('order.city')} *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaHashtag className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  required
                  className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent text-sm"
                  placeholder={t('order.cityPlaceholder')}
                />
              </div>
            </div>

            {/* Quantity input - for single product only */}
            {!cartItems && (
              <div>
                <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">
                  {t('order.quantity')}
                </label>
                <div className="flex items-center">
                  <button 
                    type="button"
                    onClick={decreaseQuantity}
                    className="px-3 py-2 border border-gray-300 rounded-l-lg bg-gray-50 text-gray-500 hover:bg-gray-100"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    id="quantity"
                    name="quantity"
                    value={formData.quantity}
                    readOnly
                    className="w-16 px-3 py-2 border-t border-b border-gray-300 text-center focus:outline-none text-sm"
                  />
                  <button 
                    type="button"
                    onClick={increaseQuantity}
                    className="px-3 py-2 border border-gray-300 rounded-r-lg bg-gray-50 text-gray-500 hover:bg-gray-100"
                  >
                    +
                  </button>
                </div>
              </div>
            )}
            
            {/* Order summary */}
            <div className="mt-6">
              <h3 className="font-medium text-gray-800 mb-4">{t('order.orderSummary')}</h3>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>{t('order.subtotal')}</span>
                  <span>{subtotal.toFixed(2)} {shippingSettings.currency}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>{t('order.shipping')}</span>
                  <span>
                    {qualifiesForFreeShipping 
                      ? t('order.freeShipping') 
                      : `${shippingFee.toFixed(2)} ${shippingSettings.currency}`}
                  </span>
                </div>
                <div className="flex justify-between font-semibold text-base pt-2 border-t">
                  <span>{t('order.total')}</span>
                  <span className="text-[#c8a45d]">{totalPrice.toFixed(2)} {shippingSettings.currency}</span>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 px-4 bg-[#c8a45d] text-white rounded-lg shadow-md hover:bg-[#b18d4a] focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-opacity-50 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex justify-center items-center mt-4"
            >
              {isSubmitting ? t('order.processingOrder') : t('order.placeOrder')}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default OrderModal;
