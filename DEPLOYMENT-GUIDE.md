# 🚀 AVANA PARFUM - Deployment Guide for Notifications

## 📋 Pre-Deployment Checklist

### ✅ **What's Working Locally:**
- ✅ WebSocket real-time notifications
- ✅ Notification badge with persistent count
- ✅ Service Worker registration
- ✅ Browser notifications
- ✅ Sound alerts
- ✅ Auto-refresh functionality

### ⚠️ **Production Requirements:**

#### 1. **HTTPS is MANDATORY**
- Push notifications **ONLY work on HTTPS**
- Service Workers **ONLY work on HTTPS**
- WebSocket should use **WSS** (secure WebSocket)

#### 2. **Environment Variables Needed:**
```env
# Add to your production .env
VAPID_PUBLIC_KEY=BEl62iUYgUivxIkv69yViEuiBIa40HI0DLb8P5QFebdUFBrDNBEN_MuBpSUgVLb1VJKHSBhf6_7JnZ0Z6lNW_dM
VAPID_PRIVATE_KEY=aUiz-xQC6VRyOWNufsm3zwBh6Ysx6sWAkKTOKFXVqWo
VAPID_EMAIL=admin@avanaparfum.com
```

#### 3. **Database for Push Subscriptions:**
In production, store push subscriptions in MongoDB instead of memory.

## 🌐 **Deployment Platforms**

### **Vercel (Recommended)**
```bash
# 1. Install Vercel CLI
npm i -g vercel

# 2. Deploy
vercel --prod

# 3. Add environment variables in Vercel dashboard
```

### **Netlify**
```bash
# 1. Build the project
npm run build

# 2. Deploy to Netlify
# Upload the .next folder
```

### **Railway/Render**
```bash
# 1. Connect your GitHub repo
# 2. Set environment variables
# 3. Deploy automatically
```

## 🔧 **Production Fixes Needed**

### 1. **WebSocket Server for Production**
Update `server.js` for production:

```javascript
// Add to server.js
const isProduction = process.env.NODE_ENV === 'production';
const hostname = isProduction ? '0.0.0.0' : 'localhost';

// For WebSocket in production
const io = new Server(httpServer, {
  cors: {
    origin: isProduction ? ["https://yourdomain.com"] : "*",
    methods: ["GET", "POST"]
  }
});
```

### 2. **HTTPS WebSocket Connection**
Update `components/AdvancedNotifications.tsx`:

```javascript
// Change WebSocket connection for production
const socketUrl = process.env.NODE_ENV === 'production' 
  ? 'wss://yourdomain.com' 
  : 'ws://localhost:3000';

socketRef.current = io(socketUrl);
```

### 3. **Service Worker Path**
Ensure Service Worker is accessible at root:
- Move `public/sw.js` to be served at `/sw.js`
- Update registration path if needed

## 📱 **Mobile Testing**

### **iOS (Safari)**
1. Open site in Safari
2. Add to Home Screen
3. Enable notifications
4. Test push notifications

### **Android (Chrome)**
1. Open site in Chrome
2. Enable notifications when prompted
3. Test push notifications
4. Works in background

## 🧪 **Testing in Production**

### **1. Test Notification Permission**
```javascript
// In browser console
Notification.requestPermission().then(permission => {
  console.log('Permission:', permission);
});
```

### **2. Test Service Worker**
```javascript
// In browser console
navigator.serviceWorker.ready.then(registration => {
  console.log('SW ready:', registration);
});
```

### **3. Test Push Subscription**
```javascript
// In browser console
navigator.serviceWorker.ready.then(registration => {
  return registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: 'YOUR_VAPID_PUBLIC_KEY'
  });
}).then(subscription => {
  console.log('Push subscription:', subscription);
});
```

## 🔒 **Security Considerations**

### **1. VAPID Keys**
- Keep private key secure
- Use environment variables
- Rotate keys periodically

### **2. CORS Configuration**
```javascript
// Restrict CORS in production
cors: {
  origin: ["https://yourdomain.com", "https://www.yourdomain.com"],
  methods: ["GET", "POST"]
}
```

### **3. Rate Limiting**
Add rate limiting for notification endpoints:
```javascript
// Add to API routes
const rateLimit = require('express-rate-limit');
```

## 📊 **Monitoring & Analytics**

### **1. Notification Delivery**
- Track successful/failed push notifications
- Monitor WebSocket connection status
- Log notification interactions

### **2. Error Handling**
```javascript
// Add comprehensive error handling
try {
  await webpush.sendNotification(subscription, payload);
} catch (error) {
  if (error.statusCode === 410) {
    // Remove invalid subscription
    removeSubscription(subscription);
  }
  console.error('Push error:', error);
}
```

## 🚀 **Performance Optimization**

### **1. Service Worker Caching**
```javascript
// Add to sw.js
const CACHE_NAME = 'avana-v1';
const urlsToCache = [
  '/images/logowhw.png',
  '/sounds/notification.mp3'
];
```

### **2. WebSocket Reconnection**
```javascript
// Add auto-reconnection logic
const reconnectWebSocket = () => {
  setTimeout(() => {
    if (!socketRef.current?.connected) {
      initializeWebSocket();
    }
  }, 5000);
};
```

## ✅ **Deployment Checklist**

- [ ] HTTPS enabled
- [ ] Environment variables set
- [ ] VAPID keys configured
- [ ] WebSocket server updated for production
- [ ] Service Worker accessible
- [ ] Push notifications tested on mobile
- [ ] Error handling implemented
- [ ] Monitoring setup
- [ ] Rate limiting added
- [ ] CORS properly configured

## 🎯 **Expected Results After Deployment**

### **Desktop**
- ✅ Real-time WebSocket notifications
- ✅ Browser notification popups
- ✅ Notification badge persistence
- ✅ Sound alerts
- ✅ Service Worker background notifications

### **Mobile**
- ✅ Push notifications when app is closed
- ✅ Vibration on notifications
- ✅ Notification actions (View/Dismiss)
- ✅ Badge updates on home screen
- ✅ Background sync

## 🆘 **Troubleshooting**

### **Push Notifications Not Working**
1. Check HTTPS is enabled
2. Verify VAPID keys are correct
3. Check browser console for errors
4. Test notification permission

### **WebSocket Not Connecting**
1. Check WSS vs WS protocol
2. Verify CORS settings
3. Check firewall/proxy settings
4. Test WebSocket endpoint directly

### **Service Worker Not Registering**
1. Ensure HTTPS is enabled
2. Check sw.js is accessible
3. Clear browser cache
4. Check browser developer tools

---

**Your AVANA notification system will work perfectly in production with HTTPS! 🚀** 