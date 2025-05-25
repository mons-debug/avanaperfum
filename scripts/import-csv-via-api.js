const fs = require('fs');
const path = require('path');

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
    images: ['/images/products/demo-product.jpg'] // Default image
  };
}

async function makeAPIRequest(url, method = 'GET', data = null) {
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
  const result = await response.json();
  return { status: response.status, data: result };
}

async function importCSVViaAPI() {
  console.log('Starting CSV product import via API...');
  
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
    
    console.log(`Found ${csvProducts.length} products in CSV`);
    
    const apiBaseUrl = 'http://localhost:3001'; // Adjust port if needed
    
    // Get existing products to check for duplicates
    console.log('Checking existing products...');
    
    try {
      const response = await makeAPIRequest(`${apiBaseUrl}/api/products`);
      console.log('API Response status:', response.status);
      console.log('API Response data type:', typeof response.data);
      
      let existingProducts = response.data;
      
      // Handle different response formats
      if (existingProducts && typeof existingProducts === 'object' && existingProducts.products) {
        existingProducts = existingProducts.products;
      }
      
      if (!Array.isArray(existingProducts)) {
        console.log('⚠️  Could not get existing products list, adding all products');
        existingProducts = [];
      }
      
      console.log(`Found ${existingProducts.length} existing products`);
      
      // Create a set of existing product names to avoid duplicates
      const existingNames = new Set();
      existingProducts.forEach(product => {
        if (product && product.name) {
          existingNames.add(product.name.toLowerCase());
        }
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
      
      let successCount = 0;
      let errorCount = 0;
      
      console.log('\nAdding new products...');
      for (const product of newProducts) {
        try {
          const result = await makeAPIRequest(`${apiBaseUrl}/api/products`, 'POST', product);
          
          if (result.status === 201) {
            successCount++;
            console.log(`✅ Added: ${product.name}`);
          } else {
            errorCount++;
            console.log(`❌ Failed to add: ${product.name} - Status: ${result.status}`);
          }
        } catch (error) {
          errorCount++;
          console.log(`❌ Error adding ${product.name}:`, error.message);
        }
      }
      
      console.log('\n📊 Import Summary:');
      console.log(`✅ Successfully added: ${successCount} new products`);
      console.log(`❌ Failed: ${errorCount} products`);
      console.log(`⚠️  Skipped duplicates: ${products.length - newProducts.length} products`);
      console.log(`📝 Total processed: ${products.length} products from CSV`);
      
      // Clear cache
      try {
        await makeAPIRequest(`${apiBaseUrl}/api/cache/clear`, 'POST');
        console.log('✅ Cache cleared');
      } catch (error) {
        console.log('Note: Could not clear cache');
      }
      
    } catch (error) {
      console.log('❌ Could not check existing products:', error.message);
      console.log('Adding all products anyway...');
      
      // If we can't check existing products, just add all
      const products = csvProducts.map(mapCSVToProduct);
      let successCount = 0;
      let errorCount = 0;
      
      for (const product of products) {
        try {
          const result = await makeAPIRequest(`${apiBaseUrl}/api/products`, 'POST', product);
          
          if (result.status === 201) {
            successCount++;
            console.log(`✅ Added: ${product.name}`);
          } else {
            errorCount++;
            console.log(`❌ Failed to add: ${product.name} - Status: ${result.status}`);
          }
        } catch (error) {
          errorCount++;
          console.log(`❌ Error adding ${product.name}:`, error.message);
        }
      }
      
      console.log('\n📊 Import Summary:');
      console.log(`✅ Successfully added: ${successCount} products`);
      console.log(`❌ Failed: ${errorCount} products`);
    }
    
  } catch (error) {
    console.error('❌ Import failed:', error);
  }
}

// Check if fetch is available (Node.js 18+)
if (typeof fetch === 'undefined') {
  // For older Node.js versions, we need to import fetch
  const { fetch } = require('undici');
  global.fetch = fetch;
}

// Run the import
importCSVViaAPI(); 