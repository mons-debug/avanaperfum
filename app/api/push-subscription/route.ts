import { NextRequest, NextResponse } from 'next/server';
import webpush from 'web-push';
import { vapidKeys } from '@/lib/push-notifications';

// Extend global type
declare global {
  // eslint-disable-next-line no-var
  var testNotification: (() => void) | undefined;
  // eslint-disable-next-line no-var
  var pushSubscriptions: PushSubscription[] | undefined;
}

export async function POST(request: NextRequest) {
  try {
    console.log('📱 Push subscription request received');
    const subscription = await request.json();
    
    // Store subscription globally (in production, use database)
    if (!global.pushSubscriptions) {
      global.pushSubscriptions = [];
    }
    
    // Add subscription if not already exists
    const exists = global.pushSubscriptions.find(sub => 
      JSON.stringify(sub) === JSON.stringify(subscription)
    );
    
    if (!exists) {
      global.pushSubscriptions.push(subscription);
      console.log('✅ Push subscription stored');
    }
    
    // Test the subscription immediately
    try {
      await webpush.sendNotification(subscription, JSON.stringify({
        title: '🛍️ AVANA Notifications Activées!',
        body: 'Vous recevrez maintenant des alertes push pour les nouvelles commandes.',
        icon: '/images/logowhw.png',
        badge: '/images/logowhw.png'
      }));
      console.log('✅ Test push notification sent');
    } catch (pushError) {
      console.error('❌ Test push failed:', pushError);
    }
    
    return NextResponse.json({ 
      success: true, 
      message: 'Push subscription registered successfully',
      vapidPublicKey: vapidKeys.publicKey
    });
  } catch (error) {
    console.error('Error handling push subscription:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to register push subscription' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({ 
    message: 'Push notification endpoint ready',
    vapidPublicKey: vapidKeys.publicKey,
    subscriptionsCount: global.pushSubscriptions?.length || 0
  });
}
