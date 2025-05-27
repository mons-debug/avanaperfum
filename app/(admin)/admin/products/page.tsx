'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FaPlus, FaEdit, FaTrash, FaSearch, FaImages, FaSync } from 'react-icons/fa';
import { useRouter } from 'next/navigation';

type Product = {
  _id: string;
  name: string;
  category: string;
  gender: string;
  volume: string;
  price: number;
  images: string[];
};

export default function AdminProductsPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

  const fetchProducts = async (showRefreshState = false) => {
    try {
      if (showRefreshState) {
        setIsRefreshing(true);
      }
      const response = await fetch('/api/products');
      
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }
      
      const data = await response.json();
      setProducts(data.data || []);
      setError('');
    } catch (err: any) {
      setError(err.message || 'An error occurred');
      console.error('Error fetching products:', err);
      setProducts([]);
    } finally {
      setIsLoading(false);
      if (showRefreshState) {
        setIsRefreshing(false);
      }
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Add refresh function
  const handleRefresh = () => {
    fetchProducts(true);
  };
  
  const handleDeleteClick = (productId: string) => {
    setShowDeleteConfirm(productId);
  };
  
  const handleDeleteCancel = () => {
    setShowDeleteConfirm(null);
  };
  
  const handleDeleteConfirm = async (productId: string) => {
    try {
      const response = await fetch(`/api/products/${productId}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete product');
      }
      
      const data = await response.json();
      
      if (data.success) {
        // Remove the product from the list
        setProducts(products.filter(product => product._id !== productId));
        setShowDeleteConfirm(null);
        
        // You could add a toast notification here
        alert('Product deleted successfully');
      } else {
        throw new Error(data.error || 'Failed to delete product');
      }
    } catch (err: any) {
      alert(`Error: ${err.message}`);
      console.error('Error deleting product:', err);
    }
  };
  
  // Get product image source
  const getProductImage = (product: Product) => {
    // Check for multiple images
    if (product.images && product.images.length > 0) {
      return product.images[0];
    }
    
    // Fallback to placeholder
    return '/images/product-placeholder.svg';
  };
  
  // Format price to display with currency symbol
  const formatPrice = (price: number | undefined) => {
    if (price === undefined) return '-';
    return `$${price.toFixed(2)}`;
  };
  
  // Filter products based on search term
  const filteredProducts = products.filter(product => {
    if (!searchTerm) return true;
    
    const term = searchTerm.toLowerCase();
    return (
      product.name.toLowerCase().includes(term) ||
      (product.category && product.category.toLowerCase().includes(term)) ||
      (product.gender && product.gender.toLowerCase().includes(term))
    );
  });

  return (
    <div className="container mx-auto px-4">
      {/* Header - Mobile Responsive */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h1 className="text-2xl font-bold">Gestion des Produits</h1>
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="flex items-center justify-center gap-2 px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 flex-grow sm:flex-grow-0"
          >
            <FaSync className={`${isRefreshing ? 'animate-spin' : ''}`} />
            {isRefreshing ? 'Actualisation...' : 'Actualiser'}
          </button>
          <Link
            href="/admin/products/new"
            className="flex items-center justify-center gap-2 px-4 py-3 bg-[#c8a45d] text-white rounded-lg hover:bg-[#b08d48] transition-colors flex-grow sm:flex-grow-0"
          >
            <FaPlus /> Ajouter un produit
          </Link>
        </div>
      </div>
      
      {/* Search - Mobile Optimized */}
      <div className="mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Rechercher des produits..."
            className="w-full px-10 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#c8a45d] text-base"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        </div>
      </div>

      {error && (
        <div className="bg-red-50 text-red-500 p-4 rounded-lg mb-6">
          Erreur: {error}
        </div>
      )}

      {isLoading ? (
        <div className="text-center py-12">
          <div className="inline-block h-10 w-10 animate-spin rounded-full border-4 border-solid border-[#c8a45d] border-r-transparent"></div>
          <p className="mt-2 text-gray-600">Chargement des produits...</p>
        </div>
      ) : (
        <>
          {filteredProducts.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <p className="text-gray-600">Aucun produit trouvé.</p>
              <Link 
                href="/admin/products/new"
                className="inline-block mt-4 text-[#c8a45d] hover:text-[#b08d48]"
              >
                Ajouter votre premier produit
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredProducts.map((product) => (
                <div key={product._id} className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
                  {/* Product Image Header */}
                  <div className="relative aspect-video w-full">
                    <Image
                      src={getProductImage(product)}
                      alt={product.name}
                      fill
                      className="object-cover"
                      loading="lazy"
                      placeholder="blur"
                      blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/images/product-placeholder.svg';
                      }}
                    />
                    <div className="absolute top-2 right-2 flex space-x-1">
                      {product.images && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-black bg-opacity-60 text-white">
                          <FaImages className="mr-1" /> 
                          <span>{product.images.length}</span>
                        </span>
                      )}
                    </div>
                  </div>
                  
                  {/* Product Info */}
                  <div className="p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-medium text-gray-900 text-lg line-clamp-1">{product.name}</h3>
                        <div className="flex items-center mt-1 space-x-2">
                          {product.category && (
                            <span className="text-sm text-gray-600">{product.category}</span>
                          )}
                        </div>
                      </div>
                      <div className="text-base font-semibold text-[#c8a45d]">{formatPrice(product.price)}</div>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 mt-3">
                      {product.gender && (
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium
                          ${product.gender === 'Femme' ? 'bg-pink-100 text-pink-800' :
                          product.gender === 'Homme' ? 'bg-blue-100 text-blue-800' :
                          'bg-purple-100 text-purple-800'}`}>
                          {product.gender}
                        </span>
                      )}
                      {product.volume && (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          {product.volume}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  {/* Actions */}
                  <div className="px-4 py-3 bg-gray-50 border-t border-gray-100">
                    {showDeleteConfirm === product._id ? (
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Confirmer la suppression?</span>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleDeleteConfirm(product._id)}
                            className="p-1 px-3 text-white bg-red-500 text-sm rounded-lg hover:bg-red-600 transition-colors"
                          >
                            Oui
                          </button>
                          <button
                            onClick={handleDeleteCancel}
                            className="p-1 px-3 text-gray-600 bg-gray-200 text-sm rounded-lg hover:bg-gray-300 transition-colors"
                          >
                            Non
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/products/${product._id}/edit`}
                          className="p-2 px-4 text-[#c8a45d] bg-white border border-[#c8a45d] rounded-lg hover:bg-[#c8a45d] hover:text-white transition-colors flex items-center"
                        >
                          <FaEdit className="mr-1" /> Modifier
                        </Link>
                        <button
                          onClick={() => handleDeleteClick(product._id)}
                          className="p-2 px-4 text-red-600 bg-white border border-red-200 rounded-lg hover:bg-red-500 hover:text-white hover:border-red-500 transition-colors flex items-center"
                        >
                          <FaTrash className="mr-1" /> Supprimer
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
          
          <div className="mt-4 text-sm text-gray-500">
            Showing {filteredProducts.length} of {products.length} products
          </div>
        </>
      )}
    </div>
  );
}
