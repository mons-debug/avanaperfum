// This script simulates the migration process without connecting to MongoDB
// It will show what changes would be made to the products

// Sample product data (simulating what would be in the database)
const sampleProducts = [
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
  },
  {
    _id: '3',
    name: 'Sample Perfume 3',
    gender: 'Mixte',
    images: ['/images/products/sample3.jpg', '/images/products/sample3-2.jpg'],
    volume: '75ml',
    price: 45.99
  }
];

function simulateMigration() {
  console.log('Starting migration simulation...');
  console.log(`Found ${sampleProducts.length} products to migrate`);
  
  // Process each product
  for (const product of sampleProducts) {
    console.log(`\nMigrating product: ${product.name}`);
    console.log('Original product data:');
    console.log(JSON.stringify(product, null, 2));
    
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
    
    // Remove the old imageUrl field
    delete newProduct.imageUrl;
    
    console.log('Migrated product data:');
    console.log(JSON.stringify(newProduct, null, 2));
    console.log('-------------------');
  }
  
  console.log('\nMigration simulation completed successfully');
}

// Run the simulation
simulateMigration(); 