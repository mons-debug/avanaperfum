const fs = require('fs');
const path = require('path');

// Path to the CSV file
const CSV_FILE = path.join(__dirname, '../Produits_AVANA_avec_Ingr_dients.csv');

// Simple CSV parser
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
    images: ['/images/products/demo-product.jpg']
  };
}

async function makeAPIRequest(url, method = 'GET', data = null) {
  try {
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (data) {
      options.body = JSON.stringify(data);
    }

    const response = await fetch(url, options);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const result = await response.json();
    return { status: response.status, data: result };
  } catch (error) {
    console.error(`API request failed for ${url}:`, error.message);
    throw error;
  }
}

async function importCSVSimple() {
  console.log('🚀 Starting CSV product import...');
  
  // Check if the CSV file exists
  if (!fs.existsSync(CSV_FILE)) {
    console.error(`❌ CSV file not found: ${CSV_FILE}`);
    return;
  }

  try {
    // Read and parse the CSV file
    const csvText = fs.readFileSync(CSV_FILE, 'utf8');
    const csvProducts = parseCSV(csvText);
    
    if (csvProducts.length === 0) {
      console.error('❌ No products found in CSV file');
      return;
    }
    
    console.log(`📦 Found ${csvProducts.length} products in CSV`);
    
    const apiBaseUrl = 'http://localhost:3001';
    const products = csvProducts.map(mapCSVToProduct);
    
    let successCount = 0;
    let errorCount = 0;
    
    console.log('\n📝 Adding products one by one...');
    
    for (let i = 0; i < products.length; i++) {
      const product = products[i];
      try {
        console.log(`\n[${i + 1}/${products.length}] Processing: ${product.name}`);
        
        const result = await makeAPIRequest(`${apiBaseUrl}/api/products`, 'POST', product);
        
        if (result.status === 201) {
          successCount++;
          console.log(`✅ Successfully added: ${product.name}`);
        } else {
          errorCount++;
          console.log(`❌ Failed to add: ${product.name} - Status: ${result.status}`);
          console.log('Response:', result.data);
        }
        
        // Small delay to avoid overwhelming the API
        await new Promise(resolve => setTimeout(resolve, 100));
        
      } catch (error) {
        errorCount++;
        console.log(`❌ Error adding ${product.name}:`, error.message);
      }
    }
    
    console.log('\n' + '='.repeat(50));
    console.log('📊 IMPORT SUMMARY');
    console.log('='.repeat(50));
    console.log(`✅ Successfully added: ${successCount} products`);
    console.log(`❌ Failed: ${errorCount} products`);
    console.log(`📝 Total processed: ${products.length} products from CSV`);
    
    if (successCount > 0) {
      console.log('\n🔄 Clearing cache...');
      try {
        await makeAPIRequest(`${apiBaseUrl}/api/cache/clear`, 'POST');
        console.log('✅ Cache cleared successfully');
      } catch (error) {
        console.log('⚠️  Could not clear cache:', error.message);
      }
    }
    
    console.log('\n🎉 Import process completed!');
    
  } catch (error) {
    console.error('❌ Import failed:', error);
  }
}

// Check if fetch is available
if (typeof fetch === 'undefined') {
  console.log('Installing fetch...');
  global.fetch = require('node-fetch');
}

// Run the import
importCSVSimple(); 