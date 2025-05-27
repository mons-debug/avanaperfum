// AVANA PARFUM Advanced Service Worker
console.log('🚀 AVANA Service Worker loaded');

const CACHE_NAME = 'avana-admin-v1';

// Install event
self.addEventListener('install', (event) => {
  console.log('🔧 SW: Installing...');
  self.skipWaiting();
});

// Activate event  
self.addEventListener('activate', (event) => {
  console.log('✅ SW: Activated');
  event.waitUntil(clients.claim());
});

// Push notification event
self.addEventListener('push', (event) => {
  console.log('📢 SW: Push notification received');
  
  let data = {};
  if (event.data) {
    try {
      data = event.data.json();
    } catch (e) {
      data = { body: event.data.text() };
    }
  }

  const options = {
    body: data.body || 'Nouvelle commande reçue!',
    icon: '/images/logowhw.png',
    badge: '/images/logowhw.png',
    vibrate: [200, 100, 200, 100, 200],
    data: { 
      url: '/admin/orders',
      orderId: data.orderId,
      timestamp: Date.now()
    },
    actions: [
      { action: 'view', title: '👀 Voir Commande' },
      { action: 'dismiss', title: '❌ Ignorer' }
    ],
    requireInteraction: true,
    tag: 'avana-order',
    silent: false,
    renotify: true
  };

  event.waitUntil(
    self.registration.showNotification('🛍️ AVANA - Nouvelle Commande!', options)
  );
});

// Notification click event
self.addEventListener('notificationclick', (event) => {
  console.log('🖱️ SW: Notification clicked');
  event.notification.close();

  if (event.action === 'view' || !event.action) {
    event.waitUntil(
      clients.matchAll({ type: 'window' }).then((clientList) => {
        for (const client of clientList) {
          if (client.url.includes('/admin') && 'focus' in client) {
            return client.focus();
          }
        }
        if (clients.openWindow) {
          return clients.openWindow('/admin/orders');
        }
      })
    );
  }
});

// Message event for communication with main app
self.addEventListener('message', (event) => {
  console.log('💬 SW: Message received', event.data);
  
  if (event.data && event.data.type === 'NEW_ORDER') {
    const order = event.data.order;
    
    // Show notification immediately
    self.registration.showNotification('🛍️ Nouvelle Commande AVANA!', {
      body: `Client: ${order.name}\nMontant: ${order.total} DH\nVille: ${order.city || 'N/A'}`,
      icon: '/images/logowhw.png',
      badge: '/images/logowhw.png',
      vibrate: [200, 100, 200, 100, 200],
      data: { 
        orderId: order._id,
        url: '/admin/orders'
      },
      tag: 'avana-order-' + order._id,
      requireInteraction: true,
      silent: false,
      renotify: true,
      actions: [
        { action: 'view', title: '👀 Voir Commande' },
        { action: 'dismiss', title: '❌ Ignorer' }
      ]
    });
  }
});

// Background sync for offline notifications
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    console.log('🔄 SW: Background sync triggered');
  }
});
