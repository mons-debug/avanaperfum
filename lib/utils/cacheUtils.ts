// Cache utility functions for the application

// Product cache storage
interface ProductsCache {
  [key: string]: {
    data: any[],
    timestamp: number,
    expiryTime: number
  }
}

// Shared products cache object
let productsCache: ProductsCache = {};

// Cache expiry in milliseconds (1 minute - reduced to ensure fresh data appears quickly)
export const CACHE_EXPIRY = 1 * 60 * 1000;

/**
 * Clear the products cache
 */
export const clearProductsCache = () => {
  console.log('Clearing products cache');
  productsCache = {};
};

/**
 * Get cached products data if available
 */
export const getCachedProducts = (cacheKey: string) => {
  return productsCache[cacheKey];
};

/**
 * Set products in cache
 */
export const setCachedProducts = (cacheKey: string, data: any[]) => {
  productsCache[cacheKey] = {
    data,
    timestamp: Date.now(),
    expiryTime: CACHE_EXPIRY
  };
  console.log(`Cached results for ${cacheKey}`);
};

/**
 * Check if cache is valid (not expired)
 */
export const isCacheValid = (cachedData: ProductsCache[string]) => {
  return cachedData && (Date.now() - cachedData.timestamp) < cachedData.expiryTime;
};
