import { connectToDB } from '@/lib/mongodb';
import { notFound } from 'next/navigation';
import Product from '@/models/Product';
import ProductDetail from './ProductDetail';
import { isValidObjectId } from 'mongoose';

// Default language for the page
const DEFAULT_LOCALE = 'fr';

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

async function getProductBySlug(slugOrId: string) {
  try {
    await connectToDB();
    
    // Try to find by ID first if it looks like a valid MongoDB ObjectId
    if (isValidObjectId(slugOrId)) {
      try {
        const productById = await Product.findById(slugOrId);
        if (productById) return productById;
      } catch (error) {
        // Continue if not found by ID
        console.log('Not found by ID, continuing search...');
      }
    }
    
    // Next, try to find by exact slug match
    const productBySlug = await Product.findOne({ slug: slugOrId });
    if (productBySlug) return productBySlug;
    
    // Find by URL-friendly name (slug) using regex for more flexibility
    const nameSlug = slugOrId.replace(/-/g, ' ');
    const products = await Product.find({
      $or: [
        { name: { $regex: new RegExp('^' + nameSlug + '$', 'i') } },
        { name: { $regex: new RegExp('^' + slugOrId + '$', 'i') } },
        { slug: { $regex: new RegExp('^' + slugOrId + '$', 'i') } }
      ]
    });
    
    if (products && products.length > 0) {
      return products[0];
    }
    
    return null;
  } catch (error) {
    console.error('Error fetching product:', error);
    return null;
  }
}

export default async function ProductPage({ params }: PageProps) {
  const { slug } = await params;
  // Set French as the default locale for server-side rendering
  const locale = DEFAULT_LOCALE;
  const product = await getProductBySlug(slug);
  
  if (!product) {
    return (
      <div className="container mx-auto px-4 py-20">
        <h1 className="text-3xl font-bold mb-6">Product Not Found</h1>
        <p>Sorry, we couldn't find the product you're looking for.</p>
      </div>
    );
  }
  
  return <ProductDetail product={JSON.parse(JSON.stringify(product))} />;
}
