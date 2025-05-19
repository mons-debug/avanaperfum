import { NextResponse } from 'next/server';
import { connectToDB } from '@/lib/mongodb';

export async function GET() {
  try {
    // Log environment state
    const envState = {
      nodeEnv: process.env.NODE_ENV,
      hasMongoUri: !!process.env.MONGODB_URI,
      envKeys: Object.keys(process.env).filter(key => !key.includes('SECRET')),
    };
    
    console.log('Test DB Route - Environment State:', envState);
    
    // Test connection
    const mongoose = await connectToDB();
    const isConnected = mongoose.connection.readyState === 1;
    
    return NextResponse.json({
      success: true,
      message: 'Database connection test successful',
      isConnected,
      envState,
    });
  } catch (error) {
    console.error('Test DB Route - Connection Error:', error);
    return NextResponse.json({
      success: false,
      message: 'Database connection test failed',
      error: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 });
  }
} 