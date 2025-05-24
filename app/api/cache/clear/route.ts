import { NextRequest, NextResponse } from 'next/server';
import { clearProductsCache } from '@/lib/utils/cacheUtils';

export async function POST(request: NextRequest) {
  try {
    // Clear the products cache
    clearProductsCache();
    
    console.log('[API] Cache cleared successfully');
    
    return NextResponse.json({
      success: true,
      message: 'Cache cleared successfully'
    });
  } catch (error) {
    console.error('[API] Error clearing cache:', error);
    
    return NextResponse.json(
      { success: false, error: 'Failed to clear cache' },
      { status: 500 }
    );
  }
}
