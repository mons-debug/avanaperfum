// Import the MongoDB driver directly for the migration
const { MongoClient, ObjectId } = require('mongodb');

// Use a local MongoDB connection
const MONGODB_URI = "mongodb://localhost:27017";
const DB_NAME = "avana";

async function migrateProducts() {
  console.log('Starting product migration...');
  let client;
  
  try {
    // Connect to MongoDB
    client = new MongoClient(MONGODB_URI);
    await client.connect();
    console.log('Connected to MongoDB');
    
    const db = client.db(DB_NAME);
    const productsCollection = db.collection('products');
    
    // Find all existing products
    const products = await productsCollection.find({}).toArray();
    console.log(`Found ${products.length} products to migrate`);
    
    // Process each product
    for (const product of products) {
      // Convert the old product to new format
      const newProduct = {
        // Ensure required fields have values
        name: product.name || 'Unnamed Product',
        category: product.category || 'Uncategorized',
        gender: product.gender || 'Mixte',
        
        // Add default price if it doesn't exist
        price: product.price || 0,
        
        // Convert imageUrl to images array or use existing images array
        images: product.images || (product.imageUrl ? [product.imageUrl] : []),
        
        // Keep other fields
        inspiredBy: product.inspiredBy,
        description: product.description,
        volume: product.volume,
        tags: product.tags || [],
        ingredients: product.ingredients,
        createdAt: product.createdAt || new Date(),
        updatedAt: new Date()
      };
      
      // Update the product in the database
      console.log(`Migrating product: ${product.name}`);
      await productsCollection.updateOne(
        { _id: product._id },
        { $set: newProduct },
        { upsert: true }
      );
    }
    
    console.log('Migration completed successfully');
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    // Close the MongoDB connection
    if (client) {
      await client.close();
      console.log('MongoDB connection closed');
    }
    process.exit(0);
  }
}

// Run the migration
migrateProducts(); 