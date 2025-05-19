// This script tries to export products from MongoDB and save them as JSON files
const { MongoClient } = require('mongodb');
const fs = require('fs');
const path = require('path');

// Connection settings - update these as needed
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const DB_NAME = process.env.DB_NAME || 'avana';
const COLLECTION_NAME = 'products';

// Directory to store exported products
const OUTPUT_DIR = path.join(__dirname, '../data/export');

async function exportProducts() {
  console.log('Starting product export...');
  
  // Create output directory if it doesn't exist
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    console.log(`Created output directory: ${OUTPUT_DIR}`);
  }
  
  let client;
  
  try {
    // Try to connect to MongoDB
    client = new MongoClient(MONGODB_URI, { serverSelectionTimeoutMS: 5000 });
    await client.connect();
    console.log('✅ Connected to MongoDB');
    
    const db = client.db(DB_NAME);
    const productsCollection = db.collection(COLLECTION_NAME);
    
    // Find all existing products
    const products = await productsCollection.find({}).toArray();
    console.log(`Found ${products.length} products in database`);
    
    if (products.length === 0) {
      console.log('No products found in the database.');
      return;
    }
    
    // Write all products to a file
    const exportFile = path.join(OUTPUT_DIR, 'db-products.json');
    fs.writeFileSync(exportFile, JSON.stringify(products, null, 2));
    console.log(`Exported ${products.length} products to ${exportFile}`);
    
    // Also write individual product files
    for (const product of products) {
      const productId = product._id.toString();
      const filename = path.join(OUTPUT_DIR, `product-${productId}.json`);
      fs.writeFileSync(filename, JSON.stringify(product, null, 2));
    }
    
    console.log('✅ Export completed successfully');
    console.log(`\nThe exported product data is available in ${OUTPUT_DIR}`);
    console.log('You can now run the migration script to transform this data.');
    
  } catch (error) {
    if (error.name === 'MongoServerSelectionError') {
      console.error('❌ Could not connect to MongoDB. Is the database running?');
      console.log('Creating a sample export file instead with example products...');
      
      // Create a sample export file with example data
      const sampleProducts = [
        {
          "_id": "sample1",
          "name": "Example Perfume 1",
          "category": "Eau de Parfum",
          "gender": "Femme",
          "imageUrl": "/images/products/example1.jpg",
          "volume": "100ml"
        },
        {
          "_id": "sample2",
          "name": "Example Perfume 2",
          "category": "Eau de Toilette",
          "gender": "Homme",
          "imageUrl": "/images/products/example2.jpg",
          "volume": "50ml"
        }
      ];
      
      const sampleFile = path.join(OUTPUT_DIR, 'sample-products.json');
      fs.writeFileSync(sampleFile, JSON.stringify(sampleProducts, null, 2));
      console.log(`Created sample product data in ${sampleFile}`);
    } else {
      console.error('❌ Export failed:', error);
    }
  } finally {
    // Close the MongoDB connection if it exists
    if (client) {
      await client.close();
      console.log('MongoDB connection closed');
    }
  }
}

// Run the export
exportProducts(); 