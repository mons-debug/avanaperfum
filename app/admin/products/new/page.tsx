'use client';

import Link from 'next/link';
import { FaArrowLeft } from 'react-icons/fa';
import ProductForm from '@/components/ProductForm';
import LocalImageInstructions from '@/components/LocalImageInstructions';

export default function NewProductPage() {
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
        <h1 className="text-2xl font-bold">Add New Product</h1>
      </div>
      
      <LocalImageInstructions />
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <ProductForm />
      </div>
    </div>
  );
}
