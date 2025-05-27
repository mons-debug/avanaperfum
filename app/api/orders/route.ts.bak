import { NextRequest, NextResponse } from 'next/server';
import { connectToDB } from '@/lib/mongodb';
import Order from '@/models/Order';

export async function GET() {
  try {
    await connectToDB();
    const orders = await Order.find({}).sort({ createdAt: -1 }); // Most recent first
    
    return NextResponse.json({ success: true, data: orders });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      name, email, phone, address, city, product, items, 
      originalSubtotal, bulkDiscount, subtotal, shipping, total, 
      totalQuantity, promoMessage, note 
    } = body;
    
    // Basic validation
    if (!name || !phone || !address || !city) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: name, phone, address, and city are required' },
        { status: 400 }
      );
    }
    
    // Either product or items must be provided
    if (!product && (!items || !Array.isArray(items) || items.length === 0)) {
      return NextResponse.json(
        { success: false, error: 'Either product or items must be provided' },
        { status: 400 }
      );
    }
    
    // Check for price information
    if (subtotal === undefined || shipping === undefined || total === undefined) {
      return NextResponse.json(
        { success: false, error: 'Price information (subtotal, shipping, total) is required' },
        { status: 400 }
      );
    }
    
    await connectToDB();
    
    const newOrder = await Order.create({
      name,
      email,
      phone,
      address,
      city,
      product,
      items,
      originalSubtotal,
      bulkDiscount,
      subtotal,
      shipping,
      total,
      totalQuantity,
      promoMessage,
      note,
      status: 'New',
      createdAt: new Date(),
      updatedAt: new Date()
    });
    
    return NextResponse.json(
      { success: true, data: newOrder },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create order' },
      { status: 500 }
    );
  }
} 