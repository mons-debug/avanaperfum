import { StaticImageData } from 'next/image';

const PLACEHOLDER_IMAGE = '/images/product-placeholder.jpg';
const CATEGORY_PLACEHOLDER = '/images/categories/default.jpg';

export interface ImageConfig {
  fallback?: string;
  quality?: number;
  priority?: boolean;
}

export function getImageSrc(src?: string | StaticImageData | null, config: ImageConfig = {}) {
  if (!src) {
    return config.fallback || PLACEHOLDER_IMAGE;
  }

  // If it's a StaticImageData object, return its src
  if (typeof src === 'object' && 'src' in src) {
    return src.src;
  }

  // If it's a valid URL or path, return it
  if (typeof src === 'string' && src.length > 0) {
    // Don't return undefined or null strings
    if (src.includes('undefined') || src.includes('null')) {
      return config.fallback || PLACEHOLDER_IMAGE;
    }
    return src;
  }

  return config.fallback || PLACEHOLDER_IMAGE;
}

export function getProductImage(product?: { images?: (string | null)[] | null } | null): string {
  if (!product?.images?.length) {
    return PLACEHOLDER_IMAGE;
  }

  // Filter out null/undefined values and get the first valid image
  const validImages = product.images.filter(Boolean);
  return validImages.length > 0 ? getImageSrc(validImages[0]) : PLACEHOLDER_IMAGE;
}

export function getCategoryImage(category?: { imageUrl?: string; slug?: string } | null): string {
  if (!category) {
    return CATEGORY_PLACEHOLDER;
  }

  // Try imageUrl first
  if (category.imageUrl) {
    const src = getImageSrc(category.imageUrl, { fallback: CATEGORY_PLACEHOLDER });
    if (src !== CATEGORY_PLACEHOLDER) {
      return src;
    }
  }

  // Try slug-based image
  if (category.slug) {
    return `/images/categories/${category.slug}.jpg`;
  }

  return CATEGORY_PLACEHOLDER;
}

export const imageConfig = {
  product: {
    sizes: {
      thumbnail: '64px',
      small: '(max-width: 768px) 50vw, 33vw',
      medium: '(max-width: 768px) 100vw, 50vw',
      large: '(max-width: 1200px) 100vw, 1200px',
    },
    quality: 85,
  },
  category: {
    sizes: {
      default: '(max-width: 768px) 100vw, 33vw',
    },
    quality: 85,
  },
}; 