'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useTranslation } from '@/components/i18n/TranslationProvider';

// Product interface
interface Product {
  _id: string;
  name: string;
  description?: string;
  price: number;
  images: string[];
  gender: string;
}

export default function BasicProductDisplay() {
  const { t, locale } = useTranslation();
  const [activeTab, setActiveTab] = useState<'male' | 'female'>('male');
  const [menProducts, setMenProducts] = useState<Product[]>([]);
  const [womenProducts, setWomenProducts] = useState<Product[]>([]);
  const [isLoadingMen, setIsLoadingMen] = useState(true);
  const [isLoadingWomen, setIsLoadingWomen] = useState(true);

  // Fetch men's products
  useEffect(() => {
    const fetchMenProducts = async () => {
      try {
        setIsLoadingMen(true);
        const response = await fetch(`/api/products?gender=Homme&limit=12`, {
          cache: 'no-store',
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.success && Array.isArray(data.data) && data.data.length > 0) {
          setMenProducts(data.data);
        } else {
          console.error('No men products found');
          setMenProducts([]);
        }
      } catch (error) {
        console.error('Error fetching men products:', error);
        setMenProducts([]);
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
        const response = await fetch(`/api/products?gender=Femme&limit=12`, {
          cache: 'no-store',
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.success && Array.isArray(data.data) && data.data.length > 0) {
          setWomenProducts(data.data);
        } else {
          console.error('No women products found');
          setWomenProducts([]);
        }
      } catch (error) {
        console.error('Error fetching women products:', error);
        setWomenProducts([]);
      } finally {
        setIsLoadingWomen(false);
      }
    };
    
    fetchWomenProducts();
  }, []);

  // Product Card Component
  const ProductCard = ({ product }: { product: Product }) => {
    const [imageError, setImageError] = useState(false);
    const imageUrl = imageError || !product.images?.length 
      ? '/images/product-placeholder.svg' 
      : product.images[0];
    
    return (
      <Link 
        href={`/product/${product._id}`}
        className="group text-center flex flex-col hover:shadow-lg transition-shadow duration-200 bg-white rounded-lg p-2 h-full"
      >
        <div className="aspect-square relative mb-2 bg-gray-50 rounded-lg overflow-hidden">
          <Image
            src={imageUrl}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 144px, 160px"
            className="object-contain group-hover:scale-105 transition-transform duration-200"
            onError={() => setImageError(true)}
            unoptimized={true}
          />
        </div>
        <h3 className="text-xs font-medium mb-1 line-clamp-2 leading-tight">{product.name}</h3>
        <p className="text-xs text-gray-500 mb-2 line-clamp-1 leading-tight">
          {product.description?.slice(0, 30)}{product.description && product.description.length > 30 ? '...' : ''}
        </p>
        <p className="text-[#c8a45d] font-semibold text-sm mt-auto">{product.price} {t('product.currency', 'DH')}</p>
      </Link>
    );
  };

  // Loading Skeleton
  const ProductSkeleton = () => (
    <div className="animate-pulse flex flex-col bg-white rounded-lg p-2 h-full">
      <div className="aspect-square bg-gray-200 rounded-lg mb-2"></div>
      <div className="h-3 bg-gray-200 rounded mb-1"></div>
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
                {t('home.featured.men', 'Homme')}
              </button>
              <button
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                  activeTab === 'female'
                    ? 'bg-[#c8a45d] text-white shadow-md transform scale-105'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
                onClick={() => setActiveTab('female')}
              >
                {t('home.featured.women', 'Femme')}
              </button>
            </div>
          </div>
          
          {/* Mobile Carousel - Fixed Layout */}
          <div className="w-full overflow-hidden">
            <div className="flex overflow-x-auto gap-3 px-4 pb-4 scrollbar-hide mobile-carousel">
              {activeTab === 'male'
                ? (isLoadingMen
                    ? Array(12).fill(0).map((_, i) => (
                        <div className="w-36 flex-shrink-0" key={i}>
                          <ProductSkeleton />
                        </div>
                      ))
                    : menProducts.map(product => (
                        <div className="w-36 flex-shrink-0" key={product._id}>
                          <ProductCard product={product} />
                        </div>
                      ))
                  )
                : (isLoadingWomen
                    ? Array(12).fill(0).map((_, i) => (
                        <div className="w-36 flex-shrink-0" key={i}>
                          <ProductSkeleton />
                        </div>
                      ))
                    : womenProducts.map(product => (
                        <div className="w-36 flex-shrink-0" key={product._id}>
                          <ProductCard product={product} />
                        </div>
                      ))
                  )
              }
              {/* Spacer to show last item properly */}
              <div className="w-4 flex-shrink-0"></div>
            </div>
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

        {/* Desktop View - Fixed Layout */}
        <div className="hidden lg:grid grid-cols-2 gap-8 relative">
          {/* Center divider */}
          <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-gray-200 transform -translate-x-1/2"></div>
          
          {/* Men's Section */}
          <div className="lg:pr-6">
            <h2 className="text-xl sm:text-2xl font-playfair mb-6 text-center text-[#c8a45d]">{t('home.featured.men', 'Homme')}</h2>
            <div className="w-full overflow-hidden">
              <div className="flex overflow-x-auto gap-4 px-2 pb-4 scrollbar-hide desktop-carousel">
                {isLoadingMen ? (
                  Array(12).fill(0).map((_, i) => (
                    <div className="w-40 flex-shrink-0" key={i}>
                      <ProductSkeleton />
                    </div>
                  ))
                ) : (
                  menProducts.map(product => (
                    <div className="w-40 flex-shrink-0" key={product._id}>
                      <ProductCard product={product} />
                    </div>
                  ))
                )}
                {/* Spacer to show last item properly */}
                <div className="w-2 flex-shrink-0"></div>
              </div>
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
            <h2 className="text-xl sm:text-2xl font-playfair mb-6 text-center text-[#c8a45d]">{t('home.featured.women', 'Femme')}</h2>
            <div className="w-full overflow-hidden">
              <div className="flex overflow-x-auto gap-4 px-2 pb-4 scrollbar-hide desktop-carousel">
                {isLoadingWomen ? (
                  Array(12).fill(0).map((_, i) => (
                    <div className="w-40 flex-shrink-0" key={i}>
                      <ProductSkeleton />
                    </div>
                  ))
                ) : (
                  womenProducts.map(product => (
                    <div className="w-40 flex-shrink-0" key={product._id}>
                      <ProductCard product={product} />
                    </div>
                  ))
                )}
                {/* Spacer to show last item properly */}
                <div className="w-2 flex-shrink-0"></div>
              </div>
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
            Voir Tous les Parfums
          </Link>
        </div>
      </div>
    </section>
  );
}
