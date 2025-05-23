import { NextRequest, NextResponse } from 'next/server';
import { connectToDB } from '@/lib/mongodb';
import Product from '@/models/Product';
import { mockProducts } from '@/lib/mockData';
import { getCachedProducts, setCachedProducts, isCacheValid, clearProductsCache } from '@/lib/utils/cacheUtils';

const DEFAULT_PRODUCT_IMAGE = '/images/product-placeholder.svg';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const gender = searchParams.get('gender');
    const categoryId = searchParams.get('categoryId');
    const search = searchParams.get('search');
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : undefined;
    const page = searchParams.get('page') ? parseInt(searchParams.get('page')!) : 1;
    const timestamp = searchParams.get('t'); // Timestamp for cache busting
    
    console.log(`[API/Products] GET: Received request with params:`, { gender, categoryId, search, limit, page, timestamp });
    
    // Skip cache if timestamp is provided (force fresh data)
    const useCache = !timestamp;
    
    // Cache key based on query parameters
    const cacheKey = `products-${gender || 'all'}-${categoryId || 'all'}-${search || 'all'}-${limit || 'all'}-${page || 1}`;
    
    // Check if we have cached data and are allowed to use it
    const cachedData = useCache ? getCachedProducts(cacheKey) : null;
    if (cachedData && isCacheValid(cachedData)) {
      console.log(`[API/Products] GET: Returning cached data for ${cacheKey}`);
      return NextResponse.json({
        success: true,
        data: cachedData.data,
        fromCache: true
      });
    } else {
      console.log(`[API/Products] GET: Fetching fresh data for ${cacheKey}`);
    }
    
    try {
      await connectToDB();
    } catch (error) {
      // Use mock data when MongoDB is not available
      let filteredProducts = [...mockProducts];
      
      if (gender) {
        filteredProducts = filteredProducts.filter(p => p.gender === gender);
      }
      
      if (categoryId) {
        filteredProducts = filteredProducts.filter(p => p.category === categoryId);
      }
      
      if (search) {
        const searchLower = search.toLowerCase();
        filteredProducts = filteredProducts.filter(p => 
          p.name.toLowerCase().includes(searchLower) ||
          (p.description && p.description.toLowerCase().includes(searchLower)) ||
          (p.inspiredBy && p.inspiredBy.toLowerCase().includes(searchLower))
        );
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
      if (['Homme', 'Femme'].includes(gender)) {
        query.gender = gender;
      }
    }
    
    if (categoryId) {
      query.category = categoryId;
    }

    // Add search functionality
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { inspiredBy: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } }
      ];
    }

    let productsQuery = Product.find(query).sort({ createdAt: -1 });
    
    if (limit !== undefined) {
      productsQuery = productsQuery.limit(limit);
    }
    
    if (page > 1 && limit) {
      productsQuery = productsQuery.skip((page - 1) * limit);
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
    
    // Get total count of products
    const totalCount = await Product.countDocuments(query);
    const totalPages = limit ? Math.ceil(totalCount / limit) : 1;
    
    // Return the products
    const result = {
      success: true,
      data: processedProducts,
      totalPages,
      currentPage: page,
      totalCount: totalCount
    };
    
    // Cache the result for future requests (if not a force-refresh request)
    if (useCache) {
      setCachedProducts(cacheKey, result.data);
      console.log(`[API/Products] GET: Cached results for ${cacheKey}`);
    }
    
    // Set cache control headers
    return NextResponse.json(
      result,
      {
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      }
    );
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
    
    // Generate slug from name if not provided
    if (!body.slug) {
      const nameForSlug = typeof body.name === 'string' ? body.name : (body.name?.en || body.name?.fr || '');
      body.slug = nameForSlug
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');
      
      // Ensure slug is unique by adding a timestamp if needed
      const timestamp = Date.now().toString().slice(-6);
      body.slug = `${body.slug}-${timestamp}`;
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
      clearProductsCache();
      
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
        slug: body.slug || body.name.toLowerCase().replace(/[^a-z0-9]/g, '-'),
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
