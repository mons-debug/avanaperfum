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
    return '/images/product-placeholder.jpg';
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
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Product Management</h1>
        <div className="flex items-center gap-2">
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors disabled:opacity-50"
          >
            <FaSync className={`${isRefreshing ? 'animate-spin' : ''}`} />
            {isRefreshing ? 'Refreshing...' : 'Refresh'}
          </button>
          <Link
            href="/admin/products/new"
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            <FaPlus /> Add New Product
          </Link>
        </div>
      </div>
      
      {/* Search and filters */}
      <div className="mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Search products..."
            className="w-full px-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <FaSearch className="absolute left-3 top-3 text-gray-400" />
        </div>
      </div>

      {error && (
        <div className="bg-red-50 text-red-500 p-4 rounded-md mb-6">
          Error: {error}
        </div>
      )}

      {isLoading ? (
        <div className="text-center py-12">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
          <p className="mt-2 text-gray-600">Loading products...</p>
        </div>
      ) : (
        <>
          {filteredProducts.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <p className="text-gray-600">No products found.</p>
              <Link 
                href="/admin/products/new"
                className="inline-block mt-4 text-blue-600 hover:text-blue-800"
              >
                Add your first product
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                      Image
                    </th>
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                      Name
                    </th>
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                      Category
                    </th>
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                      Gender
                    </th>
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                      Volume
                    </th>
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                      Price
                    </th>
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                      Images
                    </th>
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredProducts.map((product) => (
                    <tr key={product._id} className="hover:bg-gray-50">
                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className="relative h-12 w-12 rounded overflow-hidden">
                          <Image
                            src={getProductImage(product)}
                            alt={product.name}
                            fill
                            className="object-cover"
                            sizes="48px"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = '/images/product-placeholder.jpg';
                            }}
                          />
                        </div>
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className="font-medium text-gray-900">{product.name}</div>
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className="text-sm text-gray-600">{product.category || '-'}</div>
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                          ${product.gender === 'Femme' ? 'bg-pink-100 text-pink-800' :
                          product.gender === 'Homme' ? 'bg-blue-100 text-blue-800' :
                          'bg-purple-100 text-purple-800'}`}>
                          {product.gender || 'Unspecified'}
                        </span>
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className="text-sm text-gray-600">{product.volume || '-'}</div>
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{formatPrice(product.price)}</div>
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className="text-sm text-gray-600">
                          {product.images && (
                            <span className="inline-flex items-center">
                              <FaImages className="mr-1 text-gray-400" /> 
                              <span>{product.images.length}</span>
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center gap-2">
                          <Link
                            href={`/admin/products/${product._id}/edit`}
                            className="p-2 text-blue-600 hover:text-blue-900 transition-colors"
                            title="Edit product"
                          >
                            <FaEdit />
                          </Link>
                          
                          {showDeleteConfirm === product._id ? (
                            <div className="flex items-center gap-2 ml-2">
                              <button
                                onClick={() => handleDeleteConfirm(product._id)}
                                className="p-1 px-2 text-white bg-red-500 text-xs rounded hover:bg-red-600 transition-colors"
                              >
                                Yes
                              </button>
                              <button
                                onClick={handleDeleteCancel}
                                className="p-1 px-2 text-gray-600 bg-gray-200 text-xs rounded hover:bg-gray-300 transition-colors"
                              >
                                No
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => handleDeleteClick(product._id)}
                              className="p-2 text-red-600 hover:text-red-900 transition-colors"
                              title="Delete product"
                            >
                              <FaTrash />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
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
