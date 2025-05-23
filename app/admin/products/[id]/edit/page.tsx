'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { FaArrowLeft } from 'react-icons/fa';
import ProductForm from '@/components/ProductForm';
import LocalImageInstructions from '@/components/LocalImageInstructions';

// Define the product type
interface Product {
  _id: string;
  name: string;
  inspiredBy?: string;
  description?: string;
  volume?: string;
  tags?: string[];
  ingredients?: string;
  imageUrl?: string;
  category?: string;
  gender?: string;
}

interface PageProps {
  params: {
    id: string;
  };
}

export default function EditProductPage({ params }: PageProps) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`/api/products/${params.id}`);
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch product');
        }
        
        if (data.success && data.data) {
          setProduct(data.data);
        } else {
          throw new Error('Product not found');
        }
      } catch (err: any) {
        setError(err.message);
        console.error('Error fetching product:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProduct();
  }, [params.id]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-pulse text-lg text-gray-600">Loading product...</div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          <p className="font-medium">Error: {error || 'Product not found'}</p>
          <p className="mt-2">
            <Link href="/admin/products" className="text-red-600 underline">
              Return to products
            </Link>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <Link 
          href="/admin/products"
          className="inline-flex items-center text-blue-600 hover:text-blue-800"
        >
          <FaArrowLeft className="mr-2" />
          Back to Products
        </Link>
        <h1 className="text-2xl font-bold">Edit Product</h1>
      </div>
      
      <LocalImageInstructions />
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <ProductForm initialData={product} isEditing={true} />
      </div>
    </div>
  );
}
