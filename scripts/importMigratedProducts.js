// This script imports migrated products back into MongoDB
const { MongoClient } = require('mongodb');
const fs = require('fs');
const path = require('path');

// Connection settings - update these as needed
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const DB_NAME = process.env.DB_NAME || 'avana';
const COLLECTION_NAME = 'products';

// Path to the migrated products file
const MIGRATED_PRODUCTS_FILE = path.join(__dirname, '../data/migrated/all-migrated-products.json');

async function importProducts() {
  console.log('Starting product import...');
  
  // Check if the migrated products file exists
  if (!fs.existsSync(MIGRATED_PRODUCTS_FILE)) {
    console.error(`❌ Migrated products file not found: ${MIGRATED_PRODUCTS_FILE}`);
    console.log('Run the migration scripts first:');
    console.log('1. npm run export-products');
    console.log('2. npm run finalize-migration');
    return;
  }
  
  let client;
  
  try {
    // Load the migrated products
    const migratedProductsJson = fs.readFileSync(MIGRATED_PRODUCTS_FILE, 'utf8');
    const migratedProducts = JSON.parse(migratedProductsJson);
    
    if (!Array.isArray(migratedProducts) || migratedProducts.length === 0) {
      console.error('❌ No products found in the migrated products file');
      return;
    }
    
    console.log(`Found ${migratedProducts.length} products to import`);
    
    // Try to connect to MongoDB
    client = new MongoClient(MONGODB_URI, { serverSelectionTimeoutMS: 5000 });
    await client.connect();
    console.log('✅ Connected to MongoDB');
    
    const db = client.db(DB_NAME);
    const productsCollection = db.collection(COLLECTION_NAME);
    
    // Import each product
    let insertedCount = 0;
    let updatedCount = 0;
    
    for (const product of migratedProducts) {
      const productId = product._id;
      
      // Check if the product already exists
      const existingProduct = await productsCollection.findOne({ _id: productId });
      
      if (existingProduct) {
        // Update the existing product
        await productsCollection.updateOne(
          { _id: productId },
          { $set: product }
        );
        updatedCount++;
        console.log(`Updated product: ${product.name}`);
      } else {
        // Insert the new product
        await productsCollection.insertOne(product);
        insertedCount++;
        console.log(`Inserted product: ${product.name}`);
      }
    }
    
    console.log('\n✅ Import completed successfully');
    console.log(`Inserted ${insertedCount} new products`);
    console.log(`Updated ${updatedCount} existing products`);
    
  } catch (error) {
    if (error.name === 'MongoServerSelectionError') {
      console.error('❌ Could not connect to MongoDB. Is the database running?');
      console.log('\nTo manually import the data:');
      console.log('1. Start your MongoDB server');
      console.log('2. Use MongoDB Compass or mongoimport tool to import the file:');
      console.log(`   ${MIGRATED_PRODUCTS_FILE}`);
    } else {
      console.error('❌ Import failed:', error);
    }
  } finally {
    // Close the MongoDB connection if it exists
    if (client) {
      await client.close();
      console.log('MongoDB connection closed');
    }
  }
}

// Run the import
importProducts(); 