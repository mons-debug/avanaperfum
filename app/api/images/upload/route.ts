import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

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
    
    try {
      // Ensure directory exists
      const productsDir = path.join(process.cwd(), 'public/images/products');
      
      // Check if we can write to the file system
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
      
    } catch (fsError: any) {
      console.error('File system error:', fsError);
      
      // Handle read-only file system (common in serverless environments)
      if (fsError.code === 'EROFS' || fsError.code === 'EACCES' || fsError.message.includes('read-only')) {
        return NextResponse.json({
          success: false,
          error: 'File system is read-only. This deployment environment doesn\'t support local file uploads. Consider using a VPS/dedicated server or enable persistent storage.',
          deploymentError: true,
          suggestions: [
            'Deploy to a VPS or dedicated server with writable file system',
            'Use a hosting platform that supports persistent storage',
            'Mount a writable volume for file uploads',
            'Consider using database storage for images (base64)'
          ]
        }, { status: 500 });
      }
      
      // Other file system errors
      return NextResponse.json({
        success: false,
        error: `File system error: ${fsError.message}`,
        deploymentError: true
      }, { status: 500 });
    }
    
  } catch (error: any) {
    console.error('Error uploading image:', error);
    
    return NextResponse.json(
      { success: false, error: 'Failed to upload image. Please try again.' },
      { status: 500 }
    );
  }
} 