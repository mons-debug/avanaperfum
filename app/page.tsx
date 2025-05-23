'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { connectToDB } from '@/lib/mongodb';
import Product from '@/models/Product';
import Category from '@/models/Category';
import WhatsAppButton from '@/components/WhatsAppButton';
import HeroSection from '@/components/HeroSection';
import ProductCard from '@/components/ProductCard';
import CategoryCard from '@/components/CategoryCard';
import BasicProductDisplay from '@/components/BasicProductDisplay';
import { FaVenus, FaMars, FaShoppingBag, FaWhatsapp, FaCheck, FaArrowRight, FaArrowLeft, FaPhone, FaBox, FaCrown, FaTruck, FaMoneyBillWave } from 'react-icons/fa';
import Image from 'next/image';
import { useProducts } from '@/hooks/useProducts';
import { useCategories } from '@/hooks/useCategories';
import { useTranslation } from '@/components/i18n/TranslationProvider';

// Add type definitions at the top
interface Product {
  _id: string;
  name: string;
  inspiredBy?: string;
  description?: string;
  price: number;
  volume: string;
  images: string[];
  gender: string;
  tags?: string[];
  brand?: string;
  category?: string;
}

interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  featured: boolean;
  productCount?: number;
}

async function getProductsByGender(gender: string) {
  try {
    await connectToDB();
    // Get latest 3 products by gender
    const products = await Product.find({ gender }).sort({ createdAt: -1 }).limit(3);
    return JSON.parse(JSON.stringify(products));
  } catch (error) {
    console.error(`Error fetching ${gender} products:`, error);
    return [];
  }
}

async function getProductsByCategory(categoryId: string) {
  try {
    await connectToDB();
    // Get latest 3 products by category
    const products = await Product.find({ categoryId }).sort({ createdAt: -1 }).limit(3);
    return JSON.parse(JSON.stringify(products));
  } catch (error) {
    console.error(`Error fetching products for category ${categoryId}:`, error);
    return [];
  }
}

async function getCategoriesWithCount() {
  try {
    await connectToDB();
    const categories = await Category.find({});
    
    // Get product count for each category
    const categoriesWithCount = await Promise.all(
      categories.map(async (category) => {
        const count = await Product.countDocuments({ categoryId: category._id });
        return {
          ...JSON.parse(JSON.stringify(category)),
          productCount: count
        };
      })
    );
    
    return categoriesWithCount;
  } catch (error) {
    console.error('Error fetching categories with count:', error);
    return [];
  }
}

// Define the ProductImage component
interface ProductImageProps {
  initialSrc?: string;
  alt: string;
  productId?: string;
  sizes: string;
}

const ProductImage: React.FC<ProductImageProps> = ({ initialSrc, alt, productId, sizes }) => {
  const placeholderSrc = '/images/product-placeholder.svg';
  const [currentSrc, setCurrentSrc] = useState(initialSrc || placeholderSrc);
  const [hasErrored, setHasErrored] = useState(false);

  useEffect(() => {
    // When initialSrc changes, reset the image source
    if (initialSrc && initialSrc !== currentSrc && !hasErrored) {
      setCurrentSrc(initialSrc);
    }
  }, [initialSrc, currentSrc, hasErrored]);

  const handleError = () => {
    if (!hasErrored) {
      console.error(`Image error for product ${productId || 'Unknown ID'} with src "${currentSrc}". Falling back to placeholder.`);
      setCurrentSrc(placeholderSrc);
      setHasErrored(true);
    }
  };

  if (!initialSrc || hasErrored) {
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
        <Image
          src={placeholderSrc}
          alt={alt}
          fill
          sizes={sizes}
          className="object-contain p-4"
          unoptimized={true}
        />
      </div>
    );
  }

  return (
    <Image
      src={currentSrc}
      alt={alt}
      fill
      sizes={sizes}
      className="object-cover transition-transform duration-500 group-hover:scale-105"
      onError={handleError}
    />
  );
};

export default function Home() {
  const [selectedGender, setSelectedGender] = useState('Homme');
  const [currentMenSlide, setCurrentMenSlide] = useState(0);
  const [currentWomenSlide, setCurrentWomenSlide] = useState(0);
  // Hero slide state is now handled within the HeroSection component
  const [activeGender, setActiveGender] = useState('male'); // For mobile toggle
  const [isSeeding, setIsSeeding] = useState(false);
  const { t, locale } = useTranslation();
  
  // Fetch directly from API instead of using SWR hook
  const [menProducts, setMenProducts] = useState<Product[]>([]);
  const [isLoadingMen, setIsLoadingMen] = useState(true);
  const [womenProducts, setWomenProducts] = useState<Product[]>([]);
  const [isLoadingWomen, setIsLoadingWomen] = useState(true);


  const { categories, isLoading: isLoadingCategories } = useCategories({
    featured: true,
  });

  // We'll directly fetch products instead of using the useProducts hook
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [isLoadingAll, setIsLoadingAll] = useState(true);

  // Product Display settings
  const productsPerDesktopSlide = 3; // 3 products per slide on desktop
  const productsPerMobileSlide = 2; // 2 products per slide on mobile

  // Calculate max slides for men's products
  const totalMenDesktopSlides = menProducts ? Math.ceil(menProducts.length / productsPerDesktopSlide) : 0;
  const totalMenMobileSlides = menProducts ? Math.ceil(menProducts.length / productsPerMobileSlide) : 0;

  // Calculate max slides for women's products
  const totalWomenDesktopSlides = womenProducts ? Math.ceil(womenProducts.length / productsPerDesktopSlide) : 0;
  const totalWomenMobileSlides = womenProducts ? Math.ceil(womenProducts.length / productsPerMobileSlide) : 0;

  // Hero slides and auto-advancing are now handled in the HeroSection component

  const howToOrderSteps = [
    {
      icon: <FaShoppingBag className="w-8 h-8" />,
      title: 'Choose Your Fragrance',
      description: 'Browse our collection and select your desired perfume'
    },
    {
      icon: <FaWhatsapp className="w-8 h-8" />,
      title: 'Contact Us',
      description: 'Click the WhatsApp button to place your order'
    },
    {
      icon: <FaCheck className="w-8 h-8" />,
      title: 'Receive Your Order',
      description: 'Fast delivery to your doorstep'
    }
  ];

  // Hero slide navigation is now handled within the HeroSection component

  // Updated navigation functions for product slides
  const nextProductSlide = (gender: 'men' | 'women') => {
    if (gender === 'men') {
      // For desktop: advance in groups of 3
      if (window.innerWidth >= 768) {
        const totalSlides = Math.ceil(menProducts.length / productsPerDesktopSlide);
        setCurrentMenSlide(current => (current >= totalSlides - 1 ? 0 : current + 1));
      } 
      // For mobile: advance in groups of 2
      else {
        const totalSlides = Math.ceil(menProducts.length / productsPerMobileSlide);
        setCurrentMenSlide(current => (current >= totalSlides - 1 ? 0 : current + 1));
      }
    } else {
      // Updated women's functionality to match men's
      if (window.innerWidth >= 768) {
        const totalSlides = Math.ceil(womenProducts.length / productsPerDesktopSlide);
        setCurrentWomenSlide(current => (current >= totalSlides - 1 ? 0 : current + 1));
      } else {
        const totalSlides = Math.ceil(womenProducts.length / productsPerMobileSlide);
        setCurrentWomenSlide(current => (current >= totalSlides - 1 ? 0 : current + 1));
      }
    }
  };

  const prevProductSlide = (gender: 'men' | 'women') => {
    if (gender === 'men') {
      // For desktop: go back in groups of 3
      if (window.innerWidth >= 768) {
        const totalSlides = Math.ceil(menProducts.length / productsPerDesktopSlide);
        setCurrentMenSlide(current => (current <= 0 ? totalSlides - 1 : current - 1));
      }
      // For mobile: go back in groups of 2
      else {
        const totalSlides = Math.ceil(menProducts.length / productsPerMobileSlide);
        setCurrentMenSlide(current => (current <= 0 ? totalSlides - 1 : current - 1));
      }
    } else {
      // Updated women's functionality to match men's
      if (window.innerWidth >= 768) {
        const totalSlides = Math.ceil(womenProducts.length / productsPerDesktopSlide);
        setCurrentWomenSlide(current => (current <= 0 ? totalSlides - 1 : current - 1));
      } else {
        const totalSlides = Math.ceil(womenProducts.length / productsPerMobileSlide);
        setCurrentWomenSlide(current => (current <= 0 ? totalSlides - 1 : current - 1));
      }
    }
  };

  // Remove touch swipe support for now to avoid TypeScript errors
  useEffect(() => {
    // Will be implemented if needed
  }, []);

  // Log products for debugging
  useEffect(() => {
    if (!isLoadingMen) {
      console.log(`Fetched Homme category products: ${menProducts?.length || 0}`);
      
      if (menProducts?.length > 0) {
        // Log all products with details to check the data
        menProducts.forEach((product: Product, index: number) => {
          console.log(`Homme product ${index + 1}:`, {
            id: product._id,
            name: product.name,
            gender: product.gender,
            category: product.category,
            price: product.price,
            hasImages: !!product.images?.length,
            firstImage: product.images?.[0] || 'No image',
            allImages: product.images || []
          });
        });
        
        // Check all unique genders among men's products
        if (menProducts.length > 1) {
          const genders = [...new Set(menProducts.map((p: Product) => p.gender))];
          console.log('Homme products genders:', genders);
        }
      } else {
        console.log('No products found in Homme category');
      }
    }
  }, [menProducts, isLoadingMen]);

  // Additional debugging to list all products
  useEffect(() => {
    if (!isLoadingAll && allProducts) {
      console.log(`Total products in database: ${allProducts.length}`);
      
      // Count products by gender
      const genderCounts = allProducts.reduce((acc: Record<string, number>, product: Product) => {
        const gender = product.gender || 'unspecified';
        acc[gender] = (acc[gender] || 0) + 1;
        return acc;
      }, {});
      console.log('Products by gender:', genderCounts);
      
      // Count products by category
      const categoryCounts = allProducts.reduce((acc: Record<string, number>, product: Product) => {
        const category = product.category || 'unspecified';
        acc[category] = (acc[category] || 0) + 1;
        return acc;
      }, {});
      console.log('Products by category:', categoryCounts);
      
      // List first 5 products with detailed info
      if (allProducts.length > 0) {
        console.log('First 5 products:');
        allProducts.slice(0, 5).forEach((product: Product, index: number) => {
          console.log(`Product ${index + 1}:`, {
            id: product._id,
            name: product.name,
            gender: product.gender,
            category: product.category
          });
        });
      }
    }
  }, [allProducts, isLoadingAll]);

  // Function to seed test data when no products are found
  const seedTestData = async () => {
    setIsSeeding(true);
    try {
      const response = await fetch('/api/seed-test-data');
      const data = await response.json();
      if (data.success) {
        console.log('Successfully seeded test data:', data);
        // Reload the page to fetch new data
        window.location.reload();
      } else {
        console.error('Failed to seed test data:', data);
        alert('Failed to add test products. Please try again later.');
      }
    } catch (error) {
      console.error('Error seeding test data:', error);
      alert('An error occurred while adding test products.');
    } finally {
      setIsSeeding(false);
    }
  };

  // Fetch products from the API for the home page
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // Fetch men's products
        setIsLoadingMen(true);
        console.log('Fetching Homme products by gender...');
        const menResponse = await fetch('/api/products?gender=Homme&limit=6', {
          cache: 'no-store',
          headers: {
            'Cache-Control': 'no-cache'
          }
        });
        const menData = await menResponse.json();
        
        // Process men's products
        if (menData.success && Array.isArray(menData.data)) {
          // Use the actual images from the database
          const menProductsWithImages = menData.data.map((product: Product) => {
            // If product has no images, use placeholder
            if (!product.images || product.images.length === 0) {
              return {
                ...product,
                images: ['/images/product-placeholder.svg']
              };
            }
            return product;
          });
          
          console.log(`Found ${menProductsWithImages.length} Homme products`);
          if (menProductsWithImages.length > 0) {
            console.log('Example men product:', menProductsWithImages[0]);
          }
          
          // If no products found, use fallback data
          if (menProductsWithImages.length === 0) {
            console.log('No Homme products found, using fallback data');
            setMenProducts([
              {
                _id: 'sample1',
                name: 'Homme Classic',
                description: 'A sophisticated fragrance for the modern man',
                price: 299,
                volume: '100ml',
                gender: 'Homme',
                category: 'Homme',
                images: ['/images/product-placeholder.svg']
              },
              {
                _id: 'sample2',
                name: 'Homme Sport',
                description: 'An energetic scent for active lifestyles',
                price: 250,
                volume: '50ml',
                gender: 'Homme',
                category: 'Homme',
                images: ['/images/product-placeholder.svg']
              },
              {
                _id: 'sample3',
                name: 'Homme Elegance',
                description: 'A distinguished fragrance with woody notes',
                price: 350,
                volume: '100ml',
                gender: 'Homme',
                category: 'Homme',
                images: ['/images/product-placeholder.svg']
              }
            ]);
          } else {
            setMenProducts(menProductsWithImages);
          }
        } else {
          console.error('API response format error for men products:', menData);
          // Fallback to sample products if API fails
          setMenProducts([
            {
              _id: 'sample1',
              name: 'Homme Classic',
              description: 'A sophisticated fragrance for the modern man',
              price: 299,
              volume: '100ml',
              gender: 'Homme',
              category: 'Homme',
              images: ['/images/product-placeholder.svg']
            },
            {
              _id: 'sample2',
              name: 'Homme Sport',
              description: 'An energetic scent for active lifestyles',
              price: 250,
              volume: '50ml',
              gender: 'Homme',
              category: 'Homme',
              images: ['/images/product-placeholder.svg']
            },
            {
              _id: 'sample3',
              name: 'Homme Elegance',
              description: 'A distinguished fragrance with woody notes',
              price: 350,
              volume: '100ml',
              gender: 'Homme',
              category: 'Homme',
              images: ['/images/product-placeholder.svg']
            }
          ]);
        }
        setIsLoadingMen(false);
        
        // Fetch women's products
        setIsLoadingWomen(true);
        console.log('Fetching Femme products by gender...');
        const womenResponse = await fetch('/api/products?gender=Femme&limit=6', {
          cache: 'no-store',
          headers: {
            'Cache-Control': 'no-cache'
          }
        });
        const womenData = await womenResponse.json();
        
        // Process women's products
        if (womenData.success && Array.isArray(womenData.data)) {
          // Use the actual images from the database
          const womenProductsWithImages = womenData.data.map((product: Product) => {
            // If product has no images, use placeholder
            if (!product.images || product.images.length === 0) {
              return {
                ...product,
                images: ['/images/product-placeholder.svg']
              };
            }
            return product;
          });
          
          console.log(`Found ${womenProductsWithImages.length} Femme products`);
          if (womenProductsWithImages.length > 0) {
            console.log('Example women product:', womenProductsWithImages[0]);
          }
          
          // If no products found, use fallback data
          if (womenProductsWithImages.length === 0) {
            console.log('No Femme products found, using fallback data');
            setWomenProducts([
              {
                _id: 'sample-f1',
                name: 'Femme Classic',
                description: 'A sophisticated fragrance for the modern woman',
                price: 299,
                volume: '100ml',
                gender: 'Femme',
                category: 'Femme',
                images: ['/images/product-placeholder.svg']
              },
              {
                _id: 'sample-f2',
                name: 'Femme Elegance',
                description: 'An elegant scent with floral notes',
                price: 250,
                volume: '50ml',
                gender: 'Femme',
                category: 'Femme',
                images: ['/images/product-placeholder.svg']
              },
              {
                _id: 'sample-f3',
                name: 'Femme Chic',
                description: 'A distinguished fragrance with fruity notes',
                price: 350,
                volume: '100ml',
                gender: 'Femme',
                category: 'Femme',
                images: ['/images/product-placeholder.svg']
              }
            ]);
          } else {
            setWomenProducts(womenProductsWithImages);
          }
        } else {
          console.error('API response format error for women products:', womenData);
          // Fallback to sample products if API fails
          setWomenProducts([
            {
              _id: 'sample-f1',
              name: 'Femme Classic',
              description: 'A sophisticated fragrance for the modern woman',
              price: 299,
              volume: '100ml',
              gender: 'Femme',
              category: 'Femme',
              images: ['/images/product-placeholder.svg']
            },
            {
              _id: 'sample-f2',
              name: 'Femme Elegance',
              description: 'An elegant scent with floral notes',
              price: 250,
              volume: '50ml',
              gender: 'Femme',
              category: 'Femme',
              images: ['/images/product-placeholder.svg']
            },
            {
              _id: 'sample-f3',
              name: 'Femme Chic',
              description: 'A distinguished fragrance with fruity notes',
              price: 350,
              volume: '100ml',
              gender: 'Femme',
              category: 'Femme',
              images: ['/images/product-placeholder.svg']
            }
          ]);
        }
        setIsLoadingWomen(false);
        
        // Also fetch all products for debugging
        setIsLoadingAll(true);
        const allResponse = await fetch('/api/products?limit=100', {
          cache: 'no-store',
          headers: {
            'Cache-Control': 'no-cache'
          }
        });
        const allData = await allResponse.json();
        if (allData.success && Array.isArray(allData.data)) {
          setAllProducts(allData.data);
        }
        setIsLoadingAll(false);
        
      } catch (error) {
        console.error('Error fetching products:', error);
        // Set fallback products for both genders
        setMenProducts([
          {
            _id: 'fallback-m1',
            name: 'Homme Classic',
            description: 'A sophisticated fragrance for the modern man',
            price: 299,
            volume: '100ml',
            gender: 'Homme',
            category: 'Homme',
            images: ['/images/product-placeholder.svg']
          },
          {
            _id: 'fallback-m2',
            name: 'Homme Sport',
            description: 'An energetic scent for active lifestyles',
            price: 250,
            volume: '50ml',
            gender: 'Homme',
            category: 'Homme',
            images: ['/images/product-placeholder.svg']
          },
          {
            _id: 'fallback-m3',
            name: 'Homme Elegance',
            description: 'A distinguished fragrance with woody notes',
            price: 350,
            volume: '100ml',
            gender: 'Homme',
            category: 'Homme',
            images: ['/images/product-placeholder.svg']
          }
        ]);
        
        setWomenProducts([
          {
            _id: 'fallback-f1',
            name: 'Femme Classic',
            description: 'A sophisticated fragrance for the modern woman',
            price: 299,
            volume: '100ml',
            gender: 'Femme',
            category: 'Femme',
            images: ['/images/product-placeholder.svg']
          },
          {
            _id: 'fallback-f2',
            name: 'Femme Elegance',
            description: 'An elegant scent with floral notes',
            price: 250,
            volume: '50ml',
            gender: 'Femme',
            category: 'Femme',
            images: ['/images/product-placeholder.svg']
          },
          {
            _id: 'fallback-f3',
            name: 'Femme Chic',
            description: 'A distinguished fragrance with fruity notes',
            price: 350,
            volume: '100ml',
            gender: 'Femme',
            category: 'Femme',
            images: ['/images/product-placeholder.svg']
          }
        ]);
      } finally {
        setIsLoadingMen(false);
        setIsLoadingWomen(false);
      }
    };
    
    fetchProducts();
  }, []);

  // Simplified but reliable product image component
  const SimpleProductImage = ({ product }: { product: Product }) => {
    // Use the first product image if available, otherwise use placeholder
    const imageUrl = product.images && product.images.length > 0 ? product.images[0] : '/images/product-placeholder.svg';
    
    return (
      <div 
        className="aspect-square relative mb-3 bg-gray-50 rounded-lg overflow-hidden shadow-sm"
        style={{
          backgroundImage: `url('${imageUrl}')`,
          backgroundSize: "contain",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          width: "100%",
          height: "100%"
        }}
      />
    );
  };

  // Add a debug function to check what's happening with men's products
  useEffect(() => {
    if (!isLoadingMen) {
      console.log('Men products state updated:', {
        count: menProducts?.length || 0,
        isArray: Array.isArray(menProducts),
        isEmpty: menProducts?.length === 0,
        firstProduct: menProducts?.[0]
      });
    }
  }, [menProducts, isLoadingMen]);

  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section - Using our optimized mobile-focused component */}
      <HeroSection />

      {/* Featured Products Section */}
      <BasicProductDisplay />

      {/* Featured Collections Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-playfair text-[#c8a45d] mb-4">
              {t('home.categories.title', 'Featured Collection')}
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              {t('home.categories.subtitle', 'Discover our most popular fragrances, crafted with premium ingredients and inspired by world-renowned perfumes.')}
            </p>
          </div>
          
            {isLoadingCategories ? (
            // Loading skeleton with various sizes for desktop and mobile
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 sm:gap-5">
              {/* Large item - full width on mobile, 2x2 on desktop */}
              <div className="col-span-2 row-span-2 bg-gray-100 rounded-lg overflow-hidden shadow-sm">
                <div className="aspect-square sm:aspect-auto sm:h-full animate-pulse"></div>
              </div>
              {/* Regular items */}
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="bg-gray-100 rounded-lg overflow-hidden shadow-sm">
                  <div className="aspect-square animate-pulse"></div>
                </div>
              ))}
            </div>
            ) : categories && categories.length > 0 ? (
            // Modern mobile-first responsive layout with flex for smaller screens
            <div className="flex flex-col space-y-4 sm:space-y-0 sm:grid sm:grid-cols-3 lg:grid-cols-4 sm:gap-5">
              {/* Featured large item */}
              <div className="sm:col-span-2 sm:row-span-2">
                <Link 
                  href={`/shop?category=${encodeURIComponent(categories[0]?.name || '')}`}
                  className="group relative bg-white rounded-lg overflow-hidden shadow-sm transition-transform hover:shadow-md hover:-translate-y-1 h-full block"
                >
                  <div className="aspect-square sm:aspect-auto sm:h-full relative">
                    <Image
                      src={categories[0]?.image || `/images/categories/default.svg`}
                      alt={categories[0]?.name || 'Featured Collection'}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 66vw, 50vw"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = '/images/categories/default.svg';
                      }}
                    />
                  </div>
                  <div className="absolute top-4 right-4 bg-[#c8a45d] text-white text-xs font-medium px-2.5 py-1.5 rounded-full">
                    {categories[0]?.productCount || 15}
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-black/70 to-transparent text-white">
                    <h3 className="font-playfair text-xl sm:text-2xl mb-1">
                      {categories[0]?.name || 'Collection'}
                    </h3>
                    <p className="text-sm text-white/80">
                      {categories[0]?.name === 'Femme' ? 'Women Perfumes' : 
                       categories[0]?.name === 'Homme' ? 'Men Perfumes' :
                       categories[0]?.name === 'Unisexe' ? 'Unisex Perfumes' :
                       categories[0]?.name === 'Deluxe Studio' ? 'Premium Collection' :
                       'Fragrances'}
                    </p>
                  </div>
                </Link>
              </div>
              
              {/* Mobile-optimized grid for regular items */}
              <div className="grid grid-cols-2 gap-4 sm:contents">
                {categories.slice(1, 5).map((category: Category) => (
                  <Link 
                    key={category._id}
                    href={`/shop?category=${encodeURIComponent(category.name)}`}
                    className="group relative bg-white rounded-lg overflow-hidden shadow-sm transition-transform hover:shadow-md hover:-translate-y-1 block"
                  >
                    <div className="aspect-square relative">
                      <Image
                        src={category.image || `/images/categories/${category.slug}.svg`}
                        alt={category.name}
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 40vw, (max-width: 1024px) 33vw, 25vw"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = '/images/categories/default.svg';
                        }}
                      />
                    </div>
                    <div className="absolute top-3 right-3 bg-[#c8a45d] text-white text-xs font-medium px-2 py-1 rounded-full">
                      {category.productCount || 15}
                    </div>
                    <div className="p-3 sm:p-4 text-center">
                      <h3 className="font-playfair text-sm sm:text-xl text-gray-800 mb-0 sm:mb-1 line-clamp-1">
                        {category.name}
                      </h3>
                      <p className="text-xs sm:text-sm text-gray-600 hidden sm:block">
                        {category.name === 'Femme' ? 'Women Perfumes' : 
                         category.name === 'Homme' ? 'Men Perfumes' :
                         category.name === 'Unisexe' ? 'Unisex Perfumes' :
                         category.name === 'Deluxe Studio' ? 'Premium Collection' :
                         'Fragrances'}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
                <p className="text-gray-500">No featured categories found.</p>
                <p className="text-sm text-gray-400 mt-2">
                  Check back soon for our featured collection.
                </p>
              </div>
            )}
          
          <div className="text-center mt-12">
            <Link 
              href="/shop" 
              className="inline-block px-10 py-3 border border-black text-sm uppercase tracking-wide hover:bg-black hover:text-white transition"
            >
              {t('home.categories.viewAll', 'View All Collections')}
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section - Now moved to be above the About section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-playfair text-[#c8a45d] mb-4">
              {t('home.features.title', 'Why Choose Us')}
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: t('home.features.quality.title', 'Premium Quality'),
                description: t('home.features.quality.description', 'High-quality ingredients for long-lasting fragrance'),
                icon: <FaCrown className="w-8 h-8 text-[#c8a45d]" />
              },
              {
                title: t('home.features.shipping.title', 'Fast Shipping'),
                description: t('home.features.shipping.description', 'Shipping throughout Morocco'),
                icon: <FaTruck className="w-8 h-8 text-[#c8a45d]" />
              },
              {
                title: t('home.features.price.title', 'Affordable Prices'),
                description: t('home.features.price.description', 'Luxury at accessible prices'),
                icon: <FaMoneyBillWave className="w-8 h-8 text-[#c8a45d]" />
              }
            ].map((feature, index) => (
              <div
                key={index}
                className="flex flex-col items-center text-center p-8 bg-white rounded-xl shadow-sm border border-gray-100 transition-transform hover:-translate-y-1 hover:shadow-md"
              >
                <div className="w-16 h-16 rounded-full flex items-center justify-center bg-[#f9f5eb] mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-playfair text-gray-800 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-12 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          {/* Mobile Title - Centered on mobile only */}
          <h2 className="font-playfair text-3xl text-[#c8a45d] mb-6 text-center lg:hidden">
            {t('header.about', 'About AVANA PARFUM')}
          </h2>
          
          {/* Mobile Layout */}
          <div className="lg:hidden">
            {/* Text */}
            <div className="mb-6">
              <p className="text-gray-600 text-base leading-relaxed">
                At AVANA PARFUM, we believe that luxury fragrances should be accessible to everyone. 
                Our collection features premium quality inspired perfumes that capture the essence 
                of world-renowned fragrances.
              </p>
            </div>
            
            {/* Image */}
            <div className="mt-2 mb-8">
              <div className="relative bg-[#e6d5ba] rounded-3xl overflow-hidden">
                <div className="aspect-[4/3] w-full">
                  <div className="absolute inset-0">
                    <Image
                      src="/images/about-avana.jpg"
                      alt="AVANA PARFUM luxury perfume bottle with golden liquid"
                      fill
                      className="object-cover object-center scale-110"
                      sizes="100vw"
                      priority
                      quality={100}
                    />
                  </div>
                </div>
              </div>
            </div>
            
            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 mb-8 max-w-md mx-auto">
              <div className="text-center bg-gray-50 p-3 rounded-lg shadow-sm">
                <h3 className="text-2xl font-playfair text-[#c8a45d] mb-1">100+</h3>
                <p className="text-gray-600 text-sm">{t('about.stats.fragrances', 'Unique Fragrances')}</p>
              </div>
              <div className="text-center bg-gray-50 p-3 rounded-lg shadow-sm">
                <h3 className="text-2xl font-playfair text-[#c8a45d] mb-1">10k+</h3>
                <p className="text-gray-600 text-sm">{t('about.stats.customers', 'Happy Customers')}</p>
              </div>
            </div>
            
            {/* Button */}
            <div className="text-center">
              <Link
                href="/about"
                className="inline-flex items-center px-6 py-2 bg-[#c8a45d] text-white rounded-full hover:bg-[#c8a45d]/90 transition-colors text-sm"
              >
                {t('about.learnMore', 'Learn More')}
                <svg
                  className="ml-2 w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </Link>
            </div>
          </div>
          
          {/* Desktop Layout - Original side-by-side design */}
          <div className="hidden lg:grid lg:grid-cols-2 lg:gap-16 lg:items-center">
            {/* Image Column */}
            <div className="order-1">
              <div className="relative bg-[#e6d5ba] rounded-3xl overflow-hidden">
                <div className="aspect-[4/5] w-full">
                  <div className="absolute inset-0">
                    <Image
                      src="/images/about-avana.jpg"
                      alt="AVANA PARFUM luxury perfume bottle with golden liquid"
                      fill
                      className="object-cover object-center scale-110"
                      sizes="(max-width: 1200px) 50vw, 33vw"
                      priority
                      quality={100}
                    />
                  </div>
                </div>
              </div>
            </div>
            
            {/* Content Column */}
            <div className="order-2">
              <h2 className="font-playfair text-5xl text-[#c8a45d] mb-8">
                {t('header.about', 'About AVANA PARFUM')}
              </h2>
              <div className="space-y-6">
                <p className="text-gray-600 text-lg leading-relaxed">
                  {t('about.description.part1', 'At AVANA PARFUM, we believe that luxury fragrances should be accessible to everyone. Our collection features premium quality inspired perfumes that capture the essence of world-renowned fragrances.')}
                </p>
                <p className="text-gray-600 text-lg leading-relaxed">
                  {t('about.description.part2', 'Each fragrance is meticulously crafted using the finest ingredients, ensuring a long-lasting scent that makes a lasting impression. We take pride in offering you an exceptional olfactory experience at a fraction of the price.')}
                </p>
                
                <div className="grid grid-cols-2 gap-8 pt-8">
                  <div className="text-center">
                    <h3 className="text-4xl font-playfair text-[#c8a45d] mb-2">100+</h3>
                    <p className="text-gray-600">{t('about.stats.fragrances', 'Unique Fragrances')}</p>
                  </div>
                  <div className="text-center">
                    <h3 className="text-4xl font-playfair text-[#c8a45d] mb-2">10k+</h3>
                    <p className="text-gray-600">{t('about.stats.customers', 'Happy Customers')}</p>
                  </div>
                </div>
                
                <div className="pt-8">
                  <Link
                    href="/about"
                    className="inline-flex items-center px-8 py-3 bg-[#c8a45d] text-white rounded-full hover:bg-[#c8a45d]/90 transition-colors"
                  >
                    {t('about.learnMore', 'Learn More')}
                    <svg
                      className="ml-2 w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How to Order */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-4xl font-playfair text-[#c8a45d] mb-4">
              {t('home.howToOrder.title', 'How to Order')}
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              {t('home.howToOrder.subtitle', 'Simple steps to get your favorite fragrance delivered to your doorstep')}
            </p>
          </div>
          
          {/* Steps - Desktop Version */}
          <div className="hidden md:block">
            <div className="relative">
              {/* Progress Line */}
              <div className="absolute top-1/4 left-0 right-0 h-1 bg-[#e6d5ba]"></div>
              
              {/* Arrows - positioned above the line */}
              <div className="absolute top-1/4 left-[20.5%] transform -translate-y-1/2 -translate-x-1/2 z-20 bg-white rounded-full p-1">
                <FaArrowRight className="text-[#c8a45d] w-5 h-5" />
              </div>
              <div className="absolute top-1/4 left-[45.5%] transform -translate-y-1/2 -translate-x-1/2 z-20 bg-white rounded-full p-1">
                <FaArrowRight className="text-[#c8a45d] w-5 h-5" />
              </div>
              <div className="absolute top-1/4 left-[70.5%] transform -translate-y-1/2 -translate-x-1/2 z-20 bg-white rounded-full p-1">
                <FaArrowRight className="text-[#c8a45d] w-5 h-5" />
              </div>

              {/* Steps */}
              <div className="grid grid-cols-4 gap-6 relative z-10">
                {[
                  {
                    icon: <FaShoppingBag className="w-10 h-10 text-[#c8a45d]" />,
                    title: t('home.howToOrder.steps.choose.title', 'Browse Collection'),
                    description: t('home.howToOrder.steps.choose.description', 'Explore our wide range of luxury inspired fragrances')
              },
              {
                    icon: <FaWhatsapp className="w-10 h-10 text-[#c8a45d]" />,
                    title: t('home.howToOrder.steps.contact.title', 'Place Your Order'),
                    description: t('home.howToOrder.steps.contact.description', 'Message us on WhatsApp and complete the order form')
              },
              {
                    icon: <FaPhone className="w-10 h-10 text-[#c8a45d]" />,
                    title: t('home.howToOrder.steps.confirm.title', 'Confirmation Call'),
                    description: t('home.howToOrder.steps.confirm.description', 'Receive a quick confirmation call to verify your order')
                  },
                  {
                    icon: <FaBox className="w-10 h-10 text-[#c8a45d]" />,
                    title: t('home.howToOrder.steps.receive.title', 'Fast Delivery'),
                    description: t('home.howToOrder.steps.receive.description', 'Your order will arrive within 3-5 business days')
                  }
                ].map((step, index) => (
                  <div key={index} className="flex flex-col items-center">
                    <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center shadow-lg mb-6 border-4 border-[#e6d5ba]">
                      {step.icon}
                    </div>
                    <div className="text-center">
                      <h3 className="text-xl font-playfair text-gray-800 mb-2">{step.title}</h3>
                      <p className="text-gray-600">{step.description}</p>
                    </div>
              </div>
            ))}
          </div>
        </div>
          </div>

          {/* Steps - Mobile Version */}
          <div className="md:hidden">
            <div className="flex flex-col space-y-8">
              {[
                {
                  icon: <FaShoppingBag className="w-6 h-6 text-white" />,
                  title: t('home.howToOrder.steps.choose.title', 'Browse Collection'),
                  description: t('home.howToOrder.steps.choose.description', 'Explore our wide range of luxury inspired fragrances')
                },
                {
                  icon: <FaWhatsapp className="w-6 h-6 text-white" />,
                  title: t('home.howToOrder.steps.contact.title', 'Place Your Order'),
                  description: t('home.howToOrder.steps.contact.description', 'Message us on WhatsApp and complete the order form')
                },
                {
                  icon: <FaPhone className="w-6 h-6 text-white" />,
                  title: t('home.howToOrder.steps.confirm.title', 'Confirmation Call'),
                  description: t('home.howToOrder.steps.confirm.description', 'Receive a quick confirmation call to verify your order')
                },
                {
                  icon: <FaBox className="w-6 h-6 text-white" />,
                  title: t('home.howToOrder.steps.receive.title', 'Fast Delivery'),
                  description: t('home.howToOrder.steps.receive.description', 'Your order will arrive within 3-5 business days')
                }
              ].map((step, index) => (
                <div key={index} className="flex items-start">
                  <div className="w-14 h-14 rounded-full bg-[#c8a45d] flex-shrink-0 flex items-center justify-center shadow-md mr-4">
                  {step.icon}
                  </div>
                  <div>
                    <h3 className="text-lg font-playfair text-gray-800 mb-1">{index + 1}. {step.title}</h3>
                    <p className="text-gray-600 text-sm">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
              </div>
          
          {/* Call to Action */}
          <div className="text-center mt-12 md:mt-16">
            <a
              href="https://wa.me/+212XXXxxxXXX?text=Hello, I would like to place an order."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-8 py-3 bg-[#c8a45d] text-white rounded-full hover:bg-[#c8a45d]/90 transition-colors shadow-sm"
            >
              {t('home.howToOrder.orderButton', 'Order on WhatsApp')}
              <FaWhatsapp className="ml-2 w-5 h-5" />
            </a>
          </div>
        </div>
      </section>

      {/* WhatsApp Button */}
      <WhatsAppButton />

      {/* Shop by Gender CTA Banner */}
      <section className="py-16 bg-[#f8f5f0] relative overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-12">
            <Link 
              href="/shop?gender=Homme" 
              className="px-10 py-4 bg-[#c8a45d] text-white rounded-full text-lg font-medium transition-transform hover:scale-105"
            >
              {t('footer.links.forHim', 'Shop Men')}
            </Link>
            <Link 
              href="/shop?gender=Femme" 
              className="px-10 py-4 border-2 border-[#c8a45d] text-[#c8a45d] bg-white rounded-full text-lg font-medium transition-transform hover:scale-105"
            >
              {t('footer.links.forHer', 'Shop Women')}
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
