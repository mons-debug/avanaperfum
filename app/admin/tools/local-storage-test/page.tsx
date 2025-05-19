'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { FaArrowLeft } from 'react-icons/fa';
import LocalStorageTestHelper from '@/components/LocalStorageTestHelper';

export default function LocalImageTestPage() {
  const [localStorage, setLocalStorage] = useState<{[key: string]: string}>({
    imageDirectory: '/public/images/products/',
    imageUrlPattern: '/images/products/{filename}'
  });
  
  return (
    <div className="container mx-auto px-4 py-8">
      <Link 
        href="/admin"
        className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6"
      >
        <FaArrowLeft className="mr-2" />
        Back to Dashboard
      </Link>
      
      <h1 className="text-2xl font-bold mb-6">Local Image Upload Test</h1>
      
      <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm mb-8">
        <h2 className="text-xl font-semibold mb-4">Local Storage Configuration</h2>
        <div className="space-y-2 mb-4">
          <p>Images directory: <code className="bg-gray-100 px-2 py-1 rounded">{localStorage.imageDirectory}</code></p>
          <p>Image URL pattern: <code className="bg-gray-100 px-2 py-1 rounded">{localStorage.imageUrlPattern}</code></p>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-md p-3 text-sm text-green-800">
          <p>Local file storage is now fully implemented:</p>
          <ul className="list-disc list-inside mt-2">
            <li>Images are automatically uploaded to the server</li>
            <li>Files are stored in the public/images/products/ directory</li>
            <li>No need to manually copy files anymore</li>
          </ul>
        </div>
      </div>
      
      <LocalStorageTestHelper />
      
      <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm mt-8">
        <h2 className="text-xl font-semibold mb-4">Test Steps</h2>
        <ol className="list-decimal list-inside space-y-3">
          <li>Upload an image using the test component above</li>
          <li>Verify the image preview is displayed</li>
          <li>Note the server path where the image is stored</li>
          <li>Navigate to <Link href="/admin/products/new" className="text-blue-600 hover:underline">Add Product</Link> and test the image upload there</li>
          <li>After creating a product, check the product details page to ensure the image is displayed correctly</li>
        </ol>
      </div>
      
      <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mt-8">
        <h3 className="text-lg font-medium mb-2">Implementation Notes</h3>
        <p>This implementation:</p>
        <ul className="list-disc list-inside mt-2">
          <li>Stores images directly in the <code className="bg-gray-100 px-1 rounded">/public/images/products/</code> directory</li>
          <li>Uses server-side API for file uploads</li>
          <li>Supports JPG, PNG, and WEBP formats</li>
          <li>Includes file size validation (max 5MB)</li>
          <li>Uses fallback images when needed</li>
          <li>Provides immediate image preview after upload</li>
        </ul>
      </div>
    </div>
  );
} 