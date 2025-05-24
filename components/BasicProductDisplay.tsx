'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useTranslation } from '@/components/i18n/TranslationProvider';

// Define translation interface
interface ITranslation {
  en: string;
  fr: string;
  [key: string]: string;
}

// Simple product type
interface Product {
  _id: string;
  name: string | ITranslation;
  description?: string | ITranslation;
  price: number;
  images: string[];
  gender: string;
}

// Fallback products if API fails
const fallbackMenProducts = [
  {
    _id: 'fallback-m1',
    name: { en: 'Classic Homme', fr: 'Homme Classique' },
    description: { 
      en: 'A sophisticated fragrance for the modern man',
      fr: 'Un parfum sophistiqué pour l\'homme moderne'
    },
    price: 299,
    gender: 'Homme',
    images: ['/images/product-placeholder.svg']
  },
  {
    _id: 'fallback-m2',
    name: { en: 'Sport Homme', fr: 'Homme Sport' },
    description: { 
      en: 'An energetic scent for active lifestyles',
      fr: 'Un parfum énergisant pour les modes de vie actifs'
    },
    price: 250,
    gender: 'Homme',
    images: ['/images/product-placeholder.svg']
  },
  {
    _id: 'fallback-m3',
    name: { en: 'Elegance Homme', fr: 'Homme Élégance' },
    description: { 
      en: 'A distinguished fragrance with woody notes',
      fr: 'Un parfum distingué aux notes boisées'
    },
    price: 350,
    gender: 'Homme',
    images: ['/images/product-placeholder.svg']
  }
];

const fallbackWomenProducts = [
  {
    _id: 'fallback-f1',
    name: { en: 'Classic Femme', fr: 'Femme Classique' },
    description: { 
      en: 'A sophisticated fragrance for the modern woman',
      fr: 'Un parfum sophistiqué pour la femme moderne'
    },
    price: 299,
    gender: 'Femme',
    images: ['/images/product-placeholder.svg']
  },
  {
    _id: 'fallback-f2',
    name: { en: 'Elegance Femme', fr: 'Femme Élégance' },
    description: { 
      en: 'An elegant scent with floral notes',
      fr: 'Un parfum élégant aux notes florales'
    },
    price: 250,
    gender: 'Femme',
    images: ['/images/product-placeholder.svg']
  },
  {
    _id: 'fallback-f3',
    name: { en: 'Chic Femme', fr: 'Femme Chic' },
    description: { 
      en: 'A distinguished fragrance with fruity notes',
      fr: 'Un parfum distingué aux notes fruitées'
    },
    price: 350,
    gender: 'Femme',
    images: ['/images/product-placeholder.svg']
  }
];

export default function BasicProductDisplay() {
  const { t, locale } = useTranslation();
  const [activeTab, setActiveTab] = useState('male');
  const [menProducts, setMenProducts] = useState<Product[]>([]);
  const [womenProducts, setWomenProducts] = useState<Product[]>([]);
  const [isLoadingMen, setIsLoadingMen] = useState(true);
  const [isLoadingWomen, setIsLoadingWomen] = useState(true);

  // Fetch men's products
  useEffect(() => {
    const fetchMenProducts = async () => {
      try {
        setIsLoadingMen(true);
        // Add timestamp to force fresh data
        const timestamp = new Date().getTime();
        const response = await fetch(`/api/products?gender=Homme&limit=4&t=${timestamp}`, {
          cache: 'no-store',
          headers: {
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0'
          }
        });
        const data = await response.json();
        
        console.log('Fetched men products:', data);
        
        if (data.success && Array.isArray(data.data) && data.data.length > 0) {
          setMenProducts(data.data);
        } else {
          console.warn('No men products found, using fallback');
          setMenProducts(fallbackMenProducts);
        }
      } catch (error) {
        console.error('Error fetching men products:', error);
        setMenProducts(fallbackMenProducts);
      } finally {
        setIsLoadingMen(false);
      }
    };
    
    fetchMenProducts();
  }, []);

  // Fetch women's products
  useEffect(() => {
    const fetchWomenProducts = async () => {
      try {
        setIsLoadingWomen(true);
        // Add timestamp to force fresh data
        const timestamp = new Date().getTime();
        const response = await fetch(`/api/products?gender=Femme&limit=4&t=${timestamp}`, {
          cache: 'no-store',
          headers: {
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0'
          }
        });
        const data = await response.json();
        
        console.log('Fetched women products:', data);
        
        if (data.success && Array.isArray(data.data) && data.data.length > 0) {
          setWomenProducts(data.data);
        } else {
          console.warn('No women products found, using fallback');
          setWomenProducts(fallbackWomenProducts);
        }
      } catch (error) {
        console.error('Error fetching women products:', error);
        setWomenProducts(fallbackWomenProducts);
      } finally {
        setIsLoadingWomen(false);
      }
    };
    
    fetchWomenProducts();
  }, []);

  // Product Card Component
  const ProductCard = ({ product }: { product: Product }) => {
    const [imageError, setImageError] = useState(false);
    const [imageLoaded, setImageLoaded] = useState(false);
    const [imageUrl, setImageUrl] = useState<string>('/images/product-placeholder.svg');
    
    // Set the image source whenever product changes with cache busting
    useEffect(() => {
      if (product.images && product.images.length > 0 && !imageError) {
        // Add cache-busting query parameter to force fresh image
        const timestamp = new Date().getTime();
        setImageUrl(`${product.images[0]}?t=${timestamp}`);
      } else {
        setImageUrl('/images/product-placeholder.svg');
      }
    }, [product.images, imageError]);
    
    // Handle translated product name and description, prioritizing French
    const productName = typeof product.name === 'object' 
      ? (product.name[locale as keyof typeof product.name] || product.name.fr || product.name.en) 
      : product.name;
      
    const productDescription = product.description 
      ? (typeof product.description === 'object' 
          ? (product.description[locale as keyof typeof product.description] || product.description.fr || product.description.en) 
          : product.description)
      : '';
    
    return (
      <Link 
        href={`/product/${product._id}`}
        className="group text-center flex flex-col"
      >
        <div className="aspect-square relative mb-3 bg-gray-50 rounded-lg overflow-hidden shadow-sm">
          <Image
            src={imageUrl}
            alt={productName}
            fill
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
            className="object-contain"
            priority={true}
            unoptimized={true} /* Disable Next.js image optimization to avoid caching */
            onLoad={() => setImageLoaded(true)}
            onError={() => {
              console.log(`Error loading image for product`, imageUrl);
              setImageError(true);
              setImageUrl('/images/product-placeholder.svg');
            }}
          />
        </div>
        <h3 className="text-sm font-medium mb-1 line-clamp-1">{productName}</h3>
        <p className="text-xs text-gray-500 mb-1 line-clamp-2">
          {productDescription.slice(0, 40)}...
        </p>
        <p className="text-[#c8a45d] font-semibold text-sm mt-auto">{product.price} {t('product.currency', 'DH')}</p>
      </Link>
    );
  };

  // Loading Skeleton
  const ProductSkeleton = () => (
    <div className="animate-pulse flex flex-col">
      <div className="aspect-square bg-gray-200 rounded-lg mb-3"></div>
      <div className="h-4 bg-gray-200 rounded mb-2"></div>
      <div className="h-3 bg-gray-200 rounded mb-2 w-3/4"></div>
      <div className="h-4 bg-gray-200 rounded w-1/3 mt-auto"></div>
    </div>
  );

  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4" data-component-name="BasicProductDisplay">
        {/* Section Title */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-playfair text-[#c8a45d] mb-4">
            {t('home.featured.title', 'Parfums en Vedette')}
          </h2>
          <p className="text-gray-600 max-w-3xl mx-auto">
            {t('home.featured.subtitle', 'Découvrez notre exquise collection de parfums premium pour hommes et femmes, inspirés des parfums de renommée mondiale à des prix abordables.')}
          </p>
        </div>
        
        {/* Mobile Toggle & Carousel */}
        <div className="block lg:hidden mb-8">
          <div className="flex justify-center mb-8">
            <div className="inline-flex items-center bg-gray-50 p-1 rounded-full border border-gray-200 shadow-sm">
              <button
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                  activeTab === 'male'
                    ? 'bg-[#c8a45d] text-white shadow-md transform scale-105'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
                onClick={() => setActiveTab('male')}
              >
                {t('home.featured.men', 'Pour Lui')}
              </button>
              <button
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                  activeTab === 'female'
                    ? 'bg-[#c8a45d] text-white shadow-md transform scale-105'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
                onClick={() => setActiveTab('female')}
              >
                {t('home.featured.women', 'Pour Elle')}
              </button>
            </div>
          </div>
          {/* Carousel */}
          <div className="overflow-x-auto flex space-x-4 pb-2 snap-x snap-mandatory">
            {activeTab === 'male'
              ? (isLoadingMen
                  ? Array(3).fill(0).map((_, i) => <div className="min-w-[220px] snap-center" key={i}><ProductSkeleton /></div>)
                  : menProducts.slice(0, 6).map(product => (
                      <div className="min-w-[220px] snap-center" key={product._id}>
                        <ProductCard product={product} />
                      </div>
                    ))
                )
              : (isLoadingWomen
                  ? Array(3).fill(0).map((_, i) => <div className="min-w-[220px] snap-center" key={i}><ProductSkeleton /></div>)
                  : womenProducts.slice(0, 6).map(product => (
                      <div className="min-w-[220px] snap-center" key={product._id}>
                        <ProductCard product={product} />
                      </div>
                    ))
                )
            }
          </div>
          <div className="text-center mt-6">
            <Link
              href={activeTab === 'male' ? '/shop?gender=Homme' : '/shop?gender=Femme'}
              className="inline-block px-10 py-3 border border-black text-sm uppercase tracking-wide hover:bg-black hover:text-white transition"
            >
              {t('home.about.learnMore', 'EN SAVOIR PLUS')}
            </Link>
          </div>
        </div>
        {/* Desktop View */}
        <div className="hidden lg:grid grid-cols-2 gap-8 relative">
          {/* Center divider */}
          <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-gray-200 transform -translate-x-1/2"></div>
          {/* Men's Section */}
          <div className="lg:pr-6">
            <h2 className="text-xl sm:text-2xl font-playfair mb-6 text-center text-[#c8a45d]">{t('home.featured.men', 'Pour Lui')}</h2>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
              {isLoadingMen ? (
                Array(3).fill(0).map((_, i) => <ProductSkeleton key={i} />)
              ) : (
                menProducts.slice(0, 3).map(product => (
                  <ProductCard key={product._id} product={product} />
                ))
              )}
            </div>
            <div className="text-center mt-8">
              <Link
                href="/shop?gender=Homme"
                className="inline-block px-10 py-3 border border-black text-sm uppercase tracking-wide hover:bg-black hover:text-white transition"
              >
                {t('home.about.learnMore', 'EN SAVOIR PLUS')}
              </Link>
            </div>
          </div>
          {/* Women's Section */}
          <div className="lg:pl-6">
            <h2 className="text-xl sm:text-2xl font-playfair mb-6 text-center text-[#c8a45d]">{t('home.featured.women', 'Pour Elle')}</h2>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
              {isLoadingWomen ? (
                Array(3).fill(0).map((_, i) => <ProductSkeleton key={i} />)
              ) : (
                womenProducts.slice(0, 3).map(product => (
                  <ProductCard key={product._id} product={product} />
                ))
              )}
            </div>
            <div className="text-center mt-8">
              <Link
                href="/shop?gender=Femme"
                className="inline-block px-10 py-3 border border-black text-sm uppercase tracking-wide hover:bg-black hover:text-white transition"
              >
                {t('home.about.learnMore', 'EN SAVOIR PLUS')}
              </Link>
            </div>
          </div>
        </div>
        
        <div className="mt-10 text-center">
          <Link 
            href="/shop"
            className="inline-block px-8 py-3 bg-[#c8a45d] hover:bg-[#b08d48] text-white rounded-lg transition-colors"
          >
            {t('home.featured.viewAll', 'Voir Tous les Parfums')}
          </Link>
        </div>
      </div>
    </section>
  );
}
