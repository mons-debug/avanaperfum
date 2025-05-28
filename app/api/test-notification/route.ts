import { NextRequest, NextResponse } from 'next/server';

// Extend global type
declare global {
  // eslint-disable-next-line no-var
  var testNotification: (() => void) | undefined;
}

export async function POST() {
  try {
    console.log('🧪 Manual test notification triggered');
    
    // Check if the global function exists
    if (global.testNotification) {
      global.testNotification();
      return NextResponse.json({ 
        success: true, 
        message: 'Test notification sent via WebSocket' 
      });
    } else {
      return NextResponse.json({ 
        success: false, 
        error: 'WebSocket server not available' 
      }, { status: 500 });
    }
  } catch (error) {
    console.error('Error sending test notification:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to send test notification' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({ 
    message: 'Test notification endpoint ready',
    available: !!global.testNotification
  });
} 