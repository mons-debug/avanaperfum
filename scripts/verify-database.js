const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

// Product Schema
const productSchema = new mongoose.Schema({
  name: String,
  slug: String,
  description: String,
  price: Number,
  volume: String,
  gender: String,
  inspiration: String,
  category: String,
  tags: [String],
  ingredients: String,
  inStock: Boolean,
  featured: Boolean,
  images: [String],
  createdAt: Date,
  updatedAt: Date
});

const Product = mongoose.model('Product', productSchema);

async function verifyDatabase() {
  try {
    console.log('🔍 Connecting to MongoDB database...');
    
    // Try different ways to get the MongoDB URI
    const MONGODB_URI = process.env.MONGODB_URI || 
                       process.env.NEXT_PUBLIC_MONGODB_URI ||
                       process.env.MONGO_URI;
    
    if (!MONGODB_URI) {
      console.error('❌ No MongoDB URI found in environment variables');
      console.log('Available env vars:', Object.keys(process.env).filter(k => k.includes('MONGO')));
      return;
    }
    
    console.log('Using MongoDB URI:', MONGODB_URI.replace(/\/\/[^:]+:[^@]+@/, '//***:***@'));
    
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB successfully');
    
    // Get total count
    const totalCount = await Product.countDocuments();
    console.log(`\n📦 TOTAL PRODUCTS IN DATABASE: ${totalCount}`);
    
    // Get gender breakdown
    const genderStats = await Product.aggregate([
      { $group: { _id: '$gender', count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]);
    
    console.log('\n👥 Gender breakdown:');
    genderStats.forEach(stat => {
      console.log(`   ${stat._id}: ${stat.count} products`);
    });
    
    // Check for AVANA products specifically
    const avanaCount = await Product.countDocuments({ name: { $regex: /^AVANA -/i } });
    console.log(`\n🎯 AVANA products: ${avanaCount}`);
    
    if (avanaCount > 0) {
      const avanaProducts = await Product.find({ name: { $regex: /^AVANA -/i } }, 'name gender').sort({ name: 1 });
      console.log('\n📝 AVANA products list:');
      avanaProducts.forEach((product, index) => {
        console.log(`   ${index + 1}. ${product.name} (${product.gender})`);
      });
    }
    
    // Get latest 10 products by creation date
    console.log('\n🕒 Latest 10 products added:');
    const latestProducts = await Product.find({}, 'name createdAt gender')
      .sort({ createdAt: -1 })
      .limit(10);
    
    latestProducts.forEach((product, index) => {
      const date = product.createdAt ? new Date(product.createdAt).toLocaleString() : 'No date';
      console.log(`   ${index + 1}. ${product.name} (${product.gender}) - ${date}`);
    });
    
    // Check for potential duplicates
    const duplicates = await Product.aggregate([
      { $group: { _id: '$name', count: { $sum: 1 }, ids: { $push: '$_id' } } },
      { $match: { count: { $gt: 1 } } }
    ]);
    
    if (duplicates.length > 0) {
      console.log(`\n⚠️  Found ${duplicates.length} duplicate product names:`);
      duplicates.forEach(dup => {
        console.log(`   "${dup._id}" appears ${dup.count} times`);
      });
    } else {
      console.log('\n✅ No duplicate product names found');
    }
    
    // Summary
    console.log('\n' + '='.repeat(50));
    console.log('📊 DATABASE SUMMARY');
    console.log('='.repeat(50));
    console.log(`📦 Total Products: ${totalCount}`);
    console.log(`🎯 AVANA Products: ${avanaCount}`);
    console.log(`🔄 Other Products: ${totalCount - avanaCount}`);
    console.log('='.repeat(50));
    
    await mongoose.disconnect();
    console.log('\n📊 Disconnected from MongoDB');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.message.includes('ENOTFOUND')) {
      console.log('💡 This looks like a DNS/connection issue. Make sure your MongoDB URI is correct.');
    }
  }
}

verifyDatabase(); 