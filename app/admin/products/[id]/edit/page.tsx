import { notFound } from 'next/navigation';
import Link from 'next/link';
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
  params: Promise<{
    id: string;
  }>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function EditProductPage({ params }: PageProps) {
  const { id } = await params;
  // Fetch product data on the server side
  let product: Product | null = null;
  let error = '';
  
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/products/${id}`, 
      { cache: 'no-store' }
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch product');
    }
    
    const data = await response.json();
    if (data.success) {
      product = data.data;
    } else {
      throw new Error(data.error || 'Failed to fetch product');
    }
  } catch (err) {
    error = err instanceof Error ? err.message : 'An error occurred';
    console.error('Error fetching product:', err);
  }
  
  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
          <div className="mt-2">
            <Link href="/admin/products" className="text-red-700 underline">
              Return to products
            </Link>
          </div>
        </div>
      </div>
    );
  }
  
  if (!product) {
    notFound();
  }

  // No loading state needed as we're using server components

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
