'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import MultiImageUploader from '@/components/MultiImageUploader';
import ImageSetupNotice from '@/components/ImageSetupNotice';

// Define the product and form types
type Product = {
  _id?: string;
  name: string;
  inspiredBy: string;
  description: string;
  volume: string;
  tags: string[];
  ingredients: string;
  images: string[];
  price: number;
  category: string; // Deprecated field - keeping for backward compatibility
  categoryId: string; // New field to store the category ID
  gender: string;
};

type FormData = Omit<Product, 'tags' | 'price' | 'images'> & {
  tags: string;
  price: string;
  images: string[];
};

type Category = {
  _id: string;
  name: string;
  slug: string;
};

type ProductFormProps = {
  initialData?: Partial<Product>;
  isEditing?: boolean;
};

const ProductForm: React.FC<ProductFormProps> = ({ 
  initialData = {}, 
  isEditing = false 
}) => {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    name: initialData.name || '',
    inspiredBy: initialData.inspiredBy || '',
    description: initialData.description || '',
    volume: initialData.volume || '',
    tags: initialData.tags?.join(', ') || '',
    ingredients: initialData.ingredients || '',
    images: initialData.images || [],
    price: initialData.price?.toString() || '',
    category: initialData.category || '', // Deprecated field
    categoryId: initialData.categoryId || '', // New field
    gender: initialData.gender || '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [categories, setCategories] = useState<Category[]>([]);
  const [showImageNotice, setShowImageNotice] = useState(false);

  useEffect(() => {
    // Check if there are initial images from the products folder
    if (initialData.images && initialData.images.length > 0) {
      const hasLocalImages = initialData.images.some(img => img.startsWith('/images/products/'));
      if (hasLocalImages) {
        setShowImageNotice(true);
      }
    }
    
    // Fetch categories for the dropdown
    async function fetchCategories() {
      try {
        const response = await fetch('/api/categories');
        const data = await response.json();
        
        if (data.success && data.data) {
          setCategories(data.data);
          
          // If we have a category name but no categoryId, try to find the matching category
          if (formData.category && !formData.categoryId) {
            const matchingCategory = data.data.find(
              (cat: Category) => cat.name.toLowerCase() === formData.category.toLowerCase()
            );
            if (matchingCategory) {
              setFormData(prev => ({ ...prev, categoryId: matchingCategory._id }));
            }
          }
        }
      } catch (err) {
        console.error('Error fetching categories:', err);
      }
    }
    
    fetchCategories();
  }, [initialData.images, formData.category, formData.categoryId]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImagesChange = (urls: string[]) => {
    setFormData(prev => ({ ...prev, images: urls }));
    // Show the image setup notice when new images are uploaded
    if (urls.some(url => url.startsWith('/images/products/'))) {
      setShowImageNotice(true);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      console.log('Starting product submission process...');
      
      // Validate required fields
      if (!formData.name || !formData.gender || !formData.categoryId) {
        throw new Error('Please fill in all required fields');
      }

      // Validate price
      const priceValue = parseFloat(formData.price);
      if (isNaN(priceValue) || priceValue < 0) {
        throw new Error('Please enter a valid price');
      }
      
      // Convert tags string to array
      const tagsArray = formData.tags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0);
      
      // Find category name for backward compatibility
      const selectedCategory = categories.find(cat => cat._id === formData.categoryId);
      
      // Handle images - ensure they're processed correctly
      const processedImages = formData.images.length > 0 
        ? formData.images.map(img => img.trim()).filter(img => img.length > 0)
        : ['/images/product-placeholder.svg'];
      
      console.log('Processed images:', processedImages);
      
      const productData = {
        ...formData,
        tags: tagsArray,
        price: priceValue,
        category: selectedCategory?.name || formData.category, // Keep for backward compatibility
        images: processedImages
      };
      
      console.log(`${isEditing ? 'Updating' : 'Creating'} product:`, productData);
      
      const url = isEditing 
        ? `/api/products/${initialData._id}` 
        : '/api/products';
      
      const method = isEditing ? 'PUT' : 'POST';
      
      console.log(`Sending ${method} request to ${url}`);
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache' // Prevent caching of the request
        },
        body: JSON.stringify(productData),
      });
      
      console.log('Response status:', response.status);
      const data = await response.json();
      console.log('Response data:', data);
      
      if (!response.ok) {
        throw new Error(data.error || `Failed to save product: ${response.status}`);
      }
      
      if (data.success) {
        console.log('Product saved successfully:', data.data);
        
        // Force a cache clear to ensure updated data is shown
        try {
          await fetch('/api/cache/clear', { method: 'POST' });
          console.log('Cache cleared successfully');
        } catch (cacheError) {
          console.warn('Failed to clear cache:', cacheError);
          // Continue anyway, not a critical error
        }
        
        // Show success message
        alert(`Product ${isEditing ? 'updated' : 'created'} successfully!`);
        
        // Refresh the router to trigger a revalidation
        router.refresh();
        
        // Slightly longer delay to ensure refresh completes
        setTimeout(() => {
          router.push('/admin/products');
        }, 500);
      } else {
        throw new Error(data.error || 'Failed to save product');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
      console.error('Form submission error:', err);
      alert(`Error submitting product: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-md">
          {error}
        </div>
      )}
      
      {showImageNotice && formData.images.length > 0 && (
        <ImageSetupNotice imagePath={formData.images[0]} />
      )}
      
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Left column */}
        <div className="space-y-6">
          {/* Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Product Name *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          {/* InspiredBy */}
          <div>
            <label htmlFor="inspiredBy" className="block text-sm font-medium text-gray-700 mb-1">
              Inspired By
            </label>
            <input
              type="text"
              id="inspiredBy"
              name="inspiredBy"
              value={formData.inspiredBy}
              onChange={handleChange}
              className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          {/* Price */}
          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
              Price *
            </label>
            <div className="relative mt-1 rounded-md shadow-sm">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <span className="text-gray-500 sm:text-sm">$</span>
              </div>
              <input
                type="number"
                step="0.01"
                min="0"
                id="price"
                name="price"
                required
                value={formData.price}
                onChange={handleChange}
                className="block w-full pl-7 pr-12 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                placeholder="0.00"
              />
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                <span className="text-gray-500 sm:text-sm">USD</span>
              </div>
            </div>
          </div>
          
          {/* Volume */}
          <div>
            <label htmlFor="volume" className="block text-sm font-medium text-gray-700 mb-1">
              Volume (ml)
            </label>
            <input
              type="text"
              id="volume"
              name="volume"
              value={formData.volume}
              onChange={handleChange}
              className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              placeholder="30"
            />
          </div>
          
          {/* Gender */}
          <div>
            <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-1">
              Gender *
            </label>
            <select
              id="gender"
              name="gender"
              required
              value={formData.gender}
              onChange={handleChange}
              className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select Gender</option>
              <option value="Femme">Femme</option>
              <option value="Homme">Homme</option>
            </select>
          </div>
          
          {/* Category - Updated to use ID */}
          <div>
            <label htmlFor="categoryId" className="block text-sm font-medium text-gray-700 mb-1">
              Category *
            </label>
            <select
              id="categoryId"
              name="categoryId"
              required
              value={formData.categoryId}
              onChange={handleChange}
              className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select Category</option>
              {categories.map(category => (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        
        {/* Right column */}
        <div className="space-y-6">
          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              rows={3}
              value={formData.description}
              onChange={handleChange}
              className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          {/* Tags */}
          <div>
            <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-1">
              Tags (comma separated)
            </label>
            <input
              type="text"
              id="tags"
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              placeholder="tag1, tag2, tag3"
            />
          </div>
          
          {/* Ingredients */}
          <div>
            <label htmlFor="ingredients" className="block text-sm font-medium text-gray-700 mb-1">
              Ingredients
            </label>
            <textarea
              id="ingredients"
              name="ingredients"
              rows={4}
              value={formData.ingredients}
              onChange={handleChange}
              className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          {/* Multi Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Product Images (First image will be the primary image)
            </label>
            <MultiImageUploader 
              initialImages={formData.images}
              onImagesChange={handleImagesChange}
              maxImages={5}
            />
          </div>
        </div>
      </div>
      
      {/* Form Actions */}
      <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
        <button
          type="button"
          onClick={() => router.push('/admin/products')}
          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {isSubmitting ? 'Saving...' : isEditing ? 'Update Product' : 'Create Product'}
        </button>
      </div>
    </form>
  );
};

export default ProductForm; 