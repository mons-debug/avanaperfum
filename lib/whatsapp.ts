// WhatsApp utility functions for AVANA PARFUM

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
export const generateBulkOrderWhatsAppURL = (products: WhatsAppProduct[]): string => {
  if (products.length === 0) {
    return `https://wa.me/${WHATSAPP_NUMBER.replace('+', '')}?text=${encodeURIComponent('Bonjour, je souhaite passer une commande.')}`;
  }
  
  const productList = products.map(product => {
    const productName = typeof product.name === 'object' 
      ? (product.name as any).fr || (product.name as any).en || 'Produit'
      : product.name;
    return `- ${productName}`;
  }).join('\n');
  
  const message = `Bonjour, je souhaite commander les parfums suivants :\n${productList}\nMerci de me confirmer la disponibilité.`;
  
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
    
    // Dispatch custom event to notify components
    window.dispatchEvent(new CustomEvent('whatsappCartUpdated', { detail: cart }));
  } catch (error) {
    console.error('Error adding to WhatsApp cart:', error);
  }
};

// Remove item from WhatsApp cart
export const removeFromWhatsAppCart = (productId: string): void => {
  if (typeof window === 'undefined') return;
  
  try {
    const cart = getWhatsAppCart();
    const updatedCart = cart.filter(item => item._id !== productId);
    
    localStorage.setItem(WHATSAPP_CART_KEY, JSON.stringify(updatedCart));
    
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