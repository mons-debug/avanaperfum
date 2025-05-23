// Simple cart utility for managing product cart functionality

// Define translation interface
export interface ITranslation {
  en?: string;
  fr?: string;
  [key: string]: string | undefined;
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
  slug?: string;
  price: number;
  images: string[];
  inspiredBy?: string | ITranslation;
  description?: string | ITranslation;
  volume?: string | ITranslation;
  originalPrice?: number;
  gender?: string;
  category?: string;
  tags?: string[];
  ingredients?: string | ITranslation;
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
function convertToCartProduct(product: ProductWithTranslation): Omit<CartProduct, 'quantity'> {
  const getTranslatedValue = (value: string | ITranslation | undefined, defaultVal: string = ''): string => {
    if (!value) return defaultVal;
    if (typeof value === 'string') return value;
    return value.en || value.fr || defaultVal;
  };

  return {
    _id: product._id,
    name: getTranslatedValue(product.name, 'Unnamed Product'),
    price: product.price,
    images: product.images,
    inspiredBy: getTranslatedValue(product.inspiredBy),
    volume: getTranslatedValue(product.volume)
  };
}

// Add a product to the cart
export function addToCart(product: ProductWithTranslation | Omit<CartProduct, 'quantity'>) {
  if (typeof window === 'undefined') return;
  
  // Ensure cart items and listeners are initialized
  window.cartItems = window.cartItems || [];
  window.cartListeners = window.cartListeners || [];
  
  // Convert product to cart product if it has translations
  const cartProduct = 'description' in product 
    ? convertToCartProduct(product as ProductWithTranslation)
    : product as Omit<CartProduct, 'quantity'>;
  
    // Helper function to safely get string value from ITranslation or string
  const getStringValue = (value: string | ITranslation | undefined): string => {
    if (!value) return '';
    if (typeof value === 'string') return value;
    return value.en || value.fr || '';
  };

  // Ensure the product has all required fields with proper types
  const productToAdd: CartProduct = {
    _id: cartProduct._id,
    name: getStringValue(cartProduct.name) || 'Unnamed Product',
    price: cartProduct.price,
    images: cartProduct.images || [],
    inspiredBy: getStringValue(cartProduct.inspiredBy),
    volume: getStringValue(cartProduct.volume),
    quantity: 1
  };

  // Add the product to the cart or update quantity if it already exists
  const existingProductIndex = window.cartItems.findIndex(item => item._id === productToAdd._id);
  
  if (existingProductIndex >= 0) {
    // Increment quantity
    window.cartItems[existingProductIndex].quantity += 1;
  } else {
    // Add new product with quantity 1
    window.cartItems.push(productToAdd);
  }
  
  // Save to local storage
  localStorage.setItem('avana_cart', JSON.stringify(window.cartItems));
  
  // Notify all listeners
  window.cartListeners?.forEach((listener) => listener([...(window.cartItems || [])]));
};

// Remove a product from the cart
export function removeFromCart(productId: string) {
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
export function isInCart(productId: string): boolean {
  if (typeof window === 'undefined') return false;
  
  // Ensure cart items are initialized
  window.cartItems = window.cartItems || [];
  
  return window.cartItems.some((item: CartProduct) => item._id === productId);
};

// Get the total number of items in the cart
export function getCartCount(): number {
  if (typeof window === 'undefined') return 0;
  
  // Ensure cart items are initialized
  window.cartItems = window.cartItems || [];
  
  return window.cartItems.reduce((total: number, item: CartProduct) => total + item.quantity, 0);
};

// Get the total price of all items in the cart
export function getCartTotal(): number {
  if (typeof window === 'undefined') return 0;
  
  // Ensure cart items are initialized
  window.cartItems = window.cartItems || [];
  
  return window.cartItems.reduce(
    (total: number, item: CartProduct) => total + item.price * item.quantity, 
    0
  );
};

// Clear the entire cart
export function clearCart() {
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
export function updateCartItemQuantity(productId: string, quantity: number) {
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