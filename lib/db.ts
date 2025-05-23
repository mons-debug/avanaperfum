import { MongoClient } from 'mongodb';
import mongoose from 'mongoose';

// Singleton for MongoDB client
let client: MongoClient;
let clientPromise: Promise<MongoClient>;

// Get MongoDB URI from environment
const uri = process.env.MONGODB_URI || process.env.NEXT_PUBLIC_MONGODB_URI || process.env.MONGO_URI || '';

if (!uri) {
  throw new Error('Please define the MONGODB_URI environment variable');
}

// Connection options
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

if (process.env.NODE_ENV === 'development') {
  // In development mode, use a global variable so that the value
  // is preserved across module reloads caused by HMR (Hot Module Replacement).
  if (!(global as any)._mongoClientPromise) {
    client = new MongoClient(uri);
    (global as any)._mongoClientPromise = client.connect();
  }
  clientPromise = (global as any)._mongoClientPromise;
} else {
  // In production mode, it's best to not use a global variable.
  client = new MongoClient(uri);
  clientPromise = client.connect();
}

// Export a module-scoped MongoClient promise
export { clientPromise };

// Function for NextAuth to connect to the database
export async function connectToDatabase() {
  const client = await clientPromise;
  const db = client.db();
  return { client, db };
}
