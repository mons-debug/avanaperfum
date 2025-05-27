import { NextRequest, NextResponse } from 'next/server';
import webpush from 'web-push';

// Extend global type
declare global {
  var testNotification: (() => void) | undefined;
  var pushSubscriptions: PushSubscription[] | undefined;
}

// Configure web-push with VAPID keys
const vapidKeys = {
  publicKey: 'BEl62iUYgUivxIkv69yViEuiBIa40HI0DLb8P5QFebdUFBrDNBEN_MuBpSUgVLb1VJKHSBhf6_7JnZ0Z6lNW_dM',
  privateKey: 'aUiz-xQC6VRyOWNufsm3zwBh6Ysx6sWAkKTOKFXVqWo'
};

webpush.setVapidDetails(
  'mailto:admin@avanaparfum.com',
  vapidKeys.publicKey,
  vapidKeys.privateKey
);

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

// Function to send push to all subscriptions
export async function sendPushToAll(payload: any) {
  if (!global.pushSubscriptions || global.pushSubscriptions.length === 0) {
    console.log('📱 No push subscriptions available');
    return;
  }

  console.log(`📱 Sending push to ${global.pushSubscriptions.length} subscriptions`);
  
  const promises = global.pushSubscriptions.map(async (subscription) => {
    try {
      await webpush.sendNotification(subscription as any, JSON.stringify(payload));
      console.log('✅ Push sent successfully');
    } catch (error) {
      console.error('❌ Push failed:', error);
      // Remove invalid subscriptions
      global.pushSubscriptions = global.pushSubscriptions?.filter(sub => sub !== subscription);
    }
  });

  await Promise.all(promises);
}
