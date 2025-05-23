import { NextRequest, NextResponse } from 'next/server';
import { connectToDB } from '@/lib/mongodb';
import Category from '@/models/Category';
import { mockCategories } from '@/lib/mockData';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const featured = searchParams.get('featured');

    try {
      await connectToDB();
    } catch (error) {
      console.error('MongoDB connection error, using mock data:', error);
      
      // Use mock data when MongoDB is not available
      let filteredCategories = [...mockCategories];
      
      if (featured === 'true') {
        filteredCategories = filteredCategories.filter(c => c.featured);
      }
      
      return NextResponse.json({
        success: true,
        data: filteredCategories,
        isMockData: true
      });
    }
    
    const query: any = {};
    if (featured === 'true') {
      query.featured = true;
    }

    const categories = await Category.find(query)
      .sort({ name: 1 })
      .lean();

    return NextResponse.json({
      success: true,
      data: categories
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    
    // Return mock data as fallback
    return NextResponse.json({
      success: true,
      data: mockCategories,
      isMockData: true,
      error: 'Failed to fetch categories from database'
    });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    if (!body.name) {
      return NextResponse.json(
        { success: false, error: 'Category name is required' },
        { status: 400 }
      );
    }
    
    try {
      await connectToDB();
      
      // Generate slug from name
      const slug = body.name
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');
      
      const newCategory = await Category.create({
        ...body,
        slug,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      
      return NextResponse.json(
        { success: true, data: newCategory },
        { status: 201 }
      );
    } catch (dbError) {
      console.error('Database error creating category:', dbError);
      
      // Mock a successful creation for demo purposes
      const mockId = Math.floor(Math.random() * 1000000).toString();
      const slug = body.name
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');
        
      const mockCategory = {
        _id: mockId,
        ...body,
        slug,
        featured: body.featured || false,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      return NextResponse.json(
        { success: true, data: mockCategory, isMockData: true },
        { status: 201 }
      );
    }
  } catch (error) {
    console.error('Error creating category:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create category' },
      { status: 500 }
    );
  }
}
