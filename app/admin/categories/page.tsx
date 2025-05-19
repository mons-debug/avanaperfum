'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FaEdit, FaTrash, FaPlus, FaSync } from 'react-icons/fa';
import { successToast, errorToast } from '@/lib/toast';
import Link from 'next/link';

// Define the category type
type Category = {
  _id: string;
  name: string;
  slug: string;
};

export default function AdminCategoriesPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  
  // Form state
  const [showForm, setShowForm] = useState(false);
  const [categoryName, setCategoryName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  // Function to fetch categories
  const fetchCategories = async (showRefreshState = false) => {
    try {
      if (showRefreshState) {
        setIsRefreshing(true);
      }
      const response = await fetch('/api/categories');
      
      if (!response.ok) {
        throw new Error('Failed to fetch categories');
      }
      
      const data = await response.json();
      
      if (data.success && data.data) {
        setCategories(data.data);
      } else {
        throw new Error(data.error || 'Failed to fetch categories');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
      console.error('Error fetching categories:', err);
    } finally {
      setIsLoading(false);
      if (showRefreshState) {
        setIsRefreshing(false);
      }
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchCategories();
  }, []);

  // Add refresh function
  const handleRefresh = () => {
    fetchCategories(true);
  };
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormError('');
    
    if (!categoryName.trim()) {
      setFormError('Category name is required');
      setIsSubmitting(false);
      return;
    }
    
    try {
      const response = await fetch('/api/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: categoryName }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to create category');
      }
      
      if (data.success) {
        successToast('Category created successfully!');
        setCategoryName('');
        setShowForm(false);
        fetchCategories(true);
      } else {
        throw new Error(data.error || 'Failed to create category');
      }
    } catch (err: any) {
      setFormError(err.message || 'An error occurred');
      errorToast(err.message || 'Failed to create category');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Handle delete click
  const handleDeleteClick = (categoryId: string) => {
    setShowDeleteConfirm(categoryId);
  };
  
  // Handle delete cancel
  const handleDeleteCancel = () => {
    setShowDeleteConfirm(null);
  };
  
  // Handle delete confirm
  const handleDeleteConfirm = async (categoryId: string) => {
    try {
      const response = await fetch(`/api/categories/${categoryId}`, {
        method: 'DELETE',
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete category');
      }
      
      if (data.success) {
        // Remove the category from the list
        setCategories(categories.filter(category => category._id !== categoryId));
        setShowDeleteConfirm(null);
        
        // Show success message
        successToast('Category deleted successfully');
      } else {
        throw new Error(data.error || 'Failed to delete category');
      }
    } catch (err: any) {
      errorToast(err.message || 'Error deleting category');
      console.error('Error deleting category:', err);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Category Management</h1>
        <div className="flex items-center gap-2">
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors disabled:opacity-50"
          >
            <FaSync className={`${isRefreshing ? 'animate-spin' : ''}`} />
            {isRefreshing ? 'Refreshing...' : 'Refresh'}
          </button>
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            <FaPlus /> {showForm ? 'Cancel' : 'Add Category'}
          </button>
        </div>
      </div>
      
      {/* Add Category Form */}
      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-lg font-semibold mb-4">Add New Category</h2>
          <form onSubmit={handleSubmit}>
            {formError && (
              <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-md mb-4">
                {formError}
              </div>
            )}
            <div className="mb-4">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Category Name *
              </label>
              <input
                type="text"
                id="name"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g. Summer Collection"
              />
              <p className="text-sm text-gray-500 mt-1">
                A slug will be automatically generated from the category name.
              </p>
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {isSubmitting ? 'Saving...' : 'Save Category'}
              </button>
            </div>
          </form>
        </div>
      )}

      {error && (
        <div className="bg-red-50 text-red-500 p-4 rounded-md mb-6">
          Error: {error}
        </div>
      )}

      {isLoading ? (
        <div className="text-center py-12">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
          <p className="mt-2 text-gray-600">Loading categories...</p>
        </div>
      ) : (
        <>
          {categories.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <p className="text-gray-600">No categories found.</p>
              <button 
                onClick={() => setShowForm(true)}
                className="inline-block mt-4 text-blue-600 hover:text-blue-800"
              >
                Add your first category
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                      Name
                    </th>
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                      Slug
                    </th>
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {categories.map((category) => (
                    <tr key={category._id} className="hover:bg-gray-50">
                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className="font-medium text-gray-900">{category.name}</div>
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className="text-sm text-gray-600">{category.slug}</div>
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center gap-2">
                          <Link
                            href={`/admin/categories/${category._id}/edit`}
                            className="p-2 text-blue-600 hover:text-blue-900 transition-colors"
                            title="Edit category"
                          >
                            <FaEdit />
                          </Link>
                          
                          {showDeleteConfirm === category._id ? (
                            <div className="flex items-center gap-2 ml-2">
                              <button
                                onClick={() => handleDeleteConfirm(category._id)}
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
                              onClick={() => handleDeleteClick(category._id)}
                              className="p-2 text-red-600 hover:text-red-900 transition-colors"
                              title="Delete category"
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
            Showing {categories.length} {categories.length === 1 ? 'category' : 'categories'}
          </div>
        </>
      )}
    </div>
  );
}
