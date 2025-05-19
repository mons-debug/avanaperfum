import { NextRequest, NextResponse } from 'next/server';
import Settings from '@/models/Settings';
import connectDb from '@/lib/mongodb';

// GET /api/settings
export async function GET() {
  try {
    await connectDb();
    
    // Get settings or create default if none exist
    let settings = await Settings.findOne();
    
    if (!settings) {
      settings = await Settings.create({
        shippingFee: 30,
        freeShippingThreshold: 250,
        currency: 'DH',
        taxRate: 0
      });
    }
    
    return NextResponse.json({
      success: true,
      data: settings
    });
  } catch (error) {
    console.error('Failed to fetch settings:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch settings' },
      { status: 500 }
    );
  }
}

// PUT /api/settings
export async function PUT(request: NextRequest) {
  try {
    await connectDb();
    
    const data = await request.json();
    
    // Validate the input
    if (data.shippingFee === undefined || data.freeShippingThreshold === undefined) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Find settings document or create if it doesn't exist
    let settings = await Settings.findOne();
    
    if (!settings) {
      settings = await Settings.create(data);
    } else {
      // Update existing settings
      settings.shippingFee = data.shippingFee;
      settings.freeShippingThreshold = data.freeShippingThreshold;
      if (data.currency) settings.currency = data.currency;
      if (data.taxRate !== undefined) settings.taxRate = data.taxRate;
      
      await settings.save();
    }
    
    return NextResponse.json({
      success: true,
      data: settings
    });
  } catch (error) {
    console.error('Failed to update settings:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update settings' },
      { status: 500 }
    );
  }
} 