'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useTranslation } from '@/components/i18n/TranslationProvider';
import { 
  FaHeart, FaShare, FaArrowLeft as FaArrowPrev, 
  FaArrowRight as FaArrowNext, FaShoppingBag, 
  FaWhatsapp, FaCheck, FaTruck, FaShieldAlt,
  FaShoppingCart
} from 'react-icons/fa';
import OrderModal from '@/components/OrderModal';
import { getImageSrc, imageConfig } from '@/lib/utils/image';
import { 
  addToCart, 
  removeFromCart, 
  isInCart, 
  ITranslation as CartITranslation, 
  ProductWithTranslation,
  CartProduct 
} from '@/lib/cart';

// Re-export the ITranslation type from cart to ensure consistency
type ITranslation = CartITranslation;

interface ProductProps {
  product: {
    _id: string;
    name: string | ITranslation;
    slug?: string;
    inspiredBy?: string | ITranslation;
    description?: string | ITranslation;
    volume?: string | ITranslation;
    price: number;
    originalPrice?: number;
    tags?: string[];
    ingredients?: string | ITranslation;
    images: string[];
    category?: string;
    gender?: string;
  };
}

const ProductDetail: React.FC<ProductProps> = ({ product }) => {
  const { t, locale = 'fr' } = useTranslation();
  
  // Type guard to check if a value is an ITranslation object
  const isITranslation = (value: any): value is ITranslation => {
    return value && typeof value === 'object' && ('en' in value || 'fr' in value);
  };

  // Helper function to get translated text
  const getTranslatedText = (text: string | ITranslation | undefined, defaultText: string = ''): string => {
    if (!text) return defaultText;
    if (typeof text === 'string') return text;
    if (!isITranslation(text)) return defaultText;
    
    // Safely access the translation with type checking
    const translation = text as ITranslation;
    return translation[locale as keyof ITranslation] || translation.fr || translation.en || defaultText;
  };
  
  // Helper function to get translated text for cart (ensures string output)
  const getCartText = (text: string | ITranslation | undefined, defaultText: string = ''): string => {
    if (!text) return defaultText;
    if (typeof text === 'string') return text;
    if (!isITranslation(text)) return defaultText;
    
    // For cart, default to French as per user preference
    return text.fr || text.en || defaultText;
  };
  
  // Helper function to ensure string output for JSX rendering
  const renderTranslatedText = (text: string | ITranslation | undefined, defaultText: string = ''): React.ReactNode => {
    if (!text) return defaultText;
    if (typeof text === 'string') return text;
    if (!isITranslation(text)) return defaultText;
    
    return text[locale as keyof ITranslation] || text.fr || text.en || defaultText;
  };
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imageError, setImageError] = useState<Record<number, boolean>>({});
  const [similarProducts, setSimilarProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isInCartState, setIsInCartState] = useState(false);
  
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  
  // Get product slug or fallback to ID for links
  const productIdentifier = product.slug || product._id;
  
  // Format tags for display
  const formattedTags = product.tags?.join(', ') || '';
  const discount = product.originalPrice && product.price 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) 
    : 0;

  // Handle available images with proper error handling
  const images = product.images?.filter(Boolean) || [];
  
  // Get current image with fallback and add a timestamp to prevent caching
  const getTimestampedImage = (imageUrl: string) => {
    const baseUrl = getImageSrc(imageUrl);
    // Add timestamp to prevent caching if it's a local product image
    if (baseUrl.includes('/images/products/')) {
      return `${baseUrl}?t=${Date.now()}`;
    }
    return baseUrl;
  };
  
  // Set current image with cache-busting
  const currentImage = getTimestampedImage(images[currentImageIndex] || '');
  
  // Navigate through images
  const goToPrevImage = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };
  
  const goToNextImage = () => {
    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };
  
  // Handle image error
  const handleImageError = (index: number) => {
    console.error('Image failed to load:', images[index]);
    setImageError(prev => ({ ...prev, [index]: true }));
  };

  // Fetch similar products based on category or gender
  useEffect(() => {
    const fetchSimilarProducts = async () => {
      setIsLoading(true);
      try {
        const queryParams = new URLSearchParams();
        
        if (product.category) {
          queryParams.append('category', product.category);
        } else if (product.gender) {
          queryParams.append('gender', product.gender);
        }
        
        queryParams.append('limit', '4');
        // Exclude current product
        queryParams.append('exclude', product._id);
        
        const response = await fetch(`/api/products?${queryParams.toString()}`);
        const data = await response.json();
        
        if (data.success && data.data) {
          setSimilarProducts(data.data);
        }
      } catch (error) {
        console.error('Failed to fetch similar products:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchSimilarProducts();
  }, [product._id, product.category, product.gender]);
  
  // Check if product is in cart
  useEffect(() => {
    const checkCart = () => {
      setIsInCartState(isInCart(product._id));
    };
    
    checkCart();
    
    // Listen for cart updates
    const handleStorage = (event: StorageEvent) => {
      if (event.key === 'avana_cart') {
        checkCart();
      }
    };
    
    window.addEventListener('storage', handleStorage);
    
    // Also listen for custom cart update events
    const handleCartUpdate = () => checkCart();
    window.addEventListener('cartUpdated', handleCartUpdate as EventListener);
    
    return () => {
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener('cartUpdated', handleCartUpdate as EventListener);
    };
  }, [product._id]);

  const handleAddToCart = () => {
    if (isInCartState) {
      removeFromCart(product._id);
    } else {
      try {
        // Create a properly typed cart product with all translations resolved to strings
        const cartProduct: Omit<CartProduct, 'quantity'> = {
          _id: product._id,
          name: getCartText(product.name, 'Unnamed Product'),
          price: product.price,
          images: Array.isArray(product.images) ? product.images : [],
          inspiredBy: getCartText(product.inspiredBy),
          volume: getCartText(product.volume)
        };
        
        addToCart(cartProduct);
        
        // Dispatch custom event to notify other components
        window.dispatchEvent(new Event('cartUpdated'));
      } catch (error) {
        console.error('Error adding to cart:', error);
      }
    }
  };

  // How to order steps
  const orderSteps = [
    {
      icon: <FaShoppingBag className="w-6 h-6 text-[#c8a45d]" />,
      title: renderTranslatedText(t('home.howToOrder.steps.choose.title', 'Choose Your Fragrance')),
      description: renderTranslatedText(t('home.howToOrder.steps.choose.description', 'Select the perfect scent that matches your personality.'))
    },
    {
      icon: <FaWhatsapp className="w-6 h-6 text-[#c8a45d]" />,
      title: t('home.howToOrder.steps.contact.title', 'Contact Us'),
      description: t('home.howToOrder.steps.contact.description', 'Place your order via WhatsApp or through our online form.')
    },
    {
      icon: <FaCheck className="w-6 h-6 text-[#c8a45d]" />,
      title: t('home.howToOrder.steps.confirm.title', 'Confirm Your Order'),
      description: t('home.howToOrder.steps.confirm.description', 'We\'ll verify your details and confirm your order.')
    },
    {
      icon: <FaTruck className="w-6 h-6 text-[#c8a45d]" />,
      title: t('home.howToOrder.steps.receive.title', 'Fast Delivery'),
      description: t('home.howToOrder.steps.receive.description', 'Receive your order at your doorstep within 1-3 business days.')
    }
  ];
  
  return (
    <div className="min-h-screen pt-[120px] pb-8">
      <div className="container mx-auto px-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="flex flex-col lg:flex-row">
            {/* Product Images Section */}
            <div className="lg:w-1/2 p-6 bg-gray-50">
              {/* Main Image */}
              <div className="relative h-[400px] md:h-[500px] rounded-lg overflow-hidden bg-white">
                <Image
                  src={currentImage}
                  alt={getTranslatedText(product.name, 'Product')}
                  fill
                  sizes={imageConfig.product.sizes.medium}
                  className="object-contain"
                  priority
                  unoptimized={true} /* Disable Next.js image optimization to avoid caching */
                  quality={imageConfig.product.quality}
                  onError={() => handleImageError(currentImageIndex)}
                />
                {discount > 0 && (
                  <div className="absolute top-4 left-4 bg-[#c8a45d] text-white text-sm font-bold px-3 py-1 rounded-full">
                    {discount}% {t('product.discount', 'OFF')}
                  </div>
                )}
                
                {/* Navigation buttons for multiple images */}
                {images.length > 1 && (
                  <>
                    <button 
                      onClick={goToPrevImage}
                      className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full shadow-md hover:bg-white transition-all"
                      aria-label="Previous image"
                    >
                      <FaArrowPrev />
                    </button>
                    <button 
                      onClick={goToNextImage}
                      className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full shadow-md hover:bg-white transition-all"
                      aria-label="Next image"
                    >
                      <FaArrowNext />
                    </button>
                  </>
                )}
              </div>
              
              {/* Thumbnail Gallery */}
              {images.length > 1 && (
                <div className="mt-4 flex gap-3 overflow-x-auto pb-2">
                  {images.map((img, index) => {
                    const thumbSrc = getImageSrc(img);
                    return (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`relative h-20 w-20 rounded-lg border-2 flex-shrink-0 overflow-hidden
                          ${currentImageIndex === index ? 'border-[#c8a45d]' : 'border-gray-200'} 
                          hover:border-[#c8a45d] transition-all`}
                        aria-label={`Product image ${index + 1}`}
                      >
                        <Image
                          src={getTimestampedImage(img)}
                          alt={`${product.name} - image ${index + 1}`}
                          fill
                          sizes={imageConfig.product.sizes.thumbnail}
                          className="object-cover"
                          unoptimized={true} /* Disable Next.js image optimization to avoid caching */
                          onError={() => handleImageError(index)}
                        />
                        {imageError[index] && (
                          <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
                            <span className="text-xs text-gray-500">No image</span>
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
            
            {/* Product Info Section */}
            <div className="lg:w-1/2 p-6 lg:p-8">
              {/* Product title and inspired by */}
              <div className="border-b border-gray-100 pb-6">
                <h1 className="text-3xl font-playfair text-gray-800 mb-2">
                  {getTranslatedText(product.name, 'Unnamed Product')}
                </h1>
                {product.inspiredBy && (
                  <p className="text-gray-600">
                    {t('product.inspiredBy', 'Inspired by')}: {getTranslatedText(product.inspiredBy)}
                  </p>
                )}
                
                {/* Product badges */}
                <div className="flex flex-wrap gap-2 mt-4">
                  {product.gender && (
                    <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
                      {product.gender === 'Homme' ? t('footer.links.forHim', 'For Him') : 
                       product.gender === 'Femme' ? t('footer.links.forHer', 'For Her') : 
                       product.gender}
                    </span>
                  )}
                  {product.volume && (
                    <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
                      {t('product.volume', 'Volume')}: {getTranslatedText(product.volume)}
                    </span>
                  )}
                  {product.category && (
                    <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
                      {product.category}
                    </span>
                  )}
                </div>
              </div>
              
              {/* Price */}
              <div className="mb-6">
                <div className="flex items-center mb-2">
                  <span className="text-gray-600 w-24">{t('product.volume', 'Volume')}:</span>
                  <span className="font-medium">{getTranslatedText(product.volume)}ml</span>
                </div>
                <div className="flex items-center">
                  <span className="text-2xl font-bold text-[#c8a45d] mr-3">
                    ${product.price.toFixed(2)}
                  </span>
                  {product.originalPrice && product.originalPrice > product.price && (
                    <span className="text-gray-400 line-through">
                      ${product.originalPrice.toFixed(2)}
                    </span>
                  )}
                </div>
              </div>
              
              {/* Description and ingredients */}
              <div className="py-6 border-b border-gray-100">
                {product.description && (
                  <div className="mb-6">
                    <h2 className="text-lg font-playfair font-semibold mb-2">{t('product.description', 'Description')}</h2>
                    <p className="text-gray-600">
                      {getTranslatedText(product.description)}
                    </p>
                  </div>
                )}
                
                {product.ingredients && (
                  <div className="mt-4">
                    <h2 className="text-lg font-playfair font-semibold mb-2">Ingredients</h2>
                    <p className="text-gray-600">
                      {getTranslatedText(product.ingredients)}
                    </p>
                  </div>
                )}
              </div>
              
              {/* Action buttons */}
              <div className="pt-6 space-y-4">
                <button
                  onClick={openModal}
                  className="w-full bg-[#c8a45d] text-white py-3.5 px-6 rounded-lg hover:bg-[#b08d48] transition-colors font-medium text-base flex items-center justify-center gap-2"
                >
                  <FaShoppingBag />
                  <span>{t('product.orderNow', 'Order Now')}</span>
                </button>
                
                <div className="flex gap-4 mt-6">
                  {/* Add to Cart Button */}
                  <button
                    className={`flex-1 flex items-center justify-center gap-2 py-3 px-6 border rounded-lg transition-colors ${isInCartState ? 'bg-green-100 text-green-700 border-green-200' : 'border-gray-300 hover:bg-gray-50 text-gray-700 hover:text-[#c8a45d]'}`}
                    onClick={handleAddToCart}
                  >
                    {isInCartState ? (
                      <>
                        <FaCheck className="text-green-600" />
                        <span>{t('product.inCart', 'Added to Cart')}</span>
                      </>
                    ) : (
                      <>
                        <FaShoppingCart className="text-[#c8a45d]" />
                        <span>{t('product.addToCart', 'Add to Cart')}</span>
                      </>
                    )}
                  </button>
                </div>
                
                <Link
                  href={`https://wa.me/+212674428593?text=${encodeURIComponent(
                    `Hello, I'm interested in purchasing:\n\n*${getTranslatedText(product.name)}*${product.inspiredBy ? ` (Inspired by ${getTranslatedText(product.inspiredBy)})` : ''}\nPrice: ${product.price.toFixed(2)} DH\n${product.volume ? `Volume: ${getTranslatedText(product.volume)}\n` : ''}${product.gender ? `Type: ${product.gender}\n` : ''}\n\nPlease let me know how to proceed with my order.`
                  )}`}
                  target="_blank"
                  className="w-full flex items-center justify-center gap-2 py-3.5 px-6 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-medium"
                >
                  <FaWhatsapp size={20} />
                  <span>Order via WhatsApp</span>
                </Link>
              </div>
              
              {/* Tags */}
              {formattedTags && (
                <div className="mt-6">
                  <h2 className="text-sm font-medium mb-2 text-gray-700">Tags</h2>
                  <div className="flex flex-wrap gap-2">
                    {product.tags?.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* How to Order Section */}
        <div className="mt-12 mb-12">
          <h2 className="text-2xl font-playfair font-semibold text-center mb-8">How to Order</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {orderSteps.map((step, index) => (
              <div 
                key={index} 
                className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
              >
                <div className="w-12 h-12 bg-[#c8a45d]/10 rounded-full flex items-center justify-center mb-4">
                  {step.icon}
                </div>
                <h3 className="text-lg font-medium mb-2">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
        
        {/* You May Also Like Section */}
        {similarProducts.length > 0 && (
          <div className="mt-12 mb-8">
            <h2 className="text-2xl font-playfair text-[#c8a45d] mb-6 text-center">{t('product.relatedProducts', 'You May Also Like')}</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {similarProducts.map((relatedProduct) => {
                const isProductInCart = isInCart(relatedProduct._id);
                return (
                  <div 
                    key={relatedProduct._id}
                    className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 transition-all hover:shadow-md"
                  >
                    {/* Product Image */}
                    <Link href={`/product/${relatedProduct.slug || relatedProduct._id}`}>
                      <div className="relative aspect-square">
                        <Image
                          src={getImageSrc(relatedProduct.images[0])}
                          alt={getTranslatedText(relatedProduct.name, 'Product')}
                          fill
                          sizes="(max-width: 768px) 50vw, 25vw"
                          className="object-cover"
                        />
                      </div>
                    </Link>
                    
                    {/* Product Info */}
                    <div className="p-4">
                      <Link href={`/product/${relatedProduct.slug || relatedProduct._id}`}>
                        <h3 className="text-sm font-medium text-gray-800 line-clamp-1 hover:text-[#c8a45d] transition-colors">
                          {relatedProduct.name}
                        </h3>
                        <p className="text-[#c8a45d] font-medium mt-1">
                          {relatedProduct.price.toFixed(2)} DH
                        </p>
                      </Link>
                      
                      {/* Add to Cart button */}
                      <button
                        onClick={() => isProductInCart ? removeFromCart(relatedProduct._id) : addToCart(relatedProduct)}
                        className={`w-full mt-3 py-1.5 rounded text-xs font-medium transition-colors flex items-center justify-center ${
                          isProductInCart 
                            ? 'bg-green-100 text-green-700 border border-green-200'
                            : 'bg-[#c8a45d] text-white hover:bg-[#b08d48]'
                        }`}
                      >
                        {isProductInCart ? (
                          <>
                            <FaCheck className="mr-1" size={10} />
                            <span>Added</span>
                          </>
                        ) : (
                          <>
                            <FaShoppingCart className="mr-1" size={10} />
                            <span>Add to Cart</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
      
      {isModalOpen && (
        <OrderModal
          product={{
            _id: product._id,
            name: getTranslatedText(product.name, 'Unnamed Product'),
            price: product.price,
            images: product.images,
            volume: getTranslatedText(product.volume),
            inspiredBy: getTranslatedText(product.inspiredBy)
          }}
          onClose={closeModal}
        />
      )}
    </div>
  );
};

export default ProductDetail; 