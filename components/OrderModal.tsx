"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FaTimes, FaShoppingBag, FaUserAlt, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';
import { getImageSrc, imageConfig } from '@/lib/utils/image';
import { calculateBulkPricing, getPromotionalMessage } from '@/lib/pricing';
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
  preSelectedCity?: string;
}

const OrderModal: React.FC<OrderModalProps> = ({ product, onClose, cartItems, preSelectedCity }) => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    city: preSelectedCity || '',
    // Keep these fields for backend compatibility but don't show them in UI
    email: '',
    address: '',
    quantity: product.quantity || 1
  });
  
  // List of major Moroccan cities
  const moroccanCities = [
    'Casablanca', 'Rabat', 'Marrakech', 'Fès', 'Tanger', 'Agadir', 'Meknès', 
    'Oujda', 'Kénitra', 'Tétouan', 'Safi', 'Mohammedia', 'El Jadida', 'Béni Mellal', 
    'Nador', 'Taza', 'Khémisset', 'Settat', 'Berrechid', 'Khénifra', 'Larache', 
    'Khouribga', 'Ouarzazate', 'Essaouira', 'Chefchaouen', 'Ifrane', 'Errachidia', 
    'Dakhla', 'Laâyoune', 'Tinghir', 'Al Hoceima', 'Guelmim', 'Tiznit', 'Taroudant'
  ];
  
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
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
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
            // Auto-fill address with city for backend compatibility
            address: formData.address || `Ville de ${formData.city}`,
            items: cartItems.map(item => ({ id: item._id, quantity: item.quantity })),
            originalSubtotal: originalTotal,
            bulkDiscount: bulkPricing.savings,
            subtotal: subtotal,
            shipping: shippingFee,
            total: totalPrice,
            totalQuantity: totalQuantity,
            promoMessage: promoMessage
          }
        : { 
            ...formData, 
            // Auto-fill address with city for backend compatibility
            address: formData.address || `Ville de ${formData.city}`,
            product: product._id,
            originalSubtotal: originalTotal,
            bulkDiscount: bulkPricing.savings,
            subtotal: subtotal,
            shipping: shippingFee,
            total: totalPrice,
            totalQuantity: totalQuantity,
            promoMessage: promoMessage
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
        throw new Error(data.error || 'Échec de l\'envoi de la commande');
      }
      
      // Success - redirect to thank you page
      router.push('/thank-you');
    } catch (err: any) {
      setError(err.message || 'Une erreur s\'est produite lors du traitement de votre commande');
      setIsSubmitting(false);
    }
  };
  
  // Calculate total price for a single product
  const singleProductTotal = product.price * (product.quantity || 1);
  
  // Calculate total quantity and use bulk pricing for cart items
  const totalQuantity = cartItems 
    ? cartItems.reduce((total, item) => total + item.quantity, 0)
    : (product.quantity || 1);
  
  // Use bulk pricing for all orders
  const bulkPricing = calculateBulkPricing(totalQuantity);
  const originalTotal = totalQuantity * 99; // Original price per item
  const subtotal = bulkPricing.bulkTotal;
  
  // Get promotional message
  const promoMessage = getPromotionalMessage(totalQuantity);
  
  // Calculate total price for cart items if present
  const cartTotal = cartItems 
    ? cartItems.reduce((total, item) => total + (item.price * item.quantity), 0)
    : 0;
    
  // Determine if order qualifies for free shipping
  const qualifiesForFreeShipping = subtotal >= shippingSettings.freeShippingThreshold;
  
  // Special case: Free shipping for Tangier
  const isTangierFreeShipping = (() => {
    if (!formData.city) return false;
    const tangerVariations = ['tanger', 'tangier', 'tanja', 'طنجة'];
    const cityLower = formData.city.toLowerCase().trim();
    return tangerVariations.some(variation => 
      cityLower.includes(variation) || variation.includes(cityLower)
    );
  })();
  
  // Calculate shipping fee
  const shippingFee = (() => {
    // If no city selected, show free shipping by default
    if (!formData.city) return 0;
    
    // If city is selected, apply normal shipping logic
    if (qualifiesForFreeShipping || isTangierFreeShipping) return 0;
    
    return shippingSettings.shippingFee;
  })();
  
  // Calculate final price including shipping
  const totalPrice = subtotal + shippingFee;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-4">
            <h2 className="text-2xl font-playfair font-semibold text-gray-800">Finaliser Votre Commande</h2>
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
              <h3 className="font-medium text-gray-800">Articles dans votre Panier</h3>
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
                      <span className="text-sm font-medium">Qté: {item.quantity}</span>
                    </div>
                    {item.inspiredBy && (
                      <p className="text-gray-500 text-xs">Inspiré de {item.inspiredBy}</p>
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
                  <p className="text-gray-500 text-sm">Inspiré de {product.inspiredBy}</p>
                )}
                {product.volume && (
                  <p className="text-gray-500 text-sm">Volume : {product.volume}</p>
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
                Nom Complet *
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
                  placeholder="Votre nom complet"
                />
              </div>
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                Numéro de Téléphone *
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
                  placeholder="Votre numéro de téléphone"
                />
              </div>
            </div>

            <div>
              <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                Ville *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaMapMarkerAlt className="h-4 w-4 text-gray-400" />
                </div>
                <select
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  required
                  className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent text-sm appearance-none"
                >
                  <option value="">Sélectionnez une ville</option>
                  {moroccanCities.map(city => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
              </div>
              
              {/* Show free shipping indicator for Tanger */}
              {isTangierFreeShipping && (
                <div className="mt-2 bg-green-50 p-2 rounded-lg text-xs text-green-700 flex items-center">
                  <span className="mr-1">🎉</span>
                  <span>Livraison gratuite pour Tanger !</span>
                </div>
              )}
            </div>
            
            {/* Order summary */}
            <div className="mt-6">
              {/* Promotional Message */}
              {promoMessage && (
                <div className="mb-4">
                  <div className="bg-gradient-to-r from-[#c8a45d] to-[#d4b366] text-white p-3 rounded-lg text-center">
                    <span className="text-sm font-medium">{promoMessage}</span>
                  </div>
                </div>
              )}
              
              <h3 className="font-medium text-gray-800 mb-4">Résumé de la Commande</h3>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Sous-total ({totalQuantity} article{totalQuantity > 1 ? 's' : ''})</span>
                  <span>{originalTotal.toFixed(2)} {shippingSettings.currency}</span>
                </div>
                
                {bulkPricing.savings > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-green-600">🎉 Remise quantité</span>
                    <span className="text-green-600 font-medium">-{bulkPricing.savings.toFixed(2)} {shippingSettings.currency}</span>
                  </div>
                )}
                
                {bulkPricing.savings > 0 && (
                  <div className="flex justify-between text-sm">
                    <span>Sous-total avec remise</span>
                    <span className="font-medium">{subtotal.toFixed(2)} {shippingSettings.currency}</span>
                  </div>
                )}
                
                <div className="flex justify-between text-sm">
                  <span>Frais de livraison</span>
                  <span>
                    {!formData.city ? (
                      <span className="text-green-600 font-medium">
                        Gratuit
                      </span>
                    ) : isTangierFreeShipping ? (
                      <span className="text-green-600 font-medium">
                        Gratuit à Tanger
                      </span>
                    ) : qualifiesForFreeShipping ? (
                      <span className="text-green-600 font-medium">
                        Livraison gratuite
                      </span>
                    ) : (
                      `${shippingFee.toFixed(2)} ${shippingSettings.currency}`
                    )}
                  </span>
                </div>
                <div className="flex justify-between font-semibold text-base pt-2 border-t">
                  <span>Total</span>
                  <span className="text-[#c8a45d]">{totalPrice.toFixed(2)} {shippingSettings.currency}</span>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 px-4 bg-[#c8a45d] text-white rounded-lg shadow-md hover:bg-[#b18d4a] focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-opacity-50 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex justify-center items-center mt-4"
            >
              {isSubmitting ? 'Traitement en cours...' : 'Passer la Commande'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default OrderModal;
