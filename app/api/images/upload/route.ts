import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

// This function will handle direct image uploads
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No file uploaded' },
        { status: 400 }
      );
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { success: false, error: 'Invalid file type. Only JPG, PNG, and WEBP are supported.' },
        { status: 400 }
      );
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { success: false, error: 'File too large. Maximum size is 5MB.' },
        { status: 400 }
      );
    }

    // Get file bytes
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Generate a unique filename
    const originalName = file.name.replace(/[^a-zA-Z0-9-_.]/g, '_');
    const fileExt = originalName.split('.').pop() || 'jpg';
    const fileName = `${uuidv4().substring(0, 8)}-${originalName}`;
    const productImagePath = `/images/products/${fileName}`;
    
    // Ensure directory exists
    const productsDir = path.join(process.cwd(), 'public/images/products');
    if (!fs.existsSync(productsDir)) {
      fs.mkdirSync(productsDir, { recursive: true });
    }
    
    // Write file to disk
    const filePath = path.join(process.cwd(), 'public', productImagePath);
    fs.writeFileSync(filePath, buffer);
    
    // Add a timestamp to prevent caching
    const timestampedPath = `${productImagePath}?t=${Date.now()}`;
    
    // Return the response with cache control headers
    const response = NextResponse.json({
      success: true,
      data: {
        url: timestampedPath,
        filename: fileName,
        size: file.size,
        type: file.type
      }
    });
    
    // Add headers to prevent caching
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
    
    return response;
  } catch (error) {
    console.error('Error uploading image:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to upload image' },
      { status: 500 }
    );
  }
} 