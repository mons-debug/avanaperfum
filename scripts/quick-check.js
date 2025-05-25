const { MongoClient } = require('mongodb');

async function quickCheck() {
  try {
    // First try to get MONGODB_URI from environment, or use a default
    const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://abdelhadi:GH4YE3sIEKyNNW0J@cluster0.fcdeo.mongodb.net/avana?retryWrites=true&w=majority';
    
    const client = new MongoClient(MONGODB_URI);
    await client.connect();
    console.log('✅ Connected to MongoDB');
    
    const db = client.db('avana');
    const collection = db.collection('products');
    
    // Get total count
    const totalCount = await collection.countDocuments();
    console.log(`📦 Total products: ${totalCount}`);
    
    // Get latest 10 products
    const latestProducts = await collection.find({}, {name: 1, createdAt: 1})
      .sort({createdAt: -1})
      .limit(10)
      .toArray();
    
    console.log('\n📝 Latest 10 products:');
    latestProducts.forEach((product, index) => {
      const date = product.createdAt ? new Date(product.createdAt).toLocaleString() : 'No date';
      console.log(`${index + 1}. ${product.name} (${date})`);
    });
    
    // Check for AVANA products specifically
    const avanaProducts = await collection.find({ name: { $regex: /^AVANA -/ } }, {name: 1}).toArray();
    console.log(`\n🎯 AVANA products found: ${avanaProducts.length}`);
    
    if (avanaProducts.length > 0) {
      console.log('AVANA products:');
      avanaProducts.forEach((product, index) => {
        console.log(`${index + 1}. ${product.name}`);
      });
    }
    
    await client.close();
    console.log('📊 Disconnected from MongoDB');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

quickCheck(); 