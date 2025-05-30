// WhatsApp utility functions for AVANA PARFUM

import { calculateBulkPricing } from './pricing';

// The primary WhatsApp number for orders
export const WHATSAPP_NUMBER = '+212674428593';

// Function to format phone number correctly for WhatsApp
export const formatWhatsAppNumber = (number: string): string => {
  // Remove any spaces, dashes, or other formatting
  const cleanNumber = number.replace(/[\s\-\(\)]/g, '');
  
  // Ensure it starts with +212 for Morocco
  if (cleanNumber.startsWith('0')) {
    return `+212${cleanNumber.substring(1)}`;
  } else if (cleanNumber.startsWith('212')) {
    return `+${cleanNumber}`;
  } else if (cleanNumber.startsWith('+212')) {
    return cleanNumber;
  } else {
    return `+212${cleanNumber}`;
  }
};

// Product interface for WhatsApp messages
interface WhatsAppProduct {
  _id: string;
  name: string;
  price?: number;
  volume?: string;
  inspiredBy?: string;
}

// Generate WhatsApp URL for a single product
export const generateSingleProductWhatsAppURL = (product: WhatsAppProduct): string => {
  const productName = typeof product.name === 'object' 
    ? (product.name as any).fr || (product.name as any).en || 'Produit'
    : product.name;
    
  const message = `Bonjour, je souhaite commander ce parfum : ${productName}. Merci de me confirmer la disponibilité.`;
  
  return `https://wa.me/${WHATSAPP_NUMBER.replace('+', '')}?text=${encodeURIComponent(message)}`;
};

// Generate WhatsApp URL for multiple products
export const generateBulkOrderWhatsAppURL = (products: WhatsAppCartItem[]): string => {
  if (products.length === 0) {
    return `https://wa.me/${WHATSAPP_NUMBER.replace('+', '')}?text=${encodeURIComponent('Bonjour, je souhaite passer une commande.')}`;
  }
  
  const productList = products.map(product => {
    const productName = typeof product.name === 'object' 
      ? (product.name as any).fr || (product.name as any).en || 'Produit'
      : product.name;
    return `'${productName}' — ${product.quantity || 1} pièce${(product.quantity || 1) > 1 ? 's' : ''}`;
  }).join('\n');
  
  // Calculate total quantity for bulk pricing
  const totalQuantity = products.reduce((total, item) => total + (item.quantity || 1), 0);
  const bulkPricing = calculateBulkPricing(totalQuantity);
  
  let priceText = '';
  if (bulkPricing.savings > 0) {
    priceText = `\n\nPrix normal: ${bulkPricing.originalTotal} DH\nRemise quantité: -${bulkPricing.savings} DH\nTotal avec remise: ${bulkPricing.bulkTotal} DH`;
  } else {
    priceText = `\n\nTotal: ${bulkPricing.bulkTotal} DH`;
  }
  
  const message = `Bonjour, je souhaite commander :\n\n${productList}${priceText}\n\nMerci de me confirmer la disponibilité et les modalités de livraison.`;
  
  return `https://wa.me/${WHATSAPP_NUMBER.replace('+', '')}?text=${encodeURIComponent(message)}`;
};

// Generate detailed WhatsApp URL for a single product with full info
export const generateDetailedProductWhatsAppURL = (product: WhatsAppProduct): string => {
  const productName = typeof product.name === 'object' 
    ? (product.name as any).fr || (product.name as any).en || 'Produit'
    : product.name;
    
  const inspiredBy = product.inspiredBy 
    ? (typeof product.inspiredBy === 'object' 
        ? (product.inspiredBy as any).fr || (product.inspiredBy as any).en 
        : product.inspiredBy)
    : null;
    
  let message = `Bonjour, je souhaite commander ce parfum :\n\n*${productName}*`;
  
  if (inspiredBy) {
    message += `\n(Inspiré de ${inspiredBy})`;
  }
  
  if (product.price) {
    message += `\nPrix: ${product.price} DH`;
  }
  
  if (product.volume) {
    const volume = typeof product.volume === 'object' 
      ? (product.volume as any).fr || (product.volume as any).en 
      : product.volume;
    message += `\nVolume: ${volume}`;
  }
  
  message += '\n\nMerci de me confirmer la disponibilité et les modalités de livraison.';
  
  return `https://wa.me/${WHATSAPP_NUMBER.replace('+', '')}?text=${encodeURIComponent(message)}`;
};

// WhatsApp cart functionality
export interface WhatsAppCartItem extends WhatsAppProduct {
  quantity?: number;
}

const WHATSAPP_CART_KEY = 'avana_whatsapp_cart';

// Import sync function from cart (we'll import this dynamically to avoid circular imports)
let syncFromWhatsAppCart: (() => void) | null = null;

// Initialize sync function when available
if (typeof window !== 'undefined') {
  // Dynamically import sync function to avoid circular dependency
  import('./cart').then(cartModule => {
    syncFromWhatsAppCart = cartModule.syncFromWhatsAppCart;
  }).catch(console.error);
}

// Get items from WhatsApp cart
export const getWhatsAppCart = (): WhatsAppCartItem[] => {
  if (typeof window === 'undefined') return [];
  
  try {
    const cart = localStorage.getItem(WHATSAPP_CART_KEY);
    return cart ? JSON.parse(cart) : [];
  } catch (error) {
    console.error('Error reading WhatsApp cart:', error);
    return [];
  }
};

// Add item to WhatsApp cart
export const addToWhatsAppCart = (product: WhatsAppProduct): void => {
  if (typeof window === 'undefined') return;
  
  try {
    const cart = getWhatsAppCart();
    const existingIndex = cart.findIndex(item => item._id === product._id);
    
    if (existingIndex >= 0) {
      // If item exists, increase quantity
      cart[existingIndex].quantity = (cart[existingIndex].quantity || 1) + 1;
    } else {
      // Add new item with quantity 1
      cart.push({ ...product, quantity: 1 });
    }
    
    localStorage.setItem(WHATSAPP_CART_KEY, JSON.stringify(cart));
    
    // Sync to regular cart
    if (syncFromWhatsAppCart) {
      syncFromWhatsAppCart();
    }
    
    // Dispatch custom event to notify components
    window.dispatchEvent(new CustomEvent('whatsappCartUpdated', { detail: cart }));
  } catch (error) {
    console.error('Error adding to WhatsApp cart:', error);
  }
};

// Update WhatsApp cart item quantity
export const updateWhatsAppCartQuantity = (productId: string, quantity: number): void => {
  if (typeof window === 'undefined') return;
  
  try {
    const cart = getWhatsAppCart();
    const existingIndex = cart.findIndex(item => item._id === productId);
    
    if (existingIndex >= 0) {
      if (quantity <= 0) {
        // Remove item if quantity is 0 or less
        cart.splice(existingIndex, 1);
      } else {
        // Update quantity
        cart[existingIndex].quantity = quantity;
      }
      
      localStorage.setItem(WHATSAPP_CART_KEY, JSON.stringify(cart));
      
      // Sync to regular cart
      if (syncFromWhatsAppCart) {
        syncFromWhatsAppCart();
      }
      
      // Dispatch custom event to notify components
      window.dispatchEvent(new CustomEvent('whatsappCartUpdated', { detail: cart }));
    }
  } catch (error) {
    console.error('Error updating WhatsApp cart quantity:', error);
  }
};

// Remove item from WhatsApp cart
export const removeFromWhatsAppCart = (productId: string): void => {
  if (typeof window === 'undefined') return;
  
  try {
    const cart = getWhatsAppCart();
    const updatedCart = cart.filter(item => item._id !== productId);
    
    localStorage.setItem(WHATSAPP_CART_KEY, JSON.stringify(updatedCart));
    
    // Sync to regular cart
    if (syncFromWhatsAppCart) {
      syncFromWhatsAppCart();
    }
    
    // Dispatch custom event to notify components
    window.dispatchEvent(new CustomEvent('whatsappCartUpdated', { detail: updatedCart }));
  } catch (error) {
    console.error('Error removing from WhatsApp cart:', error);
  }
};

// Clear WhatsApp cart
export const clearWhatsAppCart = (): void => {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.removeItem(WHATSAPP_CART_KEY);
    
    // Sync to regular cart
    if (syncFromWhatsAppCart) {
      syncFromWhatsAppCart();
    }
    
    // Dispatch custom event to notify components
    window.dispatchEvent(new CustomEvent('whatsappCartUpdated', { detail: [] }));
  } catch (error) {
    console.error('Error clearing WhatsApp cart:', error);
  }
};

// Check if item is in WhatsApp cart
export const isInWhatsAppCart = (productId: string): boolean => {
  const cart = getWhatsAppCart();
  return cart.some(item => item._id === productId);
};

// Get WhatsApp cart count
export const getWhatsAppCartCount = (): number => {
  const cart = getWhatsAppCart();
  return cart.reduce((total, item) => total + (item.quantity || 1), 0);
}; 