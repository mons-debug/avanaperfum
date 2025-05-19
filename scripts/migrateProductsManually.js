// A script to manually perform migration by generating JSON output
const fs = require('fs');
const path = require('path');

// Sample product data - Replace this with your actual product data
const currentProducts = [
  {
    _id: '1',
    name: 'Sample Perfume 1',
    category: 'Eau de Parfum',
    gender: 'Femme',
    imageUrl: '/images/products/sample1.jpg',
    volume: '100ml',
    tags: ['floral', 'fresh'],
    ingredients: 'Alcohol, Water, Fragrance',
    description: 'A beautiful floral scent',
    inspiredBy: 'Designer Brand 1'
  },
  {
    _id: '2',
    name: 'Sample Perfume 2',
    category: 'Eau de Toilette',
    gender: 'Homme',
    imageUrl: '/images/products/sample2.jpg',
    volume: '50ml',
    tags: ['woody', 'spicy'],
    ingredients: 'Alcohol, Water, Fragrance',
    description: 'A masculine woody scent',
    inspiredBy: 'Designer Brand 2'
  }
];

// Directory to store migrated product data
const OUTPUT_DIR = path.join(__dirname, '../data/products');

function migrateProducts() {
  console.log('Starting manual migration...');
  
  try {
    // Create output directory if it doesn't exist
    if (!fs.existsSync(OUTPUT_DIR)) {
      fs.mkdirSync(OUTPUT_DIR, { recursive: true });
      console.log(`Created output directory: ${OUTPUT_DIR}`);
    }
    
    console.log(`Found ${currentProducts.length} products to migrate`);
    const migratedProducts = [];
    
    // Process each product
    for (const product of currentProducts) {
      // Convert the old product to new format
      const newProduct = {
        _id: product._id,
        name: product.name || 'Unnamed Product',
        category: product.category || 'Uncategorized',
        gender: product.gender || 'Mixte',
        price: product.price || 0,
        images: product.images || (product.imageUrl ? [product.imageUrl] : []),
        inspiredBy: product.inspiredBy,
        description: product.description,
        volume: product.volume,
        tags: product.tags || [],
        ingredients: product.ingredients,
        createdAt: product.createdAt || new Date(),
        updatedAt: new Date()
      };
      
      // Remove the old imageUrl field
      delete newProduct.imageUrl;
      
      console.log(`Migrating product: ${product.name}`);
      migratedProducts.push(newProduct);
      
      // Write individual product to file
      const filename = path.join(OUTPUT_DIR, `${product._id}.json`);
      fs.writeFileSync(filename, JSON.stringify(newProduct, null, 2));
      console.log(`Wrote product data to ${filename}`);
    }
    
    // Write all products to a single file
    const allProductsFile = path.join(OUTPUT_DIR, 'all-products.json');
    fs.writeFileSync(allProductsFile, JSON.stringify(migratedProducts, null, 2));
    console.log(`Wrote all products to ${allProductsFile}`);
    
    console.log('Migration completed successfully');
    console.log(`\nThe migrated product data is available in ${OUTPUT_DIR}`);
    console.log('You can manually import these files into your MongoDB database or update your code to use them.');
  } catch (error) {
    console.error('Migration failed:', error);
  }
}

// Run the migration
migrateProducts(); 