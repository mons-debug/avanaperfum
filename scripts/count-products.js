const { MongoClient } = require('mongodb');
const path = require('path');

// Load environment variables
require('dotenv').config({ path: path.join(__dirname, '..', '.env.local') });
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

async function countProducts() {
  let client;
  
  try {
    console.log('🔍 Vérification du nombre de produits dans la base de données...');
    
    client = new MongoClient(process.env.MONGODB_URI);
    await client.connect();
    console.log('📊 Connecté à MongoDB');
    
    const db = client.db();
    const collection = db.collection('products');
    
    // Count total products
    const totalCount = await collection.countDocuments();
    console.log(`📦 Total des produits : ${totalCount}`);
    
    // Count by gender
    const hommeCount = await collection.countDocuments({ gender: 'Homme' });
    const femmeCount = await collection.countDocuments({ gender: 'Femme' });
    const mixteCount = await collection.countDocuments({ gender: 'Mixte' });
    
    console.log('\n📊 Répartition par genre :');
    console.log(`   👨 Homme : ${hommeCount}`);
    console.log(`   👩 Femme : ${femmeCount}`);
    console.log(`   ⚤  Mixte : ${mixteCount}`);
    
    // Get sample products to verify data
    console.log('\n📝 Échantillon de produits :');
    const sampleProducts = await collection.find({}).limit(5).toArray();
    sampleProducts.forEach((product, index) => {
      console.log(`${index + 1}. ${product.name} (${product.gender}) - ${product.price} DH`);
    });
    
    // Check if all products have required fields
    const withoutName = await collection.countDocuments({ name: { $exists: false } });
    const withoutGender = await collection.countDocuments({ gender: { $exists: false } });
    const withoutPrice = await collection.countDocuments({ price: { $exists: false } });
    
    console.log('\n⚠️  Produits avec données manquantes :');
    console.log(`   Sans nom : ${withoutName}`);
    console.log(`   Sans genre : ${withoutGender}`);
    console.log(`   Sans prix : ${withoutPrice}`);
    
    console.log('\n✅ Vérification terminée !');
    
  } catch (error) {
    console.error('❌ Erreur lors de la vérification:', error);
  } finally {
    if (client) {
      await client.close();
      console.log('📊 Déconnecté de MongoDB');
    }
  }
}

// Run the count
countProducts(); 