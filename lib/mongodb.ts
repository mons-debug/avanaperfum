import mongoose from "mongoose";
import dotenv from "dotenv";

// Add debug logging
console.log('MongoDB initialization starting...');
console.log('Current NODE_ENV:', process.env.NODE_ENV);

// Load environment variables
dotenv.config();

// Initialize cached connection
let cached: { conn: typeof mongoose | null; promise: Promise<typeof mongoose> | null } = (global as any).mongoose || {
  conn: null,
  promise: null,
};

// Debug environment state
const envState = {
  nodeEnv: process.env.NODE_ENV,
  hasMongoUri: !!process.env.MONGODB_URI,
  hasNextPublicMongoUri: !!process.env.NEXT_PUBLIC_MONGODB_URI,
  hasMongoUriAlt: !!process.env.MONGO_URI,
  availableEnvKeys: Object.keys(process.env).filter(key => !key.includes('SECRET')),
};

console.log('Environment State:', envState);

// Helper to get MongoDB URI with fallbacks
function getMongoURI(): string {
  // Try different environment variable loading methods
  const uri = 
    process.env.MONGODB_URI ||
    process.env.NEXT_PUBLIC_MONGODB_URI ||
    process.env.MONGO_URI;

  if (!uri) {
    console.error('Environment State:', {
      nodeEnv: process.env.NODE_ENV,
      hasMongoUri: !!process.env.MONGODB_URI,
      hasNextPublicMongoUri: !!process.env.NEXT_PUBLIC_MONGODB_URI,
      hasMongoUriAlt: !!process.env.MONGO_URI,
      availableEnvKeys: Object.keys(process.env).filter(key => !key.includes('SECRET')),
    });
    throw new Error(
      'MongoDB URI not found. Please define MONGODB_URI in your .env.local file\n' +
      'Example: MONGODB_URI=mongodb://localhost:27017/avana'
    );
  }

  return uri;
}

// Declare global mongoose cache
declare global {
  // eslint-disable-next-line no-var
  var mongoose: {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
  } | undefined;
}

// Initialize mongoose connection
if (!(global as any).mongoose) {
  (global as any).mongoose = { conn: null, promise: null };
  cached = (global as any).mongoose;
}

export async function connectToDB() {
  try {
    // Use cached connection if available
    if (cached.conn) {
      console.log('Using cached MongoDB connection');
      return cached.conn;
    }

    // Use existing connection promise if available
    if (!cached.promise) {
      const opts = {
        bufferCommands: false,
        maxPoolSize: 10,
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
        family: 4,
      };

      // Get MongoDB URI
      const MONGODB_URI = getMongoURI();

      console.log('Initiating new MongoDB connection...');

      // Create new connection promise
      cached.promise = mongoose
        .connect(MONGODB_URI, opts)
        .then((mongoose) => {
          console.log('MongoDB connected successfully');
          return mongoose;
        })
        .catch((error) => {
          console.error('MongoDB connection error:', error);
          cached.promise = null;
          throw error;
        });
    } else {
      console.log('Using existing connection promise...');
    }

    // Wait for connection
    cached.conn = await cached.promise;
    return cached.conn;
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
    // Clear promise to allow retry
    cached.promise = null;
    throw error;
  }
}
