import { NextRequest, NextResponse } from 'next/server';
import { connectToDB } from '@/lib/mongodb';
import Order from '@/models/Order';

// Import push notification function
declare global {
  var pushSubscriptions: PushSubscription[] | undefined;
  var notifyNewOrder: ((order: any) => void) | undefined;
}

// Function to send push notifications
async function sendPushNotifications(order: any) {
  if (!global.pushSubscriptions || global.pushSubscriptions.length === 0) {
    console.log('📱 No push subscriptions available');
    return;
  }

  const webpush = require('web-push');
  
  // Configure VAPID keys
  webpush.setVapidDetails(
    'mailto:admin@avanaparfum.com',
    'BEl62iUYgUivxIkv69yViEuiBIa40HI0DLb8P5QFebdUFBrDNBEN_MuBpSUgVLb1VJKHSBhf6_7JnZ0Z6lNW_dM',
    'aUiz-xQC6VRyOWNufsm3zwBh6Ysx6sWAkKTOKFXVqWo'
  );

  const payload = {
    title: '🛍️ Nouvelle Commande AVANA!',
    body: `Client: ${order.name}\nMontant: ${order.total} DH\nVille: ${order.city}`,
    icon: '/images/logowhw.png',
    badge: '/images/logowhw.png',
    data: {
      orderId: order._id,
      url: '/admin/orders'
    }
  };

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

export async function GET() {
  try {
    await connectToDB();
    const orders = await Order.find({}).sort({ createdAt: -1 }); // Most recent first
    
    return NextResponse.json({ success: true, data: orders });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      name, email, phone, address, city, product, items, 
      originalSubtotal, bulkDiscount, subtotal, shipping, total, 
      totalQuantity, promoMessage, note 
    } = body;
    
    // Basic validation
    if (!name || !phone || !address || !city) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: name, phone, address, and city are required' },
        { status: 400 }
      );
    }
    
    // Either product or items must be provided
    if (!product && (!items || !Array.isArray(items) || items.length === 0)) {
      return NextResponse.json(
        { success: false, error: 'Either product or items must be provided' },
        { status: 400 }
      );
    }
    
    // Check for price information
    if (subtotal === undefined || shipping === undefined || total === undefined) {
      return NextResponse.json(
        { success: false, error: 'Price information (subtotal, shipping, total) is required' },
        { status: 400 }
      );
    }
    
    await connectToDB();
    
    const newOrder = await Order.create({
      name,
      email,
      phone,
      address,
      city,
      product,
      items,
      originalSubtotal,
      bulkDiscount,
      subtotal,
      shipping,
      total,
      totalQuantity,
      promoMessage,
      note,
      status: 'New',
      createdAt: new Date(),
      updatedAt: new Date()
    });
    
    // Trigger WebSocket notification for admin
    if (global.notifyNewOrder) {
      global.notifyNewOrder(newOrder);
    }
    
    // Send push notifications
    await sendPushNotifications(newOrder);
    
    return NextResponse.json(
      { success: true, data: newOrder },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create order' },
      { status: 500 }
    );
  }
} 