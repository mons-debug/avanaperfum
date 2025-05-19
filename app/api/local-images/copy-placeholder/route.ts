import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    // Get the target path from the request
    const { searchParams } = new URL(request.url);
    const imagePath = searchParams.get('path');
    
    if (!imagePath || !imagePath.startsWith('/images/products/')) {
      return NextResponse.json(
        { success: false, error: 'Invalid image path' },
        { status: 400 }
      );
    }
    
    // Define the placeholder path and target path
    const placeholderPath = path.join(process.cwd(), 'public/images/product-placeholder.jpg');
    const targetPath = path.join(process.cwd(), 'public', imagePath);
    const targetDir = path.dirname(targetPath);
    
    // Check if placeholder exists
    if (!fs.existsSync(placeholderPath)) {
      return NextResponse.json(
        { success: false, error: 'Placeholder image not found' },
        { status: 404 }
      );
    }
    
    // Create directory if it doesn't exist
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }
    
    // Copy the placeholder to the target location
    fs.copyFileSync(placeholderPath, targetPath);
    
    // Confirm the file exists and get its size
    const exists = fs.existsSync(targetPath);
    const stats = exists ? fs.statSync(targetPath) : null;
    
    return NextResponse.json({
      success: true,
      data: {
        imagePath,
        copied: true,
        exists,
        size: stats ? stats.size : 0,
        source: placeholderPath,
        target: targetPath
      }
    });
  } catch (error) {
    console.error('Error copying placeholder image:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to copy placeholder image' },
      { status: 500 }
    );
  }
} 