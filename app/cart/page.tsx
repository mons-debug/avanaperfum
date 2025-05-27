'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FaArrowLeft, FaTrash, FaMinus, FaPlus, FaWhatsapp, FaShoppingCart, FaShoppingBag } from 'react-icons/fa';
import { getCartTotal, getOriginalCartTotal, getCartBulkPricing, updateCartItemQuantity, removeFromCart, clearCart, calculateShipping, getTotalWithShipping } from '@/lib/cart';
import { getPromotionalMessage } from '@/lib/pricing';
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

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartProduct[]>([]);
  const [cartTotal, setCartTotal] = useState(0);
  const [originalTotal, setOriginalTotal] = useState(0);
  const [bulkPricing, setBulkPricing] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<CartProduct | null>(null);
  const [shippingCity, setShippingCity] = useState<string>('');
  
  // Calculate shipping based on selected city
  const shippingFee = calculateShipping(shippingCity);
  
  // Calculate final price including shipping
  const totalWithShipping = getTotalWithShipping(shippingCity);
  
  // Get promotional message
  const totalQuantity = cartItems.reduce((total, item) => total + item.quantity, 0);
  const promoMessage = getPromotionalMessage(totalQuantity);
  
  // List of major Moroccan cities
  const moroccanCities = [
    'Casablanca', 'Rabat', 'Marrakech', 'Fès', 'Tanger', 'Agadir', 'Meknès', 
    'Oujda', 'Kénitra', 'Tétouan', 'Safi', 'Mohammedia', 'El Jadida', 'Béni Mellal', 
    'Nador', 'Taza', 'Khémisset', 'Settat', 'Berrechid', 'Khénifra', 'Larache', 
    'Khouribga', 'Ouarzazate', 'Essaouira', 'Chefchaouen', 'Ifrane', 'Errachidia', 
    'Dakhla', 'Laâyoune', 'Tinghir', 'Al Hoceima', 'Guelmim', 'Tiznit', 'Taroudant'
  ];
  
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Initialize cart from window
      window.cartItems = window.cartItems || [];
      setCartItems([...window.cartItems]);
      setCartTotal(getCartTotal());
      setOriginalTotal(getOriginalCartTotal());
      setBulkPricing(getCartBulkPricing());
      
      // Listen for cart updates
      const handleCartChange = (items: CartProduct[]) => {
        setCartItems([...items]);
        setCartTotal(getCartTotal());
        setOriginalTotal(getOriginalCartTotal());
        setBulkPricing(getCartBulkPricing());
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

  // Generate WhatsApp message with product details
  const generateWhatsAppMessage = () => {
    if (cartItems.length === 0) return '';
    
    const productsList = cartItems.map(item => 
      `'${item.name}' — ${item.quantity} pièce${item.quantity > 1 ? 's' : ''} — ${item.price} DH`
    ).join('\n');
    
    const cityText = shippingCity ? ` à ${shippingCity}` : '';
    const shippingText = shippingFee === 0 ? ' (livraison gratuite)' : ` (+ ${shippingFee} DH livraison)`;
    
    return `Bonjour, je souhaite commander :\n\n${productsList}\n\nTotal: ${totalWithShipping} DH${shippingText}\n\nMerci de confirmer la livraison${cityText}.`;
  };
  
  return (
    <div className="min-h-screen pt-[120px] pb-16">
      <div className="container mx-auto px-4">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-3xl font-playfair text-gray-800">Votre Panier</h1>
          <Link href="/shop" className="flex items-center text-gray-600 hover:text-[#c8a45d] transition-colors">
            <FaArrowLeft className="mr-2" />
            <span>Continuer les achats</span>
          </Link>
        </div>
        
        {cartItems.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <FaShoppingCart className="text-gray-400 text-3xl" />
            </div>
            <h2 className="text-2xl font-playfair text-gray-800 mb-3">Votre panier est vide</h2>
            <p className="text-gray-600 mb-6">Ajoutez des produits à votre panier pour commencer.</p>
            <Link href="/shop" className="inline-block bg-[#c8a45d] hover:bg-[#b08d48] text-white px-6 py-3 rounded-lg transition-colors">
              Parcourir les produits
            </Link>
          </div>
        ) : (
          <>
            {/* Promotional Banner */}
            {promoMessage && (
              <div className="mb-6">
                <div className="bg-gradient-to-r from-[#c8a45d] to-[#d4b366] text-white p-4 rounded-xl shadow-lg">
                  <div className="flex items-center justify-center">
                    <span className="text-lg font-medium text-center">{promoMessage}</span>
                  </div>
                </div>
              </div>
            )}
            
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Cart Items */}
              <div className="lg:w-2/3">
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                  <div className="flex items-center justify-between p-6 border-b border-gray-100">
                    <h2 className="text-xl font-medium text-gray-800">Panier d'achat ({cartItems.length} article{cartItems.length > 1 ? 's' : ''})</h2>
                    <button 
                      onClick={handleClearCart}
                      className="text-red-500 hover:text-red-600 transition-colors flex items-center"
                    >
                      <FaTrash className="mr-2" />
                      Vider le panier
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
                              Inspiré de {item.inspiredBy}
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
                          <div className="text-[#c8a45d] font-semibold">{(item.price * item.quantity)} DH</div>
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
                    <h2 className="text-xl font-medium text-gray-800">Récapitulatif de commande</h2>
                  </div>
                  
                  <div className="p-6">
                    {/* City Selection for Shipping */}
                    <div className="mb-4">
                      <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-2">
                        Ville de livraison
                      </label>
                      <select
                        id="city"
                        value={shippingCity}
                        onChange={(e) => setShippingCity(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#c8a45d]/20 focus:border-[#c8a45d]"
                      >
                        <option value="">Sélectionnez une ville</option>
                        {moroccanCities.map((city) => (
                          <option key={city} value={city}>
                            {city}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="flex justify-between mb-4">
                      <span className="text-gray-600">Sous-total ({totalQuantity} article{totalQuantity > 1 ? 's' : ''})</span>
                      <span className="font-medium">{originalTotal} DH</span>
                    </div>
                    
                    {bulkPricing && bulkPricing.savings > 0 && (
                      <div className="flex justify-between mb-4">
                        <span className="text-green-600">🎉 Remise quantité</span>
                        <span className="text-green-600 font-medium">-{bulkPricing.savings} DH</span>
                      </div>
                    )}
                    
                    {bulkPricing && bulkPricing.savings > 0 && (
                      <div className="flex justify-between mb-4 pb-4 border-b border-gray-100">
                        <span className="text-gray-800 font-medium">Sous-total avec remise</span>
                        <span className="text-[#c8a45d] font-medium">{cartTotal} DH</span>
                      </div>
                    )}
                    
                    <div className="flex justify-between mb-4">
                      <span className="text-gray-600">Livraison</span>
                      {shippingFee === 0 ? (
                        <span className="text-green-600 font-medium">Gratuite</span>
                      ) : (
                        <span className="font-medium">{shippingFee} DH</span>
                      )}
                    </div>
                    
                    {shippingCity && shippingFee === 0 && (
                      <div className="mb-4 bg-green-50 p-3 rounded-lg text-xs text-green-700">
                        🎉 Livraison gratuite pour Tanger !
                      </div>
                    )}
                    
                    {shippingCity && shippingFee > 0 && (
                      <div className="mb-4 bg-blue-50 p-3 rounded-lg text-xs text-blue-700">
                        Livraison à {shippingCity}: {shippingFee} DH
                      </div>
                    )}
                    
                    <div className="border-t border-gray-100 pt-4 mb-6">
                      <div className="flex justify-between">
                        <span className="text-gray-800 font-medium">Total</span>
                        <span className="text-[#c8a45d] font-bold text-xl">{totalWithShipping} DH</span>
                      </div>
                    </div>
                    
                    <button
                      onClick={() => cartItems.length > 0 && openOrderModal()}
                      className="w-full bg-emerald-600 text-white py-3 rounded-lg hover:bg-emerald-700 transition-colors font-medium flex items-center justify-center mb-4"
                    >
                      <FaShoppingBag className="mr-2" size={18} />
                      Achetez maintenant
                    </button>
                    
                    <Link
                      href={`https://wa.me/+212674428593?text=${encodeURIComponent(generateWhatsAppMessage())}`}
                      target="_blank"
                      className="w-full flex items-center justify-center bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 transition-colors font-medium"
                    >
                      <FaWhatsapp className="mr-2" size={20} />
                      Commander via WhatsApp
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
      
      {isModalOpen && (
        <OrderModal
          product={selectedProduct || cartItems[0]}
          cartItems={cartItems}
          onClose={() => setIsModalOpen(false)}
          preSelectedCity={shippingCity}
        />
      )}
    </div>
  );
} 