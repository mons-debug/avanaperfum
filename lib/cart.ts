// Simple cart utility for managing product cart functionality

// Define translation interface
export interface ITranslation {
  en: string;
  fr: string;
  [key: string]: string;
}

// Define the product type
export type CartProduct = {
  _id: string;
  name: string;
  price: number;
  images: string[];
  inspiredBy?: string;
  volume?: string;
  quantity: number;
};

// Define the product type with translations
export type ProductWithTranslation = {
  _id: string;
  name: string | ITranslation;
  price: number;
  images: string[];
  inspiredBy?: string | ITranslation;
  description?: string | ITranslation;
  volume?: string;
  gender?: string;
  category?: string;
};

// Type definitions for window globals
type CartListenerFunction = (cartItems: CartProduct[]) => void;

// Augment the window interface
declare global {
  interface Window {
    cartItems?: CartProduct[];
    cartListeners?: CartListenerFunction[];
    clearCart?: () => void;
  }
}

// Initialize cart items in global scope for client-side
if (typeof window !== 'undefined') {
  // Initialize cart from local storage if available
  const savedCart = localStorage.getItem('avana_cart');
  window.cartItems = savedCart ? JSON.parse(savedCart) : [];
  window.cartListeners = window.cartListeners || [];
}

// Helper function to convert a product with translations to a cart product
const convertToCartProduct = (product: ProductWithTranslation): Omit<CartProduct, 'quantity'> => {
  // Get the current locale or default to English
  const locale = typeof window !== 'undefined' && document.documentElement.lang || 'en';
  
  // Convert name to string if it's a translation object
  const name = typeof product.name === 'object' 
    ? (product.name[locale as keyof typeof product.name] || product.name.en) 
    : product.name;
    
  // Convert inspiredBy to string if it's a translation object
  const inspiredBy = product.inspiredBy && typeof product.inspiredBy === 'object'
    ? (product.inspiredBy[locale as keyof typeof product.inspiredBy] || product.inspiredBy.en)
    : product.inspiredBy;
  
  return {
    _id: product._id,
    name,
    price: product.price,
    images: product.images,
    inspiredBy,
    volume: product.volume
  };
};

// Add a product to the cart
export const addToCart = (product: ProductWithTranslation | Omit<CartProduct, 'quantity'>) => {
  if (typeof window === 'undefined') return;
  
  // Ensure cart items and listeners are initialized
  window.cartItems = window.cartItems || [];
  window.cartListeners = window.cartListeners || [];
  
  // Convert product to cart product if it has translations
  const cartProduct = 'description' in product ? convertToCartProduct(product as ProductWithTranslation) : product;
  
  // Check if product already exists in cart
  const existingProductIndex = window.cartItems.findIndex(
    (item: CartProduct) => item._id === cartProduct._id
  );
  
  if (existingProductIndex >= 0) {
    // Increment quantity
    window.cartItems[existingProductIndex].quantity += 1;
  } else {
    // Add new product with quantity 1
    window.cartItems.push({
      ...cartProduct,
      quantity: 1
    } as CartProduct);
  }
  
  // Save to local storage
  localStorage.setItem('avana_cart', JSON.stringify(window.cartItems));
  
  // Notify all listeners
  window.cartListeners?.forEach((listener) => listener([...(window.cartItems || [])]));
};

// Remove a product from the cart
export const removeFromCart = (productId: string) => {
  if (typeof window === 'undefined') return;
  
  // Ensure cart items and listeners are initialized
  window.cartItems = window.cartItems || [];
  window.cartListeners = window.cartListeners || [];
  
  window.cartItems = window.cartItems.filter((item: CartProduct) => item._id !== productId);
  
  // Save to local storage
  localStorage.setItem('avana_cart', JSON.stringify(window.cartItems));
  
  // Notify all listeners
  window.cartListeners?.forEach((listener) => listener([...(window.cartItems || [])]));
};

// Check if a product is in the cart
export const isInCart = (productId: string): boolean => {
  if (typeof window === 'undefined') return false;
  
  // Ensure cart items are initialized
  window.cartItems = window.cartItems || [];
  
  return window.cartItems.some((item: CartProduct) => item._id === productId);
};

// Get the total number of items in the cart
export const getCartCount = (): number => {
  if (typeof window === 'undefined') return 0;
  
  // Ensure cart items are initialized
  window.cartItems = window.cartItems || [];
  
  return window.cartItems.reduce((total: number, item: CartProduct) => total + item.quantity, 0);
};

// Get the total price of all items in the cart
export const getCartTotal = (): number => {
  if (typeof window === 'undefined') return 0;
  
  // Ensure cart items are initialized
  window.cartItems = window.cartItems || [];
  
  return window.cartItems.reduce(
    (total: number, item: CartProduct) => total + item.price * item.quantity, 
    0
  );
};

// Clear the entire cart
export const clearCart = () => {
  if (typeof window === 'undefined') return;
  
  // Ensure cart items and listeners are initialized
  window.cartItems = window.cartItems || [];
  window.cartListeners = window.cartListeners || [];
  
  window.cartItems = [];
  
  // Save to local storage
  localStorage.setItem('avana_cart', JSON.stringify(window.cartItems));
  
  // Notify all listeners
  window.cartListeners?.forEach((listener) => listener([...(window.cartItems || [])]));
};

// Expose clearCart to window for use in the thank-you page
if (typeof window !== 'undefined') {
  window.clearCart = clearCart;
}

// Update a product's quantity in the cart
export const updateCartItemQuantity = (productId: string, quantity: number) => {
  if (typeof window === 'undefined') return;
  
  // Ensure cart items and listeners are initialized
  window.cartItems = window.cartItems || [];
  window.cartListeners = window.cartListeners || [];
  
  const productIndex = window.cartItems.findIndex(
    (item: CartProduct) => item._id === productId
  );
  
  if (productIndex >= 0) {
    if (quantity <= 0) {
      // Remove if quantity is 0 or less
      window.cartItems.splice(productIndex, 1);
    } else {
      // Update quantity
      window.cartItems[productIndex].quantity = quantity;
    }
    
    // Save to local storage
    localStorage.setItem('avana_cart', JSON.stringify(window.cartItems));
    
    // Notify all listeners
    window.cartListeners?.forEach((listener) => listener([...(window.cartItems || [])]));
  }
}; 