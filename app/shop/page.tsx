import React, { Suspense } from 'react';
import { Metadata } from 'next';
import { connectToDB } from '@/lib/mongodb';
import Product from '@/models/Product';
import Category from '@/models/Category';
import ShopContent from './ShopContent';

// Types
export type ProductType = {
  _id: string;
  name: string;
  category: string;
  gender: string;
  price: number;
  images: string[];
  inspiredBy?: string;
  volume?: string;
  createdAt?: string;
  featured?: boolean;
};

export type CategoryType = {
  _id: string;
  name: string;
  slug: string;
};

interface ShopPageProps {
  searchParams: Promise<{
    category?: string;
    gender?: string;
    search?: string;
    sort?: string;
  }>;
}

// Server-side data fetching
async function getShopData(searchParams: {
  category?: string;
  gender?: string;
  search?: string;
  sort?: string;
}) {
  try {
    await connectToDB();

    // Build MongoDB query
    const query: any = {};
    
    // Category filter
    if (searchParams.category) {
      query.category = { $regex: new RegExp(searchParams.category, 'i') };
    }
    
    // Gender filter
    if (searchParams.gender) {
      const genders = searchParams.gender.split(',').filter(Boolean);
      if (genders.length > 0) {
        query.gender = { $in: genders };
      }
    }
    
    // Search filter
    if (searchParams.search) {
      const searchRegex = new RegExp(searchParams.search, 'i');
      query.$or = [
        { name: searchRegex },
        { category: searchRegex },
        { inspiredBy: searchRegex }
      ];
    }

    // Build sort options
    let sortOptions: any = { featured: -1, createdAt: -1 }; // Default sort
    
    switch (searchParams.sort) {
      case 'newest':
        sortOptions = { createdAt: -1 };
        break;
      case 'oldest':
        sortOptions = { createdAt: 1 };
        break;
      case 'price-low':
        sortOptions = { price: 1 };
        break;
      case 'price-high':
        sortOptions = { price: -1 };
        break;
      case 'name-az':
        sortOptions = { name: 1 };
        break;
      case 'name-za':
        sortOptions = { name: -1 };
        break;
    }

    // Fetch products with query and sort
    const products = await Product.find(query)
      .sort(sortOptions)
      .lean()
      .exec();

    // Fetch all categories
    const categories = await Category.find({})
      .sort({ name: 1 })
      .lean()
      .exec();

    // Transform data for client
    const transformedProducts: ProductType[] = products.map(product => ({
      _id: product._id.toString(),
      name: typeof product.name === 'string' ? product.name : product.name?.fr || product.name?.en || '',
      category: product.category,
      gender: product.gender,
      price: product.price,
      images: product.images?.length > 0 ? product.images : ['/images/product-placeholder.svg'],
      inspiredBy: typeof product.inspiredBy === 'string' ? product.inspiredBy : product.inspiredBy?.fr || product.inspiredBy?.en,
      volume: product.volume,
      createdAt: product.createdAt?.toISOString(),
      featured: product.featured
    }));

    const transformedCategories: CategoryType[] = categories.map(category => ({
      _id: category._id.toString(),
      name: category.name,
      slug: category.slug
    }));
      
      return {
      products: transformedProducts,
      categories: transformedCategories,
      success: true
    };

  } catch (error) {
    console.error('Error fetching shop data:', error);
    return {
      products: [],
      categories: [],
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

// Metadata
export const metadata: Metadata = {
  title: 'Boutique – Parfums Homme & Femme | AVANA PARFUM',
  description: 'Explorez notre collection complète de parfums premium pour homme et femme inspirés des plus grandes fragrances. Qualité exceptionnelle à prix accessibles.',
  keywords: 'boutique parfums, parfums homme, parfums femme, fragrances premium, parfums inspirés, collection AVANA PARFUM',
  openGraph: {
    title: 'Boutique – Parfums Homme & Femme | AVANA PARFUM',
    description: 'Explorez notre collection complète de parfums premium pour homme et femme inspirés des plus grandes fragrances. Qualité exceptionnelle à prix accessibles.',
    type: 'website',
    locale: 'fr_FR',
    siteName: 'AVANA PARFUM',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Boutique – Parfums Homme & Femme | AVANA PARFUM',
    description: 'Explorez notre collection complète de parfums premium pour homme et femme inspirés des plus grandes fragrances.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

// Main shop page component
export default async function ShopPage({ searchParams }: ShopPageProps) {
  // Await searchParams and fetch data on the server
  const resolvedSearchParams = await searchParams;
  const shopData = await getShopData(resolvedSearchParams);

  if (!shopData.success) {
    return (
      <div className="min-h-screen pt-[120px] pb-16 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Erreur de chargement</h1>
          <p className="text-gray-600 mb-6">
            Impossible de charger les produits. Veuillez réessayer plus tard.
          </p>
          <p className="text-sm text-gray-500">
            Erreur: {shopData.error}
          </p>
        </div>
      </div>
    );
  }

  return (
    <Suspense fallback={
      <div className="min-h-screen pt-[120px] pb-16 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-10 w-10 animate-spin rounded-full border-4 border-solid border-[#c8a45d] border-r-transparent mb-4"></div>
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    }>
      <ShopContent 
        initialProducts={shopData.products}
        initialCategories={shopData.categories}
        searchParams={resolvedSearchParams}
      />
    </Suspense>
  );
}
