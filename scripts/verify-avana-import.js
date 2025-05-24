const { MongoClient } = require('mongodb');
require('dotenv').config({ path: '.env.local' });

async function verifyImport() {
  const client = new MongoClient(process.env.MONGODB_URI);
  await client.connect();
  const db = client.db();
  
  console.log('🔍 Verifying AVANA products import...\n');
  
  // Count total AVANA products
  const count = await db.collection('products').countDocuments({ 
    name: { $regex: /^AVANA/ } 
  });
  console.log(`📊 Total AVANA products in database: ${count}`);
  
  // Get some sample products
  const samples = await db.collection('products')
    .find({ name: { $regex: /^AVANA/ } })
    .limit(5)
    .toArray();
  
  console.log('\n📋 Sample imported products:');
  samples.forEach((product, index) => {
    console.log(`  ${index + 1}. ${product.name}`);
    console.log(`     💰 Price: ${product.price} DH`);
    console.log(`     👤 Gender: ${product.gender}`);
    console.log(`     ✨ Inspired by: ${product.inspiredBy}`);
    console.log(`     🔗 Slug: ${product.slug}`);
    console.log(`     🏷️ Tags: ${product.tags?.join(', ') || 'None'}`);
    console.log('');
  });
  
  // Check gender distribution
  const genderStats = await db.collection('products').aggregate([
    { $match: { name: { $regex: /^AVANA/ } } },
    { $group: { _id: '$gender', count: { $sum: 1 } } }
  ]).toArray();
  
  console.log('👫 Gender distribution:');
  genderStats.forEach(stat => {
    console.log(`   ${stat._id}: ${stat.count} products`);
  });
  
  // Check if products have all required fields
  const missingImages = await db.collection('products').countDocuments({
    name: { $regex: /^AVANA/ },
    $or: [
      { images: { $exists: false } },
      { images: { $size: 0 } }
    ]
  });
  
  console.log(`\n📸 Products needing images: ${missingImages} (Expected: all ${count} products)`);
  
  console.log('\n✅ Verification complete!');
  console.log('\n💡 Next steps:');
  console.log('   1. Log into admin panel: /admin');
  console.log('   2. Go to Products section');
  console.log('   3. Add images for each AVANA product');
  console.log('   4. Review and edit product details if needed');
  
  await client.close();
}

verifyImport().catch(console.error); 