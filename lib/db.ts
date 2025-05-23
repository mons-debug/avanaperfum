import { MongoClient } from 'mongodb';

// Global variable for caching the client promise
let cachedClientPromise: Promise<MongoClient> | null = null;

// Get MongoDB URI from environment - delayed until runtime
function getMongoDBUri(): string {
  const uri = process.env.MONGODB_URI || process.env.NEXT_PUBLIC_MONGODB_URI || process.env.MONGO_URI || '';
  
  if (!uri) {
    throw new Error('Please define the MONGODB_URI environment variable');
  }
  
  return uri;
}

// Create client promise lazily
function createClientPromise(): Promise<MongoClient> {
  if (process.env.NODE_ENV === 'development') {
    // In development mode, use a global variable so that the value
    // is preserved across module reloads caused by HMR (Hot Module Replacement).
    if (!(global as any)._mongoClientPromise) {
      const client = new MongoClient(getMongoDBUri());
      (global as any)._mongoClientPromise = client.connect();
    }
    return (global as any)._mongoClientPromise;
  } else {
    // In production mode, it's best to not use a global variable.
    const client = new MongoClient(getMongoDBUri());
    return client.connect();
  }
}

// Get or create client promise
function getClientPromise(): Promise<MongoClient> {
  if (!cachedClientPromise) {
    cachedClientPromise = createClientPromise();
  }
  return cachedClientPromise;
}

// Function for NextAuth to connect to the database
export async function connectToDatabase() {
  const client = await getClientPromise();
  const db = client.db();
  return { client, db };
}
