const { MongoClient } = require('mongodb');
const fs = require('fs');
const path = require('path');

// Connection settings
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const DB_NAME = 'avana';
const COLLECTION_NAME = 'products';

// Path to the CSV file
const CSV_FILE = path.join(__dirname, '../Produits_AVANA_avec_Ingr_dients.csv');

function parseCSV(csvText) {
  const lines = csvText.split('\n').filter(line => line.trim() !== '');
  const headers = lines[0].split(',').map(h => h.trim());
  const products = [];

  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',').map(v => v.trim().replace(/"/g, ''));
    const product = {};
    
    headers.forEach((header, index) => {
      product[header] = values[index] || '';
    });
    
    products.push(product);
  }
  
  return products;
}

function createSlug(name) {
  return name
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim('-');
}

function mapCSVToProduct(csvProduct) {
  const productName = csvProduct['Product Name'] || '';
  const inspiration = csvProduct['Inspired By'] || '';
  const description = csvProduct['Description'] || '';
  const price = parseFloat(csvProduct['Price']) || 99;
  const volume = csvProduct['Volume (ml)'] || '50ml';
  const gender = csvProduct['Gender'] || 'Unisexe';
  const ingredients = csvProduct['Ingredients'] || '';

  return {
    name: productName,
    slug: createSlug(productName),
    description: description,
    price: price,
    volume: volume,
    gender: gender.toLowerCase(),
    inspiration: inspiration,
    category: 'Parfum',
    tags: csvProduct['Tags'] ? csvProduct['Tags'].split(',').map(t => t.trim()) : [],
    ingredients: ingredients,
    inStock: true,
    featured: false,
    images: ['/images/products/demo-product.jpg'], // Default image
    createdAt: new Date(),
    updatedAt: new Date()
  };
}

async function importCSVProducts() {
  console.log('Starting CSV product import...');
  
  // Check if the CSV file exists
  if (!fs.existsSync(CSV_FILE)) {
    console.error(`❌ CSV file not found: ${CSV_FILE}`);
    return;
  }
  
  let client;
  
  try {
    // Read and parse the CSV file
    const csvText = fs.readFileSync(CSV_FILE, 'utf8');
    const csvProducts = parseCSV(csvText);
    
    if (csvProducts.length === 0) {
      console.error('❌ No products found in CSV file');
      return;
    }
    
    console.log(`Found ${csvProducts.length} products in CSV`);
    
    // Connect to MongoDB
    client = new MongoClient(MONGODB_URI);
    await client.connect();
    console.log('✅ Connected to MongoDB');
    
    const db = client.db(DB_NAME);
    const productsCollection = db.collection(COLLECTION_NAME);
    
    // Clear existing products first
    console.log('Clearing existing products...');
    await productsCollection.deleteMany({});
    console.log('✅ Existing products cleared');
    
    // Convert CSV products to database format
    const products = csvProducts.map(mapCSVToProduct);
    
    // Insert all products
    const result = await productsCollection.insertMany(products);
    
    console.log('\n✅ CSV import completed successfully');
    console.log(`Inserted ${result.insertedCount} products from CSV`);
    
    // Display summary
    console.log('\n📊 Import Summary:');
    products.forEach((product, index) => {
      console.log(`${index + 1}. ${product.name} (${product.gender})`);
    });
    
  } catch (error) {
    console.error('❌ Import failed:', error);
  } finally {
    if (client) {
      await client.close();
      console.log('MongoDB connection closed');
    }
  }
}

// Run the import
importCSVProducts(); 