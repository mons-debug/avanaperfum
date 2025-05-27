'use client';

import React, { useState, useEffect } from 'react';
import { FaWhatsapp, FaShoppingCart, FaTimes, FaTrash } from 'react-icons/fa';
import { 
  getWhatsAppCart, 
  removeFromWhatsAppCart, 
  clearWhatsAppCart, 
  getWhatsAppCartCount, 
  generateBulkOrderWhatsAppURL,
  type WhatsAppCartItem 
} from '@/lib/whatsapp';
import { calculateBulkPricing, getPromotionalMessage } from '@/lib/pricing';
import { useTranslation } from './i18n/TranslationProvider';

const FloatingWhatsAppCart: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [cartItems, setCartItems] = useState<WhatsAppCartItem[]>([]);
  const [cartCount, setCartCount] = useState(0);
  const { t } = useTranslation();

  // Update cart state when cart changes
  useEffect(() => {
    const updateCartState = () => {
      const items = getWhatsAppCart();
      setCartItems(items);
      setCartCount(getWhatsAppCartCount());
    };

    // Initial load
    updateCartState();

    // Listen for cart updates
    const handleCartUpdate = (event: CustomEvent) => {
      updateCartState();
    };

    window.addEventListener('whatsappCartUpdated', handleCartUpdate as EventListener);

    return () => {
      window.removeEventListener('whatsappCartUpdated', handleCartUpdate as EventListener);
    };
  }, []);

  const handleRemoveItem = (productId: string) => {
    removeFromWhatsAppCart(productId);
  };

  const handleClearCart = () => {
    clearWhatsAppCart();
    setIsOpen(false);
  };

  const handleWhatsAppOrder = () => {
    if (cartItems.length === 0) return;
    
    const whatsappUrl = generateBulkOrderWhatsAppURL(cartItems);
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
    
    // Optionally clear cart after ordering
    // clearWhatsAppCart();
    // setIsOpen(false);
  };

  // Don't render if no items
  if (cartCount === 0) {
    return null;
  }

  return (
    <>
      {/* Floating Cart Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-20 bg-green-500 text-white p-3 rounded-full shadow-lg hover:bg-green-600 transition-all duration-300 z-50 flex items-center justify-center group"
        aria-label="WhatsApp Cart"
      >
        <FaShoppingCart className="text-xl" />
        {cartCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
            {cartCount > 99 ? '99+' : cartCount}
          </span>
        )}
        <span className="absolute right-full mr-3 bg-gray-800 text-white text-sm px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
          Panier WhatsApp ({cartCount})
        </span>
      </button>

      {/* Cart Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end justify-center p-4">
          <div className="bg-white rounded-t-xl w-full max-w-md max-h-[80vh] flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <div className="flex items-center gap-2">
                <FaWhatsapp className="text-green-500 text-xl" />
                <h3 className="text-lg font-semibold">Commande WhatsApp</h3>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                aria-label="Fermer"
              >
                <FaTimes />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-4">
              {cartItems.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <FaShoppingCart className="text-4xl mx-auto mb-4 opacity-50" />
                  <p>Aucun produit sélectionné</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {cartItems.map((item) => {
                    const productName = typeof item.name === 'object' 
                      ? (item.name as any).fr || (item.name as any).en || 'Produit'
                      : item.name;
                    
                    return (
                      <div
                        key={item._id}
                        className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                      >
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-sm line-clamp-1">
                            {productName}
                          </h4>
                          {item.quantity && item.quantity > 1 && (
                            <p className="text-gray-500 text-xs">
                              Quantité: {item.quantity}
                            </p>
                          )}
                        </div>
                        <button
                          onClick={() => handleRemoveItem(item._id)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors"
                          aria-label="Supprimer"
                        >
                          <FaTrash className="text-sm" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Footer */}
            {cartItems.length > 0 && (
              <div className="p-4 border-t border-gray-200 space-y-3">
                {/* Pricing Breakdown */}
                {(() => {
                  const totalQuantity = cartItems.reduce((total, item) => total + (item.quantity || 1), 0);
                  const bulkPricing = calculateBulkPricing(totalQuantity);
                  const promoMessage = getPromotionalMessage(totalQuantity);
                  
                  return (
                    <>
                      {/* Promotional Message */}
                      {promoMessage && (
                        <div className="bg-gradient-to-r from-[#c8a45d] to-[#d4b366] text-white p-3 rounded-lg text-center">
                          <span className="text-sm font-medium">{promoMessage}</span>
                        </div>
                      )}
                      
                      {/* Pricing Details */}
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Prix normal ({totalQuantity} article{totalQuantity > 1 ? 's' : ''})</span>
                          <span className="text-gray-600">{bulkPricing.originalTotal} DH</span>
                        </div>
                        
                        {bulkPricing.savings > 0 && (
                          <div className="flex justify-between text-sm">
                            <span className="text-green-600">🎉 Remise quantité</span>
                            <span className="text-green-600 font-medium">-{bulkPricing.savings} DH</span>
                          </div>
                        )}
                        
                        <div className="flex justify-between font-medium border-t pt-2">
                          <span className="text-gray-800">Total avec remise</span>
                          <span className="text-[#c8a45d] font-bold">{bulkPricing.bulkTotal} DH</span>
                        </div>
                      </div>
                    </>
                  );
                })()}
                
                <div className="flex justify-between items-center pt-2">
                  <span className="text-sm text-gray-600">
                    {cartItems.length} produit{cartItems.length > 1 ? 's' : ''} sélectionné{cartItems.length > 1 ? 's' : ''}
                  </span>
                  <button
                    onClick={handleClearCart}
                    className="text-sm text-red-500 hover:text-red-600 transition-colors"
                  >
                    Vider le panier
                  </button>
                </div>
                
                <button
                  onClick={handleWhatsAppOrder}
                  className="w-full bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 transition-colors font-medium flex items-center justify-center gap-2"
                >
                  <FaWhatsapp />
                  Commander sur WhatsApp
                </button>
                
                <p className="text-xs text-gray-500 text-center">
                  Vous serez redirigé vers WhatsApp pour finaliser votre commande
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default FloatingWhatsAppCart; 