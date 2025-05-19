'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import ProductGrid from '@/components/ProductGrid';
import Image from 'next/image';
import { FaFilter, FaTimes, FaChevronDown, FaSearch } from 'react-icons/fa';
import { RiPriceTag3Line } from 'react-icons/ri';
import { IoGridOutline, IoList } from 'react-icons/io5';

type Product = {
  _id: string;
  name: string;
  category: string;
  gender: string;
  price: number;
  images: string[];
};

type Category = {
  _id: string;
  name: string;
  slug: string;
};

export default function ShopPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [expandedFilters, setExpandedFilters] = useState({
    categories: true,
    price: true,
    gender: true
  });
  const [activeFilters, setActiveFilters] = useState<{
    price: string[];
    gender: string[];
  }>({
    price: [],
    gender: []
  });
  
  // Get the category from query params
  const categoryParam = searchParams.get('category');
  const genderParam = searchParams.get('gender');

  // Fetch products and categories
  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      try {
        // Fetch categories
        const categoriesResponse = await fetch('/api/categories');
        const categoriesData = await categoriesResponse.json();
        
        if (categoriesData.success && categoriesData.data) {
          setCategories(categoriesData.data);
        }
        
        // Build products API URL with optional category filter
        let productsUrl = '/api/products';
        const params = new URLSearchParams();
        
        if (categoryParam) {
          params.append('category', categoryParam);
        }
        
        if (genderParam) {
          params.append('gender', genderParam);
        }
        
        if (params.toString()) {
          productsUrl += `?${params.toString()}`;
        }
        
        console.log('Fetching products from:', productsUrl);
        
        // Fetch products
        const productsResponse = await fetch(productsUrl);
        const productsData = await productsResponse.json();
        
        console.log('Products API response:', productsData);
        
        if (productsData.success && Array.isArray(productsData.data)) {
          setProducts(productsData.data);
          console.log(`Loaded ${productsData.data.length} products`);
        } else {
          console.error('Invalid products data format:', productsData);
          setProducts([]);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setProducts([]);
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchData();
  }, [categoryParam, genderParam]);

  // Get selected category
  const selectedCategory = categoryParam 
    ? categories.find(cat => cat.name === categoryParam)
    : null;

  const toggleFilter = (filterType: keyof typeof expandedFilters) => {
    setExpandedFilters(prev => ({
      ...prev,
      [filterType]: !prev[filterType]
    }));
  };

  const togglePriceFilter = (value: string) => {
    setActiveFilters(prev => {
      const currentPriceFilters = [...prev.price];
      const index = currentPriceFilters.indexOf(value);
      
      if (index >= 0) {
        currentPriceFilters.splice(index, 1);
      } else {
        currentPriceFilters.push(value);
      }
      
      return {
        ...prev,
        price: currentPriceFilters
      };
    });
  };

  const toggleGenderFilter = (value: string) => {
    setActiveFilters(prev => {
      const currentGenderFilters = [...prev.gender];
      const index = currentGenderFilters.indexOf(value);
      
      if (index >= 0) {
        currentGenderFilters.splice(index, 1);
      } else {
        currentGenderFilters.push(value);
      }
      
      return {
        ...prev,
        gender: currentGenderFilters
      };
    });
  };

  const resetFilters = () => {
    router.push('/shop');
    setActiveFilters({
      price: [],
      gender: []
    });
  };

  const FilterSection = ({ 
    title, 
    isExpanded, 
    toggleExpand, 
    children, 
    icon 
  }: { 
    title: string; 
    isExpanded: boolean; 
    toggleExpand: () => void; 
    children: React.ReactNode;
    icon: React.ReactNode;
  }) => (
    <div className="mb-8">
      <button 
        onClick={toggleExpand}
        className="flex items-center justify-between w-full text-left mb-3"
      >
        <div className="flex items-center">
          <span className="text-[#c8a45d] mr-2">{icon}</span>
          <h3 className="text-lg font-playfair text-gray-800">{title}</h3>
        </div>
        <FaChevronDown 
          className={`text-gray-500 transition-transform ${isExpanded ? 'rotate-180' : ''}`} 
        />
      </button>
      <div className={`overflow-hidden transition-all ${isExpanded ? 'max-h-96' : 'max-h-0'}`}>
        {children}
      </div>
    </div>
  );

  return (
    <main className="min-h-screen pt-[120px] pb-16">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar/Filters for Desktop */}
          <div className="hidden lg:block w-72 flex-shrink-0">
            <div className="sticky top-[140px] max-h-[calc(100vh-160px)] overflow-hidden">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-playfair text-gray-800">Filters</h2>
                  {(categoryParam || activeFilters.price.length > 0 || activeFilters.gender.length > 0) && (
                    <button 
                      onClick={resetFilters}
                      className="text-sm text-[#c8a45d] hover:text-[#b08d48] transition-colors"
                    >
                      Reset All
                    </button>
                  )}
                </div>
                
                {/* Search Input */}
                <div className="relative mb-6">
                  <input
                    type="text"
                    placeholder="Search products..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#c8a45d]/20 focus:border-[#c8a45d]"
                  />
                  <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                </div>
                
                {/* Filter sections in a scrollable container */}
                <div className="max-h-[calc(100vh-320px)] overflow-y-auto pr-1 custom-scrollbar">
                  {/* Categories Filter */}
                  <FilterSection 
                    title="Categories" 
                    isExpanded={expandedFilters.categories}
                    toggleExpand={() => toggleFilter('categories')}
                    icon={<IoGridOutline size={18} />}
                  >
                    <ul className="space-y-3 pl-1">
                <li>
                  <button 
                    onClick={() => router.push('/shop')}
                          className={`block transition-colors w-full text-left ${!categoryParam ? 'text-[#c8a45d] font-medium' : 'text-gray-600 hover:text-[#c8a45d]'}`}
                  >
                    All Products
                  </button>
                </li>
                {categories.map((category) => (
                  <li key={category._id}>
                    <button 
                      onClick={() => router.push(`/shop?category=${encodeURIComponent(category.name)}`)}
                            className={`block transition-colors w-full text-left ${categoryParam === category.name ? 'text-[#c8a45d] font-medium' : 'text-gray-600 hover:text-[#c8a45d]'}`}
                    >
                      {category.name}
                    </button>
                  </li>
                ))}
              </ul>
                  </FilterSection>

                  {/* Price Range Filter */}
                  <FilterSection 
                    title="Price Range" 
                    isExpanded={expandedFilters.price}
                    toggleExpand={() => toggleFilter('price')}
                    icon={<RiPriceTag3Line size={18} />}
                  >
                    <div className="space-y-3 pl-1">
                      {[
                        { value: 'under-50', label: 'Under $50' },
                        { value: '50-100', label: '$50 - $100' },
                        { value: '100-200', label: '$100 - $200' },
                        { value: 'over-200', label: 'Over $200' }
                      ].map((option) => (
                        <label key={option.value} className="flex items-center cursor-pointer">
                          <div className="relative flex items-center">
                            <input 
                              type="checkbox"
                              checked={activeFilters.price.includes(option.value)}
                              onChange={() => togglePriceFilter(option.value)}
                              className="sr-only"
                            />
                            <div className={`w-5 h-5 border rounded ${activeFilters.price.includes(option.value) ? 'bg-[#c8a45d] border-[#c8a45d]' : 'border-gray-300'} flex items-center justify-center`}>
                              {activeFilters.price.includes(option.value) && (
                                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
                                </svg>
                              )}
                            </div>
                          </div>
                          <span className="ml-2 text-gray-600">{option.label}</span>
                        </label>
                      ))}
                    </div>
                  </FilterSection>
                  
                  {/* Gender Filter */}
                  <FilterSection 
                    title="Gender" 
                    isExpanded={expandedFilters.gender}
                    toggleExpand={() => toggleFilter('gender')}
                    icon={<FaFilter size={16} />}
                  >
                    <div className="space-y-3 pl-1">
                      {[
                        { value: 'Homme', label: 'Men' },
                        { value: 'Femme', label: 'Women' },
                        { value: 'Unisexe', label: 'Unisex' }
                      ].map((option) => (
                        <label key={option.value} className="flex items-center cursor-pointer">
                          <div className="relative flex items-center">
                            <input 
                              type="checkbox"
                              checked={activeFilters.gender.includes(option.value)}
                              onChange={() => toggleGenderFilter(option.value)}
                              className="sr-only"
                            />
                            <div className={`w-5 h-5 border rounded ${activeFilters.gender.includes(option.value) ? 'bg-[#c8a45d] border-[#c8a45d]' : 'border-gray-300'} flex items-center justify-center`}>
                              {activeFilters.gender.includes(option.value) && (
                                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
                                </svg>
                              )}
                            </div>
                          </div>
                          <span className="ml-2 text-gray-600">{option.label}</span>
                </label>
                      ))}
                    </div>
                  </FilterSection>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Controls Bar */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-3 mb-6 flex items-center justify-between">
              <div className="flex items-center">
                {/* Mobile Filter Button */}
              <button 
                onClick={() => setShowMobileFilters(true)}
                  className="lg:hidden bg-gray-50 hover:bg-gray-100 p-2 rounded-lg text-gray-700 flex items-center mr-3"
              >
                  <FaFilter size={16} className="mr-2" />
                  <span>Filters</span>
              </button>
                
                {/* Display count */}
                <span className="text-gray-500 hidden md:inline-block">
                  Showing {products.length} products
                </span>
              </div>
              
              <div className="flex items-center">
                {/* Sort Dropdown */}
                <div className="relative mr-3">
                  <select 
                    className="appearance-none bg-gray-50 border border-gray-200 text-gray-700 py-2 px-4 pr-8 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#c8a45d]/20 focus:border-[#c8a45d]"
                  >
                    <option value="featured">Featured</option>
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                    <option value="newest">Newest</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <FaChevronDown size={12} />
                  </div>
            </div>
            
                {/* View Switcher */}
                <div className="hidden md:flex bg-gray-50 rounded-lg p-1">
                  <button 
                    onClick={() => setViewMode('grid')}
                    className={`p-1.5 rounded ${viewMode === 'grid' ? 'bg-white shadow-sm text-[#c8a45d]' : 'text-gray-500 hover:text-gray-700'}`}
                  >
                    <IoGridOutline size={18} />
                  </button>
                  <button 
                    onClick={() => setViewMode('list')}
                    className={`p-1.5 rounded ${viewMode === 'list' ? 'bg-white shadow-sm text-[#c8a45d]' : 'text-gray-500 hover:text-gray-700'}`}
                  >
                    <IoList size={18} />
                  </button>
                </div>
              </div>
            </div>
            
            {/* Active filters display */}
            {(categoryParam || activeFilters.price.length > 0 || activeFilters.gender.length > 0) && (
              <div className="mb-6 flex flex-wrap gap-2">
                {categoryParam && selectedCategory && (
                  <div className="bg-gray-50 border border-gray-100 text-gray-700 py-1.5 px-3 rounded-full text-sm flex items-center">
                    <span>Category: {selectedCategory.name}</span>
                    <button 
                      onClick={() => router.push(
                        `/shop${activeFilters.gender.length > 0 ? `?gender=${activeFilters.gender.join(',')}` : ''}`
                      )}
                      className="ml-2 text-gray-400 hover:text-gray-700"
                    >
                      <FaTimes size={10} />
                    </button>
                  </div>
                )}
                
                {activeFilters.price.map(price => {
                  const priceLabels: Record<string, string> = {
                    'under-50': 'Under $50',
                    '50-100': '$50 - $100',
                    '100-200': '$100 - $200',
                    'over-200': 'Over $200'
                  };
                  
                  return (
                    <div key={price} className="bg-gray-50 border border-gray-100 text-gray-700 py-1.5 px-3 rounded-full text-sm flex items-center">
                      <span>Price: {priceLabels[price]}</span>
                      <button 
                        onClick={() => togglePriceFilter(price)}
                        className="ml-2 text-gray-400 hover:text-gray-700"
                      >
                        <FaTimes size={10} />
                      </button>
                    </div>
                  );
                })}
                
                {activeFilters.gender.map(gender => (
                  <div key={gender} className="bg-gray-50 border border-gray-100 text-gray-700 py-1.5 px-3 rounded-full text-sm flex items-center">
                    <span>Gender: {gender}</span>
                    <button 
                      onClick={() => toggleGenderFilter(gender)}
                      className="ml-2 text-gray-400 hover:text-gray-700"
                    >
                      <FaTimes size={10} />
                    </button>
                  </div>
                ))}
                
                <button 
                  onClick={resetFilters}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-700 py-1.5 px-3 rounded-full text-sm"
                >
                  Clear All
                </button>
              </div>
            )}
            
            {/* Loading state */}
            {isLoading ? (
              <div className="text-center py-20">
                <div className="inline-block h-10 w-10 animate-spin rounded-full border-4 border-solid border-[#c8a45d] border-r-transparent"></div>
                <p className="mt-4 text-gray-600">Loading products...</p>
              </div>
            ) : (
              <>
                {/* No products found */}
                {products.length === 0 ? (
                  <div className="text-center py-16 bg-gray-50 rounded-xl border border-gray-100">
                    <div className="w-20 h-20 mx-auto mb-4 flex items-center justify-center bg-gray-100 rounded-full">
                      <FaSearch className="text-gray-300" size={30} />
                    </div>
                    <h3 className="text-xl font-playfair text-gray-800 mb-2">No products found</h3>
                    <p className="text-gray-600 mb-6">We couldn't find any products matching your criteria.</p>
                    <button 
                      onClick={resetFilters}
                      className="px-6 py-2 bg-[#c8a45d] hover:bg-[#b08d48] text-white rounded-lg transition-colors"
                    >
                      Reset Filters
                    </button>
                  </div>
                ) : (
                  /* Products Grid */
                  <ProductGrid products={products} viewMode={viewMode} />
                )}
              </>
            )}
          </div>
        </div>
      </div>
      
      {/* Mobile filters sidebar */}
      {showMobileFilters && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 lg:hidden">
          <div className="bg-white h-full w-80 max-w-[80%] p-5 overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-playfair text-gray-800">Filters</h2>
              <button 
                onClick={() => setShowMobileFilters(false)}
                className="text-gray-400 hover:text-gray-700"
              >
                <FaTimes size={20} />
              </button>
            </div>
            
            {/* Mobile Search */}
            <div className="relative mb-6">
              <input
                type="text"
                placeholder="Search products..."
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#c8a45d]/20 focus:border-[#c8a45d]"
              />
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
            
            {/* Mobile Categories */}
            <div className="mb-6">
              <h3 className="text-lg font-playfair text-gray-800 mb-3 flex items-center">
                <IoGridOutline className="text-[#c8a45d] mr-2" size={18} />
                Categories
              </h3>
              <ul className="space-y-3 pl-1">
              <li>
                <button 
                  onClick={() => {
                    router.push('/shop');
                    setShowMobileFilters(false);
                  }}
                    className={`block w-full text-left ${!categoryParam ? 'text-[#c8a45d] font-medium' : 'text-gray-600 hover:text-[#c8a45d]'} transition-colors`}
                >
                  All Products
                </button>
              </li>
              {categories.map((category) => (
                <li key={category._id}>
                  <button 
                    onClick={() => {
                      router.push(`/shop?category=${encodeURIComponent(category.name)}`);
                      setShowMobileFilters(false);
                    }}
                      className={`block w-full text-left ${categoryParam === category.name ? 'text-[#c8a45d] font-medium' : 'text-gray-600 hover:text-[#c8a45d]'} transition-colors`}
                  >
                    {category.name}
                  </button>
                </li>
              ))}
            </ul>
            </div>
            
            {/* Mobile Price Range */}
            <div className="mb-6">
              <h3 className="text-lg font-playfair text-gray-800 mb-3 flex items-center">
                <RiPriceTag3Line className="text-[#c8a45d] mr-2" size={18} />
                Price Range
              </h3>
              <div className="space-y-3 pl-1">
                {[
                  { value: 'under-50', label: 'Under $50' },
                  { value: '50-100', label: '$50 - $100' },
                  { value: '100-200', label: '$100 - $200' },
                  { value: 'over-200', label: 'Over $200' }
                ].map((option) => (
                  <label key={option.value} className="flex items-center cursor-pointer">
                    <div className="relative flex items-center">
                      <input 
                        type="checkbox"
                        checked={activeFilters.price.includes(option.value)}
                        onChange={() => togglePriceFilter(option.value)}
                        className="sr-only"
                      />
                      <div className={`w-5 h-5 border rounded ${activeFilters.price.includes(option.value) ? 'bg-[#c8a45d] border-[#c8a45d]' : 'border-gray-300'} flex items-center justify-center`}>
                        {activeFilters.price.includes(option.value) && (
                          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
                          </svg>
                        )}
                      </div>
                    </div>
                    <span className="ml-2 text-gray-600">{option.label}</span>
              </label>
                ))}
              </div>
            </div>
            
            {/* Mobile Gender */}
            <div className="mb-6">
              <h3 className="text-lg font-playfair text-gray-800 mb-3 flex items-center">
                <FaFilter className="text-[#c8a45d] mr-2" size={16} />
                Gender
              </h3>
              <div className="space-y-3 pl-1">
                {[
                  { value: 'Homme', label: 'Men' },
                  { value: 'Femme', label: 'Women' },
                  { value: 'Unisexe', label: 'Unisex' }
                ].map((option) => (
                  <label key={option.value} className="flex items-center cursor-pointer">
                    <div className="relative flex items-center">
                      <input 
                        type="checkbox"
                        checked={activeFilters.gender.includes(option.value)}
                        onChange={() => toggleGenderFilter(option.value)}
                        className="sr-only"
                      />
                      <div className={`w-5 h-5 border rounded ${activeFilters.gender.includes(option.value) ? 'bg-[#c8a45d] border-[#c8a45d]' : 'border-gray-300'} flex items-center justify-center`}>
                        {activeFilters.gender.includes(option.value) && (
                          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
                          </svg>
                        )}
                      </div>
                    </div>
                    <span className="ml-2 text-gray-600">{option.label}</span>
              </label>
                ))}
              </div>
            </div>
            
            <div className="pt-4 border-t border-gray-200 mt-4 flex space-x-4">
              <button
                onClick={() => setShowMobileFilters(false)}
                className="flex-1 py-3 px-4 border border-gray-300 rounded-lg text-gray-700 font-medium"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  // Apply filters
                  setShowMobileFilters(false);
                }}
                className="flex-1 py-3 px-4 bg-[#c8a45d] hover:bg-[#b08d48] text-white rounded-lg font-medium transition-colors"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
