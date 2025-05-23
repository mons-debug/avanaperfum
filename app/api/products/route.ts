import { NextRequest, NextResponse } from 'next/server';
import { connectToDB } from '@/lib/mongodb';
import Product from '@/models/Product';
import { mockProducts } from '@/lib/mockData';

const DEFAULT_PRODUCT_IMAGE = '/images/product-placeholder.svg';

// Memory cache to avoid repeated database queries
let productsCache: Record<string, {
  data: any[],
  timestamp: number,
  expiryTime: number
}> = {};

// Cache expiry in milliseconds (5 minutes)
const CACHE_EXPIRY = 5 * 60 * 1000;

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const gender = searchParams.get('gender');
    const featured = searchParams.get('featured');
    const category = searchParams.get('category');
    const limit = Number(searchParams.get('limit')) || undefined;
    
    // Create a cache key based on the query params
    const cacheKey = `products-${gender || ''}-${featured || ''}-${category || ''}-${limit || ''}`;
    
    // Check if we have a valid cache for this request
    if (productsCache[cacheKey] && 
        (Date.now() - productsCache[cacheKey].timestamp) < CACHE_EXPIRY) {
      // Return cached data
      return NextResponse.json({
        success: true,
        data: productsCache[cacheKey].data,
        fromCache: true
      });
    }
    
    try {
      await connectToDB();
    } catch (error) {
      // Use mock data when MongoDB is not available
      let filteredProducts = [...mockProducts];
      
      if (gender) {
        filteredProducts = filteredProducts.filter(p => p.gender === gender);
      }
      
      if (featured === 'true') {
        filteredProducts = filteredProducts.filter(p => p.featured);
      }
      
      if (category) {
        filteredProducts = filteredProducts.filter(p => p.category === category);
      }
      
      if (limit) {
        filteredProducts = filteredProducts.slice(0, limit);
      }
      
      return NextResponse.json({
        success: true,
        data: filteredProducts,
        isMockData: true
      });
    }

    const query: any = {};
    
    if (gender) {
      if (['Homme', 'Femme', 'Mixte'].includes(gender)) {
        query.gender = gender;
      }
    }
    
    if (featured === 'true') {
      query.featured = true;
    }
    
    if (category) {
      // Use case-insensitive match for better results
      query.category = new RegExp(`^${category}$`, 'i');
    }

    let productsQuery = Product.find(query).sort({ createdAt: -1 });
    
    if (limit !== undefined) {
      productsQuery = productsQuery.limit(limit);
    }
    
    // Execute query and convert to plain objects
    const products = await productsQuery.lean();
    
    // Ensure each product has at least one image
    const processedProducts = products.map(p => {
      // Only set placeholder if images array is empty or undefined
      if (!p.images || !Array.isArray(p.images) || p.images.length === 0) {
        return {
          ...p,
          images: [DEFAULT_PRODUCT_IMAGE]
        };
      }
      return p;
    });
    
    // Store in cache
    productsCache[cacheKey] = {
      data: processedProducts,
      timestamp: Date.now(),
      expiryTime: CACHE_EXPIRY
    };

    return NextResponse.json({
      success: true,
      data: processedProducts
    }, {
      headers: {
        'Cache-Control': 'public, max-age=300', // Allow browser caching for 5 minutes
        'Surrogate-Control': 'max-age=3600' // CDN caching for 1 hour
      }
    });
  } catch (error) {
    // Return mock data as a fallback
    return NextResponse.json({
      success: true,
      data: mockProducts,
      isMockData: true,
      error: 'Failed to fetch products from database'
    });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    if (!body.name || !body.gender || !body.category) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    if (typeof body.price !== 'number' || body.price < 0) {
      return NextResponse.json(
        { success: false, error: 'Invalid price value' },
        { status: 400 }
      );
    }
    
    if (!Array.isArray(body.images)) {
      body.images = [];
    }
    
    if (body.images.length === 0) {
      body.images = [DEFAULT_PRODUCT_IMAGE];
    }
    
    try {
      await connectToDB();
      
      const newProduct = await Product.create({
        ...body,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      
      const savedProduct = await Product.findById(newProduct._id).lean();
      
      // Clear the cache after a new product is added
      productsCache = {};
      
      return NextResponse.json(
        { success: true, data: savedProduct },
        { status: 201 }
      );
    } catch (dbError) {
      console.error('[API/Products] POST: Database error:', dbError);
      
      // Mock a successful creation for demo purposes
      const mockId = Math.floor(Math.random() * 1000000).toString();
      const mockProduct = {
        _id: mockId,
        ...body,
        slug: body.name.toLowerCase().replace(/[^a-z0-9]/g, '-'),
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      return NextResponse.json(
        { success: true, data: mockProduct, isMockData: true },
        { status: 201 }
      );
    }
  } catch (error) {
    console.error('[API/Products] POST error creating product:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create product' },
      { status: 500 }
    );
  }
}
