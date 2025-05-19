/**
 * Generate a URL-friendly slug from a string
 * @param text The text to convert to a slug
 * @returns The slugified text
 */
export function generateSlug(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')        // Replace spaces with -
    .replace(/[^\w\-]+/g, '')    // Remove all non-word chars
    .replace(/\-\-+/g, '-')      // Replace multiple - with single -
    .replace(/^-+/, '')          // Trim - from start of text
    .replace(/-+$/, '');         // Trim - from end of text
}

/**
 * Format price with currency symbol
 * @param price Price as a number
 * @param currencySymbol Currency symbol to use (default: $)
 * @returns Formatted price string
 */
export function formatPrice(price?: number, currencySymbol = '$'): string {
  if (price === undefined || price === null) return '-';
  return `${currencySymbol}${price.toFixed(2)}`;
}

/**
 * Truncate text to a certain length with ellipsis
 * @param text Text to truncate
 * @param maxLength Maximum length before truncation
 * @returns Truncated text with ellipsis if necessary
 */
export function truncateText(text: string, maxLength: number): string {
  if (!text || text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}

/**
 * Get a product image URL with fallback
 * @param product Product object with images array
 * @returns First image URL or placeholder
 */
export function getProductImage(product: { images?: string[] }): string {
  if (product.images && product.images.length > 0) {
    return product.images[0];
  }
  return '/images/product-placeholder.jpg';
}

/**
 * Convert a date to a friendly format
 * @param date Date to format
 * @returns Formatted date string
 */
export function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
} 