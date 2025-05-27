const { createServer } = require('http');
const { Server } = require('socket.io');
const next = require('next');

const dev = process.env.NODE_ENV !== 'production';
const hostname = 'localhost';
const port = process.env.PORT || 3000;

// Create Next.js app
const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();

app.prepare().then(() => {
  const httpServer = createServer(handler);
  
  // Create Socket.IO server
  const io = new Server(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  });

  console.log('🚀 AVANA WebSocket Server starting...');

  // Handle WebSocket connections
  io.on('connection', (socket) => {
    console.log('✅ Admin connected:', socket.id);

    socket.on('disconnect', () => {
      console.log('❌ Admin disconnected:', socket.id);
    });

    // Handle test events
    socket.on('test', (data) => {
      console.log('🧪 Test event received:', data);
      socket.emit('test-response', { message: 'Server received test', timestamp: new Date() });
    });

    // Join admin room for notifications
    socket.join('admin');
    console.log('👨‍💼 Admin joined notification room');

    // Send welcome message
    socket.emit('welcome', { 
      message: 'Connected to AVANA notification system',
      timestamp: new Date(),
      socketId: socket.id
    });
  });

  // Global function to emit new order notifications
  global.notifyNewOrder = (order) => {
    console.log('📢 Broadcasting new order to admin room:', order._id);
    console.log('📊 Connected clients:', io.engine.clientsCount);
    
    const notification = {
      order: {
        _id: order._id,
        name: order.name,
        total: order.total,
        createdAt: order.createdAt,
        phone: order.phone,
        city: order.city
      },
      timestamp: new Date()
    };
    
    io.to('admin').emit('new-order', notification);
    console.log('✅ Notification sent to admin room');
  };

  // Test function to manually trigger notifications
  global.testNotification = () => {
    const testOrder = {
      _id: 'test-' + Date.now(),
      name: 'Test Client',
      total: 199,
      createdAt: new Date(),
      phone: '0123456789',
      city: 'Test City'
    };
    global.notifyNewOrder(testOrder);
  };

  httpServer
    .once('error', (err) => {
      console.error('❌ Server error:', err);
      process.exit(1);
    })
    .listen(port, () => {
      console.log(`✅ AVANA Server ready on http://${hostname}:${port}`);
      console.log('🔌 WebSocket server ready for real-time notifications');
      console.log('🧪 Test notification: global.testNotification()');
    });
});
