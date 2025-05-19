import { connectToDB } from '../lib/mongodb';
import mongoose from 'mongoose';

// Define a schema for the old product model
const OldProductSchema = new mongoose.Schema({
  name: String,
  inspiredBy: String,
  description: String,
  volume: String,
  tags: [String],
  ingredients: String,
  imageUrl: String,
  category: String,
  gender: { type: String, enum: ['Homme', 'Femme', 'Mixte'] },
  createdAt: { type: Date, default: Date.now },
});

// Define the updated schema (same as in the models/Product.ts)
const NewProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  inspiredBy: String,
  description: String,
  volume: String,
  tags: [String],
  ingredients: String,
  images: { type: [String], default: [] },
  price: { type: Number, default: 0 },
  category: { type: String, required: true },
  gender: { type: String, enum: ['Homme', 'Femme', 'Mixte'], required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

async function migrateProducts() {
  console.log('Starting product migration...');
  
  try {
    // Connect to the database
    await connectToDB();
    console.log('Connected to MongoDB');
    
    // Create temporary models to read old and write new data
    const OldProduct = mongoose.models.OldProduct || mongoose.model('OldProduct', OldProductSchema, 'products');
    const NewProduct = mongoose.models.Product || mongoose.model('Product', NewProductSchema, 'products');
    
    // Find all existing products
    const oldProducts = await OldProduct.find({}).lean();
    console.log(`Found ${oldProducts.length} products to migrate`);
    
    // Process each product
    for (const product of oldProducts) {
      // Convert the old product to new format
      const newProduct: any = {
        ...product,
        // Ensure required fields have values
        name: product.name || 'Unnamed Product',
        category: product.category || 'Uncategorized',
        gender: product.gender || 'Mixte',
        
        // Add default price
        price: 0,
        
        // Convert imageUrl to images array
        images: product.imageUrl ? [product.imageUrl] : [],
        
        // Add updatedAt
        updatedAt: new Date()
      };
      
      // Remove the old imageUrl field
      delete newProduct.imageUrl;
      
      // Update the product in the database
      console.log(`Migrating product: ${product.name}`);
      await NewProduct.findByIdAndUpdate(
        product._id,
        newProduct,
        { upsert: true, new: true }
      );
    }
    
    console.log('Migration completed successfully');
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    // Close the MongoDB connection
    await mongoose.connection.close();
    console.log('MongoDB connection closed');
    process.exit(0);
  }
}

// Run the migration
migrateProducts(); 