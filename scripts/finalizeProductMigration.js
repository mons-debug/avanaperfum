// This script converts exported products to the new schema format
const fs = require('fs');
const path = require('path');

// Input directory where exported products are located
const INPUT_DIR = path.join(__dirname, '../data/export');

// Output directory for migrated products
const OUTPUT_DIR = path.join(__dirname, '../data/migrated');

function migrateProducts() {
  console.log('Starting export migration...');
  
  try {
    // Create output directory if it doesn't exist
    if (!fs.existsSync(OUTPUT_DIR)) {
      fs.mkdirSync(OUTPUT_DIR, { recursive: true });
      console.log(`Created output directory: ${OUTPUT_DIR}`);
    }
    
    // Find all JSON files in the input directory
    const files = fs.readdirSync(INPUT_DIR)
      .filter(file => file.endsWith('.json'));
    
    console.log(`Found ${files.length} JSON files to process`);
    
    if (files.length === 0) {
      console.log('No exported product files found. Run npm run export-products first.');
      return;
    }
    
    let processedProducts = 0;
    
    // Process each JSON file
    for (const file of files) {
      const inputPath = path.join(INPUT_DIR, file);
      const fileContent = fs.readFileSync(inputPath, 'utf8');
      let productData;
      
      try {
        productData = JSON.parse(fileContent);
      } catch (err) {
        console.error(`Error parsing ${file}: ${err.message}`);
        continue;
      }
      
      // If it's an array, process each product separately
      const products = Array.isArray(productData) ? productData : [productData];
      const migratedProducts = [];
      
      for (const product of products) {
        // Convert the product to the new format
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
        
        migratedProducts.push(newProduct);
        processedProducts++;
      }
      
      // Write the migrated data to the output directory
      const outputFile = path.join(OUTPUT_DIR, `migrated-${file}`);
      fs.writeFileSync(outputFile, JSON.stringify(
        Array.isArray(productData) ? migratedProducts : migratedProducts[0], 
        null, 
        2
      ));
      
      console.log(`✅ Migrated ${file} to ${outputFile}`);
    }
    
    // Create a single file with all migrated products
    const allMigratedFile = path.join(OUTPUT_DIR, 'all-migrated-products.json');
    const allProducts = files.reduce((acc, file) => {
      if (file === 'all-migrated-products.json') return acc;
      
      const migrated = path.join(OUTPUT_DIR, `migrated-${file}`);
      if (fs.existsSync(migrated)) {
        const content = JSON.parse(fs.readFileSync(migrated, 'utf8'));
        if (Array.isArray(content)) {
          return [...acc, ...content];
        } else {
          return [...acc, content];
        }
      }
      return acc;
    }, []);
    
    fs.writeFileSync(allMigratedFile, JSON.stringify(allProducts, null, 2));
    
    console.log('\n✅ Migration completed successfully');
    console.log(`Processed ${processedProducts} products in ${files.length} files`);
    console.log(`All migrated products are available in ${allMigratedFile}`);
  } catch (error) {
    console.error('❌ Migration failed:', error);
  }
}

// Run the migration
migrateProducts(); 