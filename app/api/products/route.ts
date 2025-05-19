import { NextRequest, NextResponse } from 'next/server';
import { connectToDB } from '@/lib/mongodb';
import Product from '@/models/Product';

const DEFAULT_PRODUCT_IMAGE = '/images/product-placeholder.svg';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const gender = searchParams.get('gender');
    const featured = searchParams.get('featured');
    const category = searchParams.get('category');
    const limit = Number(searchParams.get('limit')) || undefined;

    console.log('GET /api/products with params:', { gender, featured, category, limit });

    await connectToDB();

    const query: any = {};
    
    // Add gender filter if specified
    if (gender) {
      query.gender = gender;
    }
    
    // Add featured filter if specified
    if (featured === 'true') {
      query.featured = true;
    }
    
    // Add category filter if specified
    if (category) {
      query.category = category;
    }

    console.log('MongoDB query:', JSON.stringify(query));

    const products = await Product.find(query)
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();

    console.log(`Found ${products.length} products in database`);
    
    if (products.length === 0) {
      // Check if there are any products in the database at all
      const totalCount = await Product.countDocuments({});
      console.log(`Total products in database: ${totalCount}`);
      
      if (totalCount > 0) {
        console.log('There are products, but none match the query criteria');
      } else {
        console.log('No products in database');
      }
    }

    // Ensure each product has at least one valid image
    const productsWithValidImages = products.map(product => ({
      ...product,
      images: product.images?.length > 0 ? product.images : [DEFAULT_PRODUCT_IMAGE]
    }));

    return NextResponse.json({
      success: true,
      data: productsWithValidImages
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    if (!body.name || !body.gender || !body.category) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Validate price
    if (typeof body.price !== 'number' || body.price < 0) {
      return NextResponse.json(
        { success: false, error: 'Invalid price value' },
        { status: 400 }
      );
    }
    
    // Ensure valid images array
    if (!Array.isArray(body.images)) {
      body.images = [];
    }
    
    // If no images provided, use placeholder
    if (body.images.length === 0) {
      body.images = [DEFAULT_PRODUCT_IMAGE];
    }
    
    await connectToDB();
    
    const newProduct = await Product.create({
      ...body,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    
    // Fetch the complete product to ensure all fields are populated
    const savedProduct = await Product.findById(newProduct._id).lean();
    
    return NextResponse.json(
      { success: true, data: savedProduct },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create product' },
      { status: 500 }
    );
  }
}
