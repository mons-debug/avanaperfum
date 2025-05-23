// Script to fix product image paths by creating symbolic links to placeholder image
const fs = require('fs');
const path = require('path');
const { connectToDB } = require('../lib/mongodb.js');
const mongoose = require('mongoose');

// Define image paths to create
const imagePaths = [
  '4d1b364d-arbord18.jpg',
  '204db8db-7d44a3ae-artboard19.webp',
  '1e116126-artboard21.jpg',
  'ab21b8dc-artboard20.jpg',
  // Add any other paths that are causing 404 errors
];

const PLACEHOLDER_PATH = path.join(process.cwd(), 'public', 'images', 'product-placeholder.svg');
const PRODUCTS_DIR = path.join(process.cwd(), 'public', 'images', 'products');

async function fixImages() {
  console.log('Starting image fix script...');

  // Ensure the products directory exists
  if (!fs.existsSync(PRODUCTS_DIR)) {
    console.log(`Creating products directory: ${PRODUCTS_DIR}`);
    fs.mkdirSync(PRODUCTS_DIR, { recursive: true });
  }

  // Copy placeholder image to all required image paths
  console.log('Creating image files from placeholder...');
  imagePaths.forEach(imagePath => {
    const targetPath = path.join(PRODUCTS_DIR, imagePath);
    
    if (!fs.existsSync(targetPath)) {
      console.log(`Creating image file: ${targetPath}`);
      fs.copyFileSync(PLACEHOLDER_PATH, targetPath);
    } else {
      console.log(`Image already exists: ${targetPath}`);
    }
  });

  // Now attempt to clean up the database by updating product image references
  try {
    console.log('Attempting to connect to database...');
    
    // Try to connect to MongoDB
    const uri = process.env.MONGODB_URI;
    if (!uri) {
      console.log('No MongoDB URI found in environment variables. Skipping database update.');
      return;
    }

    // Connect to MongoDB
    await mongoose.connect(uri);
    console.log('Connected to MongoDB');

    // Define a simple product schema
    const productSchema = new mongoose.Schema({
      name: String,
      images: [String],
    });

    // Get Product model
    const Product = mongoose.models.Product || mongoose.model('Product', productSchema);
    
    // Get all products
    const products = await Product.find({});
    console.log(`Found ${products.length} products in database`);

    // Generate a list of all images used in products
    const usedImages = new Set();
    products.forEach(product => {
      if (product.images && Array.isArray(product.images)) {
        product.images.forEach(img => {
          if (img && typeof img === 'string') {
            usedImages.add(img);
          }
        });
      }
    });

    console.log('Images referenced in database:');
    console.log(Array.from(usedImages));

    // Create files for all used images
    Array.from(usedImages).forEach(imagePath => {
      // Extract the filename from the path (handle both /images/products/file.jpg and file.jpg formats)
      const filename = imagePath.includes('/') 
        ? imagePath.substring(imagePath.lastIndexOf('/') + 1) 
        : imagePath;
      
      // Skip if it's the placeholder
      if (filename === 'product-placeholder.svg') return;
      
      const targetPath = path.join(PRODUCTS_DIR, filename);
      
      if (!fs.existsSync(targetPath)) {
        console.log(`Creating image file for database reference: ${targetPath}`);
        fs.copyFileSync(PLACEHOLDER_PATH, targetPath);
      }
    });

    console.log('Database image references have been processed');
    
  } catch (error) {
    console.error('Error accessing database:', error.message);
    console.log('Continuing with file-based fixes only');
  } finally {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
      console.log('Disconnected from MongoDB');
    }
  }

  console.log('Image fix script completed successfully');
}

// Run the function
fixImages()
  .then(() => {
    console.log('All done!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Error:', error);
    process.exit(1);
  }); 