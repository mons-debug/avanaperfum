const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.local' });

// Path to the CSV file
const CSV_FILE = path.join(__dirname, '../Produits_AVANA_avec_Ingr_dients.csv');

// Product Schema (exactly matching your existing one)
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

function parseCSVLine(line) {
  const result = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  
  // Add the last field
  result.push(current.trim());
  
  return result;
}

function parseCSV(csvText) {
  const lines = csvText.split('\n').filter(line => line.trim() !== '');
  const headers = parseCSVLine(lines[0]);
  const products = [];

  console.log('CSV Headers:', headers);

  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVLine(lines[i]);
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
  console.log('Mapping product:', csvProduct);
  
  const productName = csvProduct['Product Name'] || '';
  const inspiration = csvProduct['Inspired By'] || '';
  const description = csvProduct['Description'] || '';
  const price = parseFloat(csvProduct['Price']) || 99;
  const volume = csvProduct['Volume (ml)'] || '50ml';
  const gender = csvProduct['Gender'] || 'Unisexe';
  const ingredients = csvProduct['Ingredients'] || '';

  console.log('Gender value:', gender);

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

async function forceImportCSV() {
  try {
    console.log('🚀 Starting FORCED CSV import to database...');
    
    // Check CSV file
    if (!fs.existsSync(CSV_FILE)) {
      console.error(`❌ CSV file not found: ${CSV_FILE}`);
      return;
    }

    // Connect to MongoDB using the same connection as your app
    const MONGODB_URI = process.env.MONGODB_URI || 
                       process.env.NEXT_PUBLIC_MONGODB_URI ||
                       process.env.MONGO_URI;
    
    if (!MONGODB_URI) {
      console.error('❌ No MongoDB URI found');
      return;
    }

    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected successfully');

    // Parse CSV
    const csvText = fs.readFileSync(CSV_FILE, 'utf8');
    const csvProducts = parseCSV(csvText);
    console.log(`📦 Found ${csvProducts.length} products in CSV`);

    // Convert to database format
    const products = csvProducts.map(mapCSVToProduct);
    
    console.log('\n📝 Products to import:');
    products.forEach((product, index) => {
      console.log(`   ${index + 1}. ${product.name} (${product.gender})`);
    });

    console.log('\n💾 Inserting products into database...');
    
    let successCount = 0;
    let errorCount = 0;

    for (const productData of products) {
      try {
        // Create new product
        const product = new Product(productData);
        await product.save();
        successCount++;
        console.log(`✅ Saved: ${productData.name}`);
      } catch (error) {
        errorCount++;
        if (error.code === 11000) {
          console.log(`⚠️  Duplicate slug for: ${productData.name} - trying with modified slug`);
          
          // Try with a modified slug
          try {
            productData.slug = productData.slug + '-' + Date.now();
            const product = new Product(productData);
            await product.save();
            successCount++;
            console.log(`✅ Saved with modified slug: ${productData.name}`);
          } catch (retryError) {
            console.log(`❌ Failed even with modified slug: ${productData.name} - ${retryError.message}`);
          }
        } else {
          console.log(`❌ Failed to save: ${productData.name} - ${error.message}`);
        }
      }
    }

    // Verify the import
    console.log('\n🔍 Verifying import...');
    const totalCount = await Product.countDocuments();
    const avanaCount = await Product.countDocuments({ name: { $regex: /^AVANA -/i } });
    
    console.log('\n' + '='.repeat(60));
    console.log('📊 IMPORT RESULTS');
    console.log('='.repeat(60));
    console.log(`✅ Successfully imported: ${successCount} products`);
    console.log(`❌ Failed: ${errorCount} products`);
    console.log(`📦 Total products in database: ${totalCount}`);
    console.log(`🎯 AVANA products in database: ${avanaCount}`);
    console.log('='.repeat(60));

    if (avanaCount > 0) {
      console.log('\n🎉 SUCCESS! Your AVANA products are now in the database!');
    } else {
      console.log('\n❌ Import failed - no AVANA products found in database');
    }

    await mongoose.disconnect();
    console.log('\n📊 Disconnected from MongoDB');

  } catch (error) {
    console.error('❌ Import failed:', error.message);
    console.error('Full error:', error);
  }
}

forceImportCSV(); 