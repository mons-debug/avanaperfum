import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(request: NextRequest) {
  try {
    // Get the URL from the request
    const { searchParams } = new URL(request.url);
    const imagePath = searchParams.get('path');
    
    if (!imagePath || !imagePath.startsWith('/images/products/')) {
      return NextResponse.json(
        { success: false, error: 'Invalid image path' },
        { status: 400 }
      );
    }
    
    // Check if the products directory exists
    const productsDir = path.join(process.cwd(), 'public/images/products');
    const productsDirExists = fs.existsSync(productsDir);
    
    // Get the filename
    const fileName = path.basename(imagePath);
    
    // Check if the file exists
    const filePath = path.join(process.cwd(), 'public', imagePath);
    const fileExists = fs.existsSync(filePath);
    
    // Check file size if it exists
    let fileSize = 0;
    if (fileExists) {
      const stats = fs.statSync(filePath);
      fileSize = stats.size;
    }
    
    return NextResponse.json({
      success: true,
      data: {
        imagePath,
        fileName,
        productsDirExists,
        fileExists,
        fileSize,
        serverPath: `public${imagePath}`,
        absolutePath: filePath,
        directoryPath: productsDir
      }
    });
  } catch (error) {
    console.error('Error checking image info:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to check image info' },
      { status: 500 }
    );
  }
} 