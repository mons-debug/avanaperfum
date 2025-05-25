const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Path to the CSV file
const CSV_FILE = path.join(__dirname, '../Produits_AVANA_avec_Ingr_dients.csv');

// Product Schema (copied from your models)
const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  volume: { type: String, required: true },
  gender: { type: String, required: true, enum: ['homme', 'femme', 'unisexe'] },
  inspiration: { type: String },
  category: { type: String, required: true },
  tags: [String],
  ingredients: { type: String },
  inStock: { type: Boolean, default: true },
  featured: { type: Boolean, default: false },
  images: [String],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const Product = mongoose.model('Product', productSchema);

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
    images: ['/images/products/demo-product.jpg'],
    createdAt: new Date(),
    updatedAt: new Date()
  };
}

async function connectToDB() {
  const MONGODB_URI = process.env.MONGODB_URI;
  
  if (!MONGODB_URI) {
    throw new Error('MONGODB_URI not found in environment variables');
  }

  console.log('Connecting to MongoDB...');
  await mongoose.connect(MONGODB_URI);
  console.log('✅ Connected to MongoDB');
}

async function importCSVDirect() {
  try {
    console.log('Starting direct CSV product import...');
    
    // Check if the CSV file exists
    if (!fs.existsSync(CSV_FILE)) {
      console.error(`❌ CSV file not found: ${CSV_FILE}`);
      return;
    }

    // Connect to MongoDB
    await connectToDB();

    // Read and parse the CSV file
    const csvText = fs.readFileSync(CSV_FILE, 'utf8');
    const csvProducts = parseCSV(csvText);
    
    if (csvProducts.length === 0) {
      console.error('❌ No products found in CSV file');
      return;
    }
    
    console.log(`Found ${csvProducts.length} products in CSV`);

    // Get existing products to check for duplicates
    console.log('Checking existing products...');
    const existingProducts = await Product.find({}, 'name').lean();
    console.log(`Found ${existingProducts.length} existing products`);

    // Create a set of existing product names to avoid duplicates
    const existingNames = new Set();
    existingProducts.forEach(product => {
      existingNames.add(product.name.toLowerCase());
    });

    // Convert CSV products to database format and filter out duplicates
    const products = csvProducts.map(mapCSVToProduct);
    const newProducts = products.filter(product => {
      const isDuplicate = existingNames.has(product.name.toLowerCase());
      if (isDuplicate) {
        console.log(`⚠️  Skipping duplicate: ${product.name}`);
      }
      return !isDuplicate;
    });

    console.log(`\n📊 Products to add: ${newProducts.length} (skipped ${products.length - newProducts.length} duplicates)`);

    if (newProducts.length === 0) {
      console.log('✅ No new products to add - all products already exist');
      return;
    }

    // Insert new products
    console.log('\nAdding new products...');
    let successCount = 0;
    let errorCount = 0;

    for (const productData of newProducts) {
      try {
        const product = new Product(productData);
        await product.save();
        successCount++;
        console.log(`✅ Added: ${productData.name}`);
      } catch (error) {
        errorCount++;
        console.log(`❌ Failed to add: ${productData.name} - Error: ${error.message}`);
      }
    }

    console.log('\n📊 Import Summary:');
    console.log(`✅ Successfully added: ${successCount} new products`);
    console.log(`❌ Failed: ${errorCount} products`);
    console.log(`⚠️  Skipped duplicates: ${products.length - newProducts.length} products`);
    console.log(`📝 Total processed: ${products.length} products from CSV`);

    // Verify final count
    const totalProducts = await Product.countDocuments();
    console.log(`🔢 Total products in database: ${totalProducts}`);

  } catch (error) {
    console.error('❌ Import failed:', error);
  } finally {
    // Close the database connection
    if (mongoose.connection.readyState === 1) {
      await mongoose.disconnect();
      console.log('📊 Disconnected from MongoDB');
    }
  }
}

// Run the import
importCSVDirect(); 