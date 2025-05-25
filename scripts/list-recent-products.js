const { MongoClient } = require('mongodb');
const path = require('path');

// Load environment variables
require('dotenv').config({ path: path.join(__dirname, '..', '.env.local') });
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

async function listRecentProducts() {
  let client;
  
  try {
    console.log('📋 Listing des produits les plus récents...');
    
    client = new MongoClient(process.env.MONGODB_URI);
    await client.connect();
    console.log('📊 Connecté à MongoDB');
    
    const db = client.db();
    const collection = db.collection('products');
    
    // Get all products sorted by creation date (newest first)
    const products = await collection.find({})
      .sort({ createdAt: -1 })
      .toArray();
    
    console.log(`📦 Total : ${products.length} produits trouvés\n`);
    
    console.log('📝 Liste complète des produits (du plus récent au plus ancien) :');
    console.log('================================================================');
    
    products.forEach((product, index) => {
      const createdDate = product.createdAt ? new Date(product.createdAt).toLocaleString('fr-FR') : 'Date inconnue';
      const name = typeof product.name === 'object' ? product.name.fr || product.name.en || 'Nom inconnu' : product.name;
      
      console.log(`${index + 1}. ${name}`);
      console.log(`   Genre: ${product.gender}`);
      console.log(`   Prix: ${product.price} DH`);
      console.log(`   Créé: ${createdDate}`);
      console.log(`   ID: ${product._id}`);
      console.log('');
    });
    
    // Check for products created in the last 24 hours
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    
    const recentProducts = await collection.find({
      createdAt: { $gte: yesterday }
    }).toArray();
    
    console.log(`🕒 Produits créés dans les dernières 24h : ${recentProducts.length}`);
    
    if (recentProducts.length > 0) {
      console.log('\n📅 Produits récents :');
      recentProducts.forEach((product, index) => {
        const name = typeof product.name === 'object' ? product.name.fr || product.name.en || 'Nom inconnu' : product.name;
        console.log(`${index + 1}. ${name} (${new Date(product.createdAt).toLocaleString('fr-FR')})`);
      });
    }
    
    console.log('\n✅ Listing terminé !');
    
  } catch (error) {
    console.error('❌ Erreur lors du listing:', error);
  } finally {
    if (client) {
      await client.close();
      console.log('📊 Déconnecté de MongoDB');
    }
  }
}

// Run the listing
listRecentProducts(); 