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
    name: 'Homme Classic',
    description: 'A sophisticated fragrance for the modern man',
    price: 299,
    gender: 'Homme',
    images: ['/images/product-placeholder.svg']
  },
  {
    _id: 'fallback-m2',
    name: 'Homme Sport',
    description: 'An energetic scent for active lifestyles',
    price: 250,
    gender: 'Homme',
    images: ['/images/product-placeholder.svg']
  },
  {
    _id: 'fallback-m3',
    name: 'Homme Elegance',
    description: 'A distinguished fragrance with woody notes',
    price: 350,
    gender: 'Homme',
    images: ['/images/product-placeholder.svg']
  }
];

const fallbackWomenProducts = [
  {
    _id: 'fallback-f1',
    name: 'Femme Classic',
    description: 'A sophisticated fragrance for the modern woman',
    price: 299,
    gender: 'Femme',
    images: ['/images/product-placeholder.svg']
  },
  {
    _id: 'fallback-f2',
    name: 'Femme Elegance',
    description: 'An elegant scent with floral notes',
    price: 250,
    gender: 'Femme',
    images: ['/images/product-placeholder.svg']
  },
  {
    _id: 'fallback-f3',
    name: 'Femme Chic',
    description: 'A distinguished fragrance with fruity notes',
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
        const response = await fetch('/api/products?gender=Homme&limit=4', {
          cache: 'no-store'
        });
        const data = await response.json();
        
        if (data.success && Array.isArray(data.data) && data.data.length > 0) {
          setMenProducts(data.data);
        } else {
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
        const response = await fetch('/api/products?gender=Femme&limit=4', {
          cache: 'no-store'
        });
        const data = await response.json();
        
        if (data.success && Array.isArray(data.data) && data.data.length > 0) {
          setWomenProducts(data.data);
        } else {
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
    const imageUrl = product.images && product.images.length > 0 
      ? product.images[0] 
      : '/images/product-placeholder.svg';
    
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
          <div 
            className="w-full h-full"
            style={{
              backgroundImage: `url('${imageUrl}')`,
              backgroundSize: 'contain',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat'
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
            {t('home.featured.title', 'Featured Fragrances')}
          </h2>
          <p className="text-gray-600 max-w-3xl mx-auto">
            {t('home.featured.subtitle', 'Discover our exquisite collection of premium fragrances for both men and women, inspired by world-renowned perfumes at affordable prices.')}
          </p>
        </div>
        
        {/* Desktop View */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 relative">
          {/* Center divider */}
          <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-gray-200 transform -translate-x-1/2"></div>
          
          {/* Men's Section */}
          <div className="lg:pr-6">
            <h2 className="text-xl sm:text-2xl font-playfair mb-6 text-center text-[#c8a45d]">{t('footer.links.forHim', 'HOMME')}</h2>
            
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
            <h2 className="text-xl sm:text-2xl font-playfair mb-6 text-center text-[#c8a45d]">{t('footer.links.forHer', 'FEMME')}</h2>
            
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
            {t('home.featured.viewAll', 'View All Fragrances')}
          </Link>
        </div>
      </div>
    </section>
  );
}
