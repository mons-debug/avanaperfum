'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { ProductType, CategoryType } from './page';

const ProductGridImport = () => import('@/components/ProductGrid');
const ProductGrid = dynamic(ProductGridImport, { ssr: false });

// Dynamically import all icons to prevent SSR issues
const FaFilter = dynamic(() => import('react-icons/fa').then(mod => ({ default: mod.FaFilter })), { ssr: false });
const FaTimes = dynamic(() => import('react-icons/fa').then(mod => ({ default: mod.FaTimes })), { ssr: false });
const FaChevronDown = dynamic(() => import('react-icons/fa').then(mod => ({ default: mod.FaChevronDown })), { ssr: false });
const FaSearch = dynamic(() => import('react-icons/fa').then(mod => ({ default: mod.FaSearch })), { ssr: false });
const IoGridOutline = dynamic(() => import('react-icons/io5').then(mod => ({ default: mod.IoGridOutline })), { ssr: false });
const IoList = dynamic(() => import('react-icons/io5').then(mod => ({ default: mod.IoList })), { ssr: false });

interface ShopContentProps {
  initialProducts: ProductType[];
  initialCategories: CategoryType[];
  searchParams: {
    category?: string;
    gender?: string;
    search?: string;
    sort?: string;
  };
}

export default function ShopContent({ 
  initialProducts, 
  initialCategories, 
  searchParams 
}: ShopContentProps) {
  const router = useRouter();
  
  const [products] = useState<ProductType[]>(initialProducts);
  const [categories] = useState<CategoryType[]>(initialCategories);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [filterLoading, setFilterLoading] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<CategoryType | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  // Search state
  const [searchQuery, setSearchQuery] = useState(searchParams.search || '');
  const [isSearching, setIsSearching] = useState(false);
  
  // Sorting state
  const [sortBy, setSortBy] = useState(searchParams.sort || 'featured');
  
  // Active filters state
  const [activeFilters, setActiveFilters] = useState({ gender: [] as string[] });
  const categoryParam = searchParams.category;
  const genderParam = searchParams.gender;
  const searchParam = searchParams.search;
  const sortParam = searchParams.sort;
  
  // Extract unique genders from products
  const availableGenders = Array.from(new Set(products.map(p => p.gender).filter(Boolean)));
  
  // Effect to sync search with URL params
  useEffect(() => {
    setSearchQuery(searchParam || '');
  }, [searchParam]);
  
  // Effect to sync sorting with URL params
  useEffect(() => {
    setSortBy(sortParam || 'featured');
  }, [sortParam]);
  
  // Effect to sync active filters with URL params  
  useEffect(() => {
    if (genderParam) {
      setActiveFilters({ gender: genderParam.split(',').filter(Boolean) });
    } else {
      setActiveFilters({ gender: [] });
    }
  }, [genderParam]);

  // Effect to set selected category
  useEffect(() => {
    if (categoryParam) {
      const category = categories.find((cat: CategoryType) => 
        cat.name.toLowerCase() === categoryParam.toLowerCase() ||
        cat.slug === categoryParam
      );
      setSelectedCategory(category || null);
    } else {
      setSelectedCategory(null);
    }
  }, [categoryParam, categories]);

  const handleSearch = (query: string) => {
    setIsSearching(true);
    const params = new URLSearchParams();
    if (categoryParam) params.set('category', categoryParam);
    if (genderParam) params.set('gender', genderParam);
    if (sortBy !== 'featured') params.set('sort', sortBy);
    if (query.trim()) params.set('search', query.trim());
    
    const queryString = params.toString();
    router.push(`/shop${queryString ? `?${queryString}` : ''}`);
    
    // Reset searching state after a delay
    setTimeout(() => setIsSearching(false), 500);
  };

  // Handle sorting change
  const handleSortChange = (newSort: string) => {
    setSortBy(newSort);
    const params = new URLSearchParams();
    if (categoryParam) params.set('category', categoryParam);
    if (genderParam) params.set('gender', genderParam);
    if (searchParam) params.set('search', searchParam);
    if (newSort !== 'featured') params.set('sort', newSort);
    
    const queryString = params.toString();
    router.push(`/shop${queryString ? `?${queryString}` : ''}`);
  };

  // Real-time search with debouncing
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchQuery !== (searchParam || '')) {
        handleSearch(searchQuery);
      }
    }, 300); // 300ms debounce

    return () => clearTimeout(timeoutId);
  }, [searchQuery, searchParam, categoryParam, genderParam]);

  const toggleGenderFilter = (gender: string) => {
    const newGenders = activeFilters.gender.includes(gender)
      ? activeFilters.gender.filter(g => g !== gender)
      : [...activeFilters.gender, gender];
    
    const params = new URLSearchParams();
    if (categoryParam) params.set('category', categoryParam);
    if (newGenders.length > 0) params.set('gender', newGenders.join(','));
    if (searchParam) params.set('search', searchParam);
    if (sortBy !== 'featured') params.set('sort', sortBy);
    
    const queryString = params.toString();
    router.push(`/shop${queryString ? `?${queryString}` : ''}`);
  };

  const resetFilters = () => {
    setSearchQuery('');
    setSortBy('featured');
    router.push('/shop');
  };

  const clearSearch = () => {
    setSearchQuery('');
    const params = new URLSearchParams();
    if (categoryParam) params.set('category', categoryParam);
    if (genderParam) params.set('gender', genderParam);
    if (sortBy !== 'featured') params.set('sort', sortBy);
    
    const queryString = params.toString();
    router.push(`/shop${queryString ? `?${queryString}` : ''}`);
  };

  // Sort products based on selected option
  const sortProducts = (productsToSort: ProductType[]) => {
    const sortedProducts = [...productsToSort];
    
    switch (sortBy) {
      case 'newest':
        // Sort by creation date (newest first)
        return sortedProducts.sort((a, b) => {
          const dateA = new Date(a.createdAt || 0);
          const dateB = new Date(b.createdAt || 0);
          return dateB.getTime() - dateA.getTime();
        });
        
      case 'oldest':
        // Sort by creation date (oldest first)
        return sortedProducts.sort((a, b) => {
          const dateA = new Date(a.createdAt || 0);
          const dateB = new Date(b.createdAt || 0);
          return dateA.getTime() - dateB.getTime();
        });
        
      case 'price-low':
        // Sort by price (low to high)
        return sortedProducts.sort((a, b) => a.price - b.price);
        
      case 'price-high':
        // Sort by price (high to low)
        return sortedProducts.sort((a, b) => b.price - a.price);
        
      case 'name-az':
        // Sort alphabetically A-Z
        return sortedProducts.sort((a, b) => a.name.localeCompare(b.name, 'fr'));
        
      case 'name-za':
        // Sort alphabetically Z-A
        return sortedProducts.sort((a, b) => b.name.localeCompare(a.name, 'fr'));
        
      case 'featured':
      default:
        // Default order (featured products first, then by creation date)
        return sortedProducts.sort((a, b) => {
          // Featured products first
          const featuredA = a.featured || false;
          const featuredB = b.featured || false;
          
          if (featuredA && !featuredB) return -1;
          if (!featuredA && featuredB) return 1;
          
          // Then by creation date (newest first)
          const dateA = new Date(a.createdAt || 0);
          const dateB = new Date(b.createdAt || 0);
          return dateB.getTime() - dateA.getTime();
        });
    }
  };

  // Filter products based on active filters
  const filteredProducts = products.filter(product => {
    // Search filter
    if (searchParam) {
      const searchTerm = searchParam.toLowerCase();
      const matchesSearch = 
        product.name.toLowerCase().includes(searchTerm) ||
        product.category.toLowerCase().includes(searchTerm) ||
        (product.inspiredBy && product.inspiredBy.toLowerCase().includes(searchTerm));
      if (!matchesSearch) return false;
    }
    
    // Category filter
    if (categoryParam && selectedCategory) {
      if (product.category.toLowerCase() !== selectedCategory.name.toLowerCase()) {
        return false;
      }
    }
    
    // Gender filter
    if (activeFilters.gender.length > 0 && !activeFilters.gender.includes(product.gender)) {
      return false;
    }
    
    return true;
  });

  // Apply sorting to filtered products
  const sortedAndFilteredProducts = sortProducts(filteredProducts);

  return (
    <div className="min-h-screen pt-[120px] pb-16">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-playfair text-gray-800 mb-4">
            Boutique
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Découvrez notre collection exclusive de parfums inspirés des plus grandes fragrances du monde
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Desktop Sidebar */}
          <div className="hidden lg:block w-64 flex-shrink-0">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sticky top-32">
              
              {/* Enhanced Search */}
              <div className="relative mb-6">
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Rechercher des produits..."
                    className="w-full pl-10 pr-10 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#c8a45d]/20 focus:border-[#c8a45d] transition-all"
                  />
                  <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  
                  {/* Clear search button */}
                  {searchQuery && (
                    <button
                      onClick={clearSearch}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <FaTimes size={14} />
                    </button>
                  )}
                  
                  {/* Search loading indicator */}
                  {isSearching && (
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <div className="w-4 h-4 border-2 border-[#c8a45d] border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  )}
                </div>
                
                {/* Search results indicator */}
                {searchQuery && (
                  <div className="mt-2 text-xs text-gray-500">
                    {isSearching ? 'Recherche en cours...' : `${sortedAndFilteredProducts.length} résultat${sortedAndFilteredProducts.length !== 1 ? 's' : ''} trouvé${sortedAndFilteredProducts.length !== 1 ? 's' : ''}`}
                  </div>
                )}
              </div>
              
              {/* Categories */}
              <div className="mb-6">
                <h3 className="text-lg font-playfair text-gray-800 mb-3">Catégories</h3>
                <div className="space-y-2">
                  <button
                    onClick={() => {
                      setFilterLoading('all');
                      const params = new URLSearchParams();
                      if (genderParam) params.set('gender', genderParam);
                      if (searchParam) params.set('search', searchParam);
                      router.push(`/shop${params.toString() ? `?${params.toString()}` : ''}`);
                      setTimeout(() => setFilterLoading(null), 1000);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-md transition-colors flex items-center justify-between ${
                      !categoryParam 
                        ? 'bg-[#c8a45d] text-white' 
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <span>Tous les produits</span>
                    {filterLoading === 'all' && (
                      <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                    )}
                  </button>
                  {categories.map((category) => (
                    <button
                      key={category._id}
                      onClick={() => {
                        setFilterLoading(category._id);
                        const params = new URLSearchParams();
                        if (genderParam) params.set('gender', genderParam);
                        if (searchQuery) params.set('search', searchQuery);
                        router.push(`/shop?category=${encodeURIComponent(category.name)}${params.toString() ? `&${params.toString()}` : ''}`);
                        setTimeout(() => setFilterLoading(null), 1000);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-md transition-colors flex items-center justify-between ${
                        selectedCategory?.name === category.name
                          ? 'bg-[#c8a45d] text-white' 
                          : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      <span>{category.name}</span>
                      {filterLoading === category._id && (
                        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Gender Filter */}
              {availableGenders.length > 0 && (
                <div>
                  <h3 className="text-lg font-playfair text-gray-800 mb-3">Genre</h3>
                  <div className="space-y-2">
                    {availableGenders.map((gender) => (
                      <label key={gender} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={activeFilters.gender.includes(gender)}
                          onChange={() => toggleGenderFilter(gender)}
                          className="rounded border-gray-300 text-[#c8a45d] focus:ring-[#c8a45d]/20 focus:border-[#c8a45d]"
                        />
                        <span className="ml-2 text-sm text-gray-600">{gender}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Mobile/Desktop Header with filters and sorting */}
            <div className="flex justify-between items-center mb-6 bg-white rounded-lg p-4 shadow-sm border border-gray-100">
              <div className="flex items-center">
                {/* Mobile Filter Button */}
                <button 
                  onClick={() => setShowMobileFilters(true)}
                  className="lg:hidden bg-gray-50 hover:bg-gray-100 p-2 rounded-lg text-gray-700 flex items-center mr-3"
                >
                  <FaFilter size={16} className="mr-2" />
                  <span>Filtres</span>
                </button>
                
                {/* Display count */}
                <span className="text-gray-500 hidden md:inline-block">
                  {sortedAndFilteredProducts.length} produit{sortedAndFilteredProducts.length !== 1 ? 's' : ''}
                  {searchQuery && ` pour "${searchQuery}"`}
                </span>
              </div>
              
              <div className="flex items-center">
                {/* Sort Dropdown */}
                <div className="relative mr-3">
                  <select 
                    value={sortBy}
                    onChange={(e) => handleSortChange(e.target.value)}
                    className="appearance-none bg-gray-50 border border-gray-200 text-gray-700 py-2 px-4 pr-8 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#c8a45d]/20 focus:border-[#c8a45d]"
                  >
                    <option value="featured">En vedette</option>
                    <option value="newest">Plus récents</option>
                    <option value="oldest">Plus anciens</option>
                    <option value="price-low">Prix: bas à haut</option>
                    <option value="price-high">Prix: haut à bas</option>
                    <option value="name-az">Nom: A-Z</option>
                    <option value="name-za">Nom: Z-A</option>
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
            {(categoryParam || activeFilters.gender.length > 0 || genderParam || searchParam || sortBy !== 'featured') && (
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-medium text-gray-700">Filtres actifs:</h3>
                  <button 
                    onClick={resetFilters}
                    className="text-xs text-[#c8a45d] hover:text-[#b08d48] font-medium transition-colors"
                  >
                    Tout effacer
                  </button>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {/* Search filter */}
                  {searchParam && (
                    <div className="bg-gray-100 border border-gray-200 text-gray-700 py-1.5 px-3 rounded-full text-sm font-medium flex items-center">
                      <span className="mr-1">🔍</span>
                      <span>"{searchParam}"</span>
                      <button 
                        onClick={clearSearch}
                        className="ml-2 text-gray-500 hover:text-gray-700 transition-colors"
                      >
                        <FaTimes size={12} />
                      </button>
                    </div>
                  )}
                  
                  {/* Sort filter */}
                  {sortBy !== 'featured' && (
                    <div className="bg-gray-100 border border-gray-200 text-gray-700 py-1.5 px-3 rounded-full text-sm font-medium flex items-center">
                      <span className="mr-1">📊</span>
                      <span>
                        {sortBy === 'newest' && 'Plus récents'}
                        {sortBy === 'oldest' && 'Plus anciens'}
                        {sortBy === 'price-low' && 'Prix croissant'}
                        {sortBy === 'price-high' && 'Prix décroissant'}
                        {sortBy === 'name-az' && 'Nom A-Z'}
                        {sortBy === 'name-za' && 'Nom Z-A'}
                      </span>
                      <button 
                        onClick={() => handleSortChange('featured')}
                        className="ml-2 text-gray-500 hover:text-gray-700 transition-colors"
                      >
                        <FaTimes size={12} />
                      </button>
                    </div>
                  )}
                  
                  {/* Category filter */}
                  {categoryParam && selectedCategory && (
                    <div className="bg-gray-100 border border-gray-200 text-gray-700 py-1.5 px-3 rounded-full text-sm font-medium flex items-center">
                      <span className="mr-1">📂</span>
                      <span>{selectedCategory.name}</span>
                      <button 
                        onClick={() => {
                          const params = new URLSearchParams();
                          if (activeFilters.gender.length > 0) params.set('gender', activeFilters.gender.join(','));
                          if (searchParam) params.set('search', searchParam);
                          if (sortBy !== 'featured') params.set('sort', sortBy);
                          router.push(`/shop${params.toString() ? `?${params.toString()}` : ''}`);
                        }}
                        className="ml-2 text-gray-500 hover:text-gray-700 transition-colors"
                      >
                        <FaTimes size={12} />
                      </button>
                    </div>
                  )}
                  
                  {/* Gender filters */}
                  {(activeFilters.gender.length > 0 || genderParam) && 
                    (activeFilters.gender.length > 0 ? activeFilters.gender : [genderParam]).map(gender => (
                      gender && (
                        <div key={gender} className="bg-gray-100 border border-gray-200 text-gray-700 py-1.5 px-3 rounded-full text-sm font-medium flex items-center">
                          <span>{gender}</span>
                          <button 
                            onClick={() => {
                              if (activeFilters.gender.includes(gender)) {
                                toggleGenderFilter(gender);
                              } else {
                                const params = new URLSearchParams();
                                if (categoryParam) params.set('category', categoryParam);
                                if (searchParam) params.set('search', searchParam);
                                if (sortBy !== 'featured') params.set('sort', sortBy);
                                router.push(`/shop${params.toString() ? `?${params.toString()}` : ''}`);
                              }
                            }}
                            className="ml-2 text-gray-500 hover:text-gray-700 transition-colors"
                          >
                            <FaTimes size={12} />
                          </button>
                        </div>
                      )
                    ))
                  }
                  
                  {/* No filters message */}
                  {!categoryParam && activeFilters.gender.length === 0 && !genderParam && !searchParam && sortBy === 'featured' && (
                    <div className="text-sm text-gray-500 italic">
                      Aucun filtre appliqué
                    </div>
                  )}
                </div>
              </div>
            )}
            
            {/* No products found */}
            {sortedAndFilteredProducts.length === 0 ? (
              <div className="text-center py-16 bg-gray-50 rounded-xl border border-gray-100">
                <div className="w-20 h-20 mx-auto mb-4 flex items-center justify-center bg-gray-100 rounded-full">
                  <FaSearch className="text-gray-300" size={30} />
                </div>
                <h3 className="text-xl font-playfair text-gray-800 mb-2">Aucun produit trouvé</h3>
                <p className="text-gray-600 mb-6">
                  {searchQuery 
                    ? `Aucun produit ne correspond à "${searchQuery}". Essayez un autre terme de recherche.`
                    : 'Nous n\'avons trouvé aucun produit correspondant à vos critères.'
                  }
                </p>
                <button 
                  onClick={resetFilters}
                  className="px-6 py-2 bg-[#c8a45d] hover:bg-[#b08d48] text-white rounded-lg transition-colors"
                >
                  Réinitialiser les filtres
                </button>
              </div>
            ) : (
              /* Products Grid */
              <ProductGrid products={sortedAndFilteredProducts} viewMode={viewMode} />
            )}
          </div>
        </div>
      </div>
      
      {/* Mobile filters sidebar */}
      {showMobileFilters && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 lg:hidden">
          <div className="bg-white h-full w-80 max-w-[80%] p-5 overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-playfair text-lg text-gray-800">Filtres</h3>
              <button
                onClick={() => setShowMobileFilters(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <FaTimes size={20} />
              </button>
            </div>
            
            {/* Enhanced Mobile Search */}
            <div className="relative mb-6">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Rechercher des produits..."
                  className="w-full pl-10 pr-10 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#c8a45d]/20 focus:border-[#c8a45d] transition-all"
                />
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                
                {/* Clear search button */}
                {searchQuery && (
                  <button
                    onClick={clearSearch}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <FaTimes size={14} />
                  </button>
                )}
                
                {/* Search loading indicator */}
                {isSearching && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <div className="w-4 h-4 border-2 border-[#c8a45d] border-t-transparent rounded-full animate-spin"></div>
                  </div>
                )}
              </div>
              
              {/* Search results indicator */}
              {searchQuery && (
                <div className="mt-2 text-xs text-gray-500">
                  {isSearching ? 'Recherche en cours...' : `${sortedAndFilteredProducts.length} résultat${sortedAndFilteredProducts.length !== 1 ? 's' : ''} trouvé${sortedAndFilteredProducts.length !== 1 ? 's' : ''}`}
                </div>
              )}
            </div>
            
            {/* Mobile Gender - moved above categories */}
            <div className="mb-6">
              <h3 className="text-lg font-playfair text-gray-800 mb-3 flex items-center">
                <FaFilter className="text-[#c8a45d] mr-2" size={16} />
                Genre
              </h3>
              <div className="space-y-2">
                {availableGenders.map((gender) => (
                  <label key={gender} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={activeFilters.gender.includes(gender)}
                      onChange={() => toggleGenderFilter(gender)}
                      className="rounded border-gray-300 text-[#c8a45d] focus:ring-[#c8a45d]/20 focus:border-[#c8a45d]"
                    />
                    <span className="ml-2 text-sm text-gray-600">{gender}</span>
                  </label>
                ))}
              </div>
            </div>
            
            {/* Mobile Categories */}
            <div className="mb-6">
              <h3 className="text-lg font-playfair text-gray-800 mb-3">Catégories</h3>
              <div className="space-y-2">
                <button
                  onClick={() => {
                    const params = new URLSearchParams();
                    if (genderParam) params.set('gender', genderParam);
                    if (searchQuery) params.set('search', searchQuery);
                    if (sortBy !== 'featured') params.set('sort', sortBy);
                    router.push(`/shop${params.toString() ? `?${params.toString()}` : ''}`);
                    setShowMobileFilters(false);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-md transition-colors ${
                    !categoryParam 
                      ? 'bg-[#c8a45d] text-white' 
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  Tous les produits
                </button>
                {categories.map((category) => (
                  <button
                    key={category._id}
                    onClick={() => {
                      const params = new URLSearchParams();
                      if (genderParam) params.set('gender', genderParam);
                      if (searchQuery) params.set('search', searchQuery);
                      if (sortBy !== 'featured') params.set('sort', sortBy);
                      router.push(`/shop?category=${encodeURIComponent(category.name)}${params.toString() ? `&${params.toString()}` : ''}`);
                      setShowMobileFilters(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-md transition-colors ${
                      selectedCategory?.name === category.name
                        ? 'bg-[#c8a45d] text-white' 
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 