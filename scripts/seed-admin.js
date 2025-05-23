/**
 * Admin User Seeding Script for AVANA PARFUM
 * 
 * This script creates an initial admin user in the MongoDB database.
 * 
 * Usage: 
 * 1. Set the MONGODB_URI environment variable in .env.local
 * 2. Run: node scripts/seed-admin.js
 */

const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs');
const path = require('path');
require('dotenv').config({ path: path.resolve(process.cwd(), '.env.local') });

// Get MongoDB connection string from environment
const uri = process.env.MONGODB_URI;

if (!uri) {
  console.error('❌ MONGODB_URI environment variable is not set');
  process.exit(1);
}

async function seedAdminUser() {
  const client = new MongoClient(uri);
  
  try {
    // Connect to MongoDB
    await client.connect();
    console.log('🔌 Connected to MongoDB');
    
    const db = client.db();
    const usersCollection = db.collection('users');
    
    // Check if admin user already exists
    const existingAdmin = await usersCollection.findOne({ email: 'admin@avanaparfum.com' });
    
    if (existingAdmin) {
      console.log('✅ Admin user already exists');
      return;
    }
    
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('AdminPassword123!', salt);
    
    // Create admin user
    const adminUser = {
      name: 'Admin',
      email: 'admin@avanaparfum.com',
      password: hashedPassword,
      role: 'admin',
      createdAt: new Date(),
    };
    
    const result = await usersCollection.insertOne(adminUser);
    
    if (result.acknowledged) {
      console.log('✅ Admin user created successfully');
      console.log('📧 Email: admin@avanaparfum.com');
      console.log('🔑 Password: AdminPassword123!');
      console.log('⚠️ IMPORTANT: Change this password immediately after first login');
    } else {
      console.error('❌ Failed to create admin user');
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await client.close();
    console.log('🔌 Disconnected from MongoDB');
  }
}

// Run the seed function
seedAdminUser()
  .catch(console.error);
