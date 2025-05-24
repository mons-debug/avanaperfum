const fs = require('fs');
const path = require('path');
const { MongoClient } = require('mongodb');

// Read environment variables
require('dotenv').config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('❌ MONGODB_URI not found in environment variables');
  process.exit(1);
}

function parseCSV(content) {
  const lines = content.trim().split('\n');
  const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
  
  return lines.slice(1).map(line => {
    // Handle CSV parsing with proper quote handling
    const values = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        values.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    values.push(current.trim()); // Add the last value
    
    // Create object from headers and values
    const obj = {};
    headers.forEach((header, index) => {
      obj[header] = values[index] || '';
    });
    
    return obj;
  });
}

function transformProduct(csvRow) {
  // Generate slug from product name
  const generateSlug = (name) => {
    return name
      .toLowerCase()
      .replace(/[àáâãäå]/g, 'a')
      .replace(/[èéêë]/g, 'e')
      .replace(/[ìíîï]/g, 'i')
      .replace(/[òóôõö]/g, 'o')
      .replace(/[ùúûü]/g, 'u')
      .replace(/[ñ]/g, 'n')
      .replace(/[ç]/g, 'c')
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim('-');
  };

  // Parse tags (they appear to be comma-separated in the CSV)
  const tags = csvRow.Tags ? csvRow.Tags.split(',').map(tag => tag.trim()) : [];
  
  return {
    name: csvRow['Product Name'],
    slug: generateSlug(csvRow['Product Name']),
    description: csvRow.Description,
    price: parseFloat(csvRow.Price),
    volume: csvRow['Volume (ml)'],
    gender: csvRow.Gender,
    category: csvRow.Category,
    inspiredBy: csvRow['Inspired By'],
    tags: tags,
    ingredients: csvRow.Ingredients,
    
    // Default values for required fields
    images: [], // Will be added later via admin
    featured: false,
    inStock: true,
    stockQuantity: 100, // Default stock
    
    // Metadata
    createdAt: new Date(),
    updatedAt: new Date(),
    
    // SEO fields
    metaTitle: csvRow['Product Name'],
    metaDescription: csvRow.Description.substring(0, 160),
  };
}

async function importProducts() {
  console.log('🚀 Starting AVANA products import...');
  
  let client;
  
  try {
    // Read CSV file
    const csvPath = path.join(process.cwd(), 'Produits_AVANA_avec_Ingr_dients.csv');
    
    if (!fs.existsSync(csvPath)) {
      throw new Error(`CSV file not found at: ${csvPath}`);
    }
    
    console.log('📄 Reading CSV file...');
    const csvContent = fs.readFileSync(csvPath, 'utf8');
    
    // Parse CSV
    console.log('📊 Parsing CSV data...');
    const csvData = parseCSV(csvContent);
    console.log(`Found ${csvData.length} products in CSV`);
    
    // Transform data
    console.log('🔄 Transforming product data...');
    const products = csvData.map(transformProduct);
    
    // Connect to MongoDB
    console.log('🔌 Connecting to MongoDB...');
    client = new MongoClient(MONGODB_URI);
    await client.connect();
    
    const db = client.db();
    const productsCollection = db.collection('products');
    
    // Check for existing products (by name to avoid duplicates)
    console.log('🔍 Checking for existing products...');
    const existingProducts = await productsCollection.find({
      name: { $in: products.map(p => p.name) }
    }).toArray();
    
    if (existingProducts.length > 0) {
      console.log(`⚠️ Found ${existingProducts.length} existing products with same names:`);
      existingProducts.forEach(product => {
        console.log(`  - ${product.name}`);
      });
      
      console.log('\n❓ Do you want to continue and skip duplicates? (This will only add new products)');
      console.log('   Or do you want to exit and handle duplicates manually?');
      console.log('\n   Continuing with import, skipping duplicates...\n');
      
      // Filter out duplicates
      const existingNames = existingProducts.map(p => p.name);
      const newProducts = products.filter(p => !existingNames.includes(p.name));
      
      if (newProducts.length === 0) {
        console.log('✅ All products already exist in database. No new products to add.');
        return;
      }
      
      console.log(`📦 Will import ${newProducts.length} new products (skipping ${products.length - newProducts.length} duplicates)`);
      products.splice(0, products.length, ...newProducts);
    }
    
    // Insert products
    if (products.length > 0) {
      console.log(`📥 Inserting ${products.length} products into database...`);
      const result = await productsCollection.insertMany(products);
      console.log(`✅ Successfully inserted ${result.insertedCount} products`);
      
      // Display summary
      console.log('\n📋 Import Summary:');
      console.log(`  Total products in CSV: ${csvData.length}`);
      console.log(`  Products imported: ${result.insertedCount}`);
      console.log(`  Products skipped (duplicates): ${csvData.length - result.insertedCount}`);
      
      // Display sample of imported products
      console.log('\n🔍 Sample of imported products:');
      products.slice(0, 3).forEach((product, index) => {
        console.log(`  ${index + 1}. ${product.name} - ${product.price} DH (${product.gender})`);
      });
      
      if (products.length > 3) {
        console.log(`  ... and ${products.length - 3} more products`);
      }
      
      console.log('\n💡 Next steps:');
      console.log('  1. Go to Admin Panel → Products');
      console.log('  2. Add images for each product');
      console.log('  3. Verify product details');
      console.log('  4. Set featured products if needed');
      
    } else {
      console.log('ℹ️ No new products to import');
    }
    
  } catch (error) {
    console.error('❌ Error importing products:', error.message);
    console.error('Stack trace:', error.stack);
    process.exit(1);
  } finally {
    if (client) {
      await client.close();
      console.log('🔌 Database connection closed');
    }
  }
}

// Run the import
if (require.main === module) {
  importProducts().then(() => {
    console.log('\n🎉 Import process completed!');
    process.exit(0);
  }).catch(error => {
    console.error('💥 Fatal error:', error);
    process.exit(1);
  });
}

module.exports = { importProducts }; 