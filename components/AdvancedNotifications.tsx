'use client';
import { useEffect, useState, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { io, Socket } from 'socket.io-client';
import { FaBell, FaBellSlash, FaVolumeUp, FaVolumeMute, FaWifi } from 'react-icons/fa';

export default function AdvancedNotifications() {
  const { data: session } = useSession();
  const [isNotificationEnabled, setIsNotificationEnabled] = useState(false);
  const [isWebSocketConnected, setIsWebSocketConnected] = useState(false);
  const [serviceWorkerReady, setServiceWorkerReady] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);
  const [lastOrderId, setLastOrderId] = useState<string | null>(null);
  const [pushSubscription, setPushSubscription] = useState<PushSubscription | null>(null);
  const socketRef = useRef<Socket | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize audio
  useEffect(() => {
    if (typeof window !== "undefined") {
      audioRef.current = new Audio("/sounds/notification.mp3");
      audioRef.current.volume = 0.8;
    }
  }, []);

  // Load notification count from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedCount = localStorage.getItem('avana_notification_count');
      if (savedCount) {
        setNotificationCount(parseInt(savedCount, 10));
      }
    }
  }, []);

  // Save notification count to localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem('avana_notification_count', notificationCount.toString());
      
      // Update page title with count
      if (notificationCount > 0) {
        document.title = `(${notificationCount}) AVANA Admin - Nouvelles Commandes!`;
      } else {
        document.title = 'AVANA Admin - Administration';
      }
    }
  }, [notificationCount]);

  // Check notification permission on mount
  useEffect(() => {
    if ('Notification' in window) {
      setIsNotificationEnabled(Notification.permission === 'granted');
    }
  }, []);

  // Initialize Service Worker and Push Notifications
  useEffect(() => {
    if ('serviceWorker' in navigator && session) {
      navigator.serviceWorker.register('/sw.js')
        .then(async (registration) => {
          console.log('✅ Service Worker registered');
          setServiceWorkerReady(true);
          
          // Setup push notifications
          if ('PushManager' in window && Notification.permission === 'granted') {
            try {
              const subscription = await registration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: urlBase64ToUint8Array('BEl62iUYgUivxIkv69yViEuiBIa40HI0DLb8P5QFebdUFBrDNBEN_MuBpSUgVLb1VJKHSBhf6_7JnZ0Z6lNW_dM')
              });
              
              setPushSubscription(subscription);
              
              // Send subscription to server
              await fetch('/api/push-subscription', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(subscription)
              });
              
              console.log('✅ Push subscription created');
            } catch (error) {
              console.error('❌ Push subscription failed:', error);
            }
          }
        })
        .catch((error) => {
          console.error('❌ Service Worker registration failed:', error);
        });
    }
  }, [session]);

  // Helper function to convert VAPID key
  const urlBase64ToUint8Array = (base64String: string) => {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
      .replace(/-/g, '+')
      .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  };

  // Handle new order notification
  const handleNewOrder = (orderData: any) => {
    console.log('🛍️ New order received:', orderData);
    setLastOrderId(orderData._id);
    setNotificationCount(prev => prev + 1);

    // Play sound
    if (audioRef.current) {
      audioRef.current.play().catch(console.error);
    }

    // Show browser notification
    if (isNotificationEnabled && 'Notification' in window) {
      const notification = new Notification('🛍️ Nouvelle Commande AVANA!', {
        body: `Client: ${orderData.name}\nMontant: ${orderData.total} DH\nVille: ${orderData.city}\nID: ${orderData._id}`,
        icon: '/images/logowhw.png',
        tag: 'avana-order-' + orderData._id,
        requireInteraction: true
      });

      notification.onclick = () => {
        window.focus();
        window.location.href = '/admin/orders';
        notification.close();
      };
    }

    // Send to Service Worker for background notifications
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({
        type: 'NEW_ORDER',
        order: orderData
      });
    }

    // Trigger page refresh after a short delay
    setTimeout(() => {
      window.location.reload();
    }, 3000);
  };

  // Initialize WebSocket
  useEffect(() => {
    if (session && !socketRef.current) {
      console.log('🔌 Connecting to WebSocket...');
      socketRef.current = io();
      
      socketRef.current.on('connect', () => {
        console.log('✅ WebSocket connected');
        setIsWebSocketConnected(true);
      });

      socketRef.current.on('disconnect', () => {
        console.log('❌ WebSocket disconnected');
        setIsWebSocketConnected(false);
      });

      socketRef.current.on('new-order', (data) => {
        console.log('📢 New order received via WebSocket:', data);
        handleNewOrder(data.order);
      });

      // Test connection
      socketRef.current.on('connect', () => {
        console.log('🔌 WebSocket connected, testing...');
        socketRef.current?.emit('test', { message: 'Admin connected' });
      });
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
        setIsWebSocketConnected(false);
      }
    };
  }, [session, isNotificationEnabled]);

  // Request notification permission and setup push
  const requestNotificationPermission = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      setIsNotificationEnabled(permission === 'granted');
      
      if (permission === 'granted') {
        // Show success notification
        new Notification('🛍️ AVANA Notifications Activées!', {
          body: 'Vous recevrez maintenant des alertes en temps réel pour les nouvelles commandes.',
          icon: '/images/logowhw.png'
        });

        // Setup push notifications if Service Worker is ready
        if (serviceWorkerReady && 'serviceWorker' in navigator) {
          try {
            const registration = await navigator.serviceWorker.ready;
            const subscription = await registration.pushManager.subscribe({
              userVisibleOnly: true,
              applicationServerKey: urlBase64ToUint8Array('BEl62iUYgUivxIkv69yViEuiBIa40HI0DLb8P5QFebdUFBrDNBEN_MuBpSUgVLb1VJKHSBhf6_7JnZ0Z6lNW_dM')
            });
            
            setPushSubscription(subscription);
            
            // Send subscription to server
            await fetch('/api/push-subscription', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(subscription)
            });
            
            console.log('✅ Push notifications enabled');
          } catch (error) {
            console.error('❌ Push setup failed:', error);
          }
        }
      }
    }
  };

  // Test notification function
  const testNotification = () => {
    console.log('🧪 Testing notification...');
    const testOrder = {
      _id: 'test-' + Date.now(),
      name: 'Test Client',
      total: 199,
      city: 'Casablanca',
      phone: '0612345678',
      createdAt: new Date()
    };
    handleNewOrder(testOrder);
  };

  // Clear notification count
  const clearNotifications = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering parent button
    setNotificationCount(0);
    setLastOrderId(null);
    document.title = 'AVANA Admin - Administration';
    localStorage.removeItem('avana_notification_count');
  };

  // Handle bell click
  const handleBellClick = () => {
    if (notificationCount > 0) {
      // If there are notifications, navigate to orders page
      window.location.href = '/admin/orders';
    } else {
      // If no notifications, request permission
      requestNotificationPermission();
    }
  };

  if (!session) return null;

  return (
    <div className="flex items-center space-x-3">
      {/* WebSocket Status */}
      <div className="flex items-center space-x-1">
        <div className={`w-2 h-2 rounded-full ${isWebSocketConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
        <span className="text-xs text-gray-500">{isWebSocketConnected ? 'WebSocket' : 'Polling'}</span>
      </div>
      
      {/* Service Worker Status */}
      <span className="text-xs text-gray-500">SW: {serviceWorkerReady ? '✅' : '❌'}</span>
      
      {/* Push Status */}
      <span className="text-xs text-gray-500">Push: {pushSubscription ? '✅' : '❌'}</span>
      
      {/* Notification Bell with Badge */}
      <div className="relative">
        <button
          onClick={handleBellClick}
          onDoubleClick={testNotification}
          className={`relative p-2 rounded-lg transition-colors ${
            isNotificationEnabled 
              ? 'text-green-600 hover:bg-green-50' 
              : 'text-gray-400 hover:bg-gray-50'
          }`}
          title={notificationCount > 0 ? 'Cliquer pour voir les commandes' : (isNotificationEnabled ? 'Notifications activées - Double-clic pour test' : 'Activer les notifications')}
        >
          {isNotificationEnabled ? <FaBell size={18} /> : <FaBellSlash size={18} />}
          
          {/* Notification Badge */}
          {notificationCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full min-w-[18px] h-[18px] flex items-center justify-center animate-bounce font-bold">
              {notificationCount > 99 ? '99+' : notificationCount}
            </span>
          )}
        </button>
        
        {/* Clear notifications button */}
        {notificationCount > 0 && (
          <button
            onClick={clearNotifications}
            className="absolute -bottom-1 -right-1 bg-gray-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center hover:bg-gray-600"
            title="Effacer les notifications"
          >
            ×
          </button>
        )}
      </div>

      {/* Debug Info */}
      <div className="text-xs text-gray-400">
        {lastOrderId && `Last: ${lastOrderId.slice(-4)}`}
      </div>
    </div>
  );
}