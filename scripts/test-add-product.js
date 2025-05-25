const { MongoClient } = require('mongodb');
const path = require('path');

// Load environment variables
require('dotenv').config({ path: path.join(__dirname, '..', '.env.local') });
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

async function testAddProduct() {
  let client;
  
  try {
    console.log('🧪 Test d\'ajout d\'un nouveau produit...');
    
    client = new MongoClient(process.env.MONGODB_URI);
    await client.connect();
    console.log('📊 Connecté à MongoDB');
    
    const db = client.db();
    const collection = db.collection('products');
    
    // Count products before adding
    const beforeCount = await collection.countDocuments();
    console.log(`📦 Produits avant ajout : ${beforeCount}`);
    
    // Create a test product
    const testProduct = {
      name: 'Test Parfum Nouveau',
      description: 'Un parfum test pour vérifier l\'ajout',
      price: 149,
      volume: '50ml',
      gender: 'Mixte',
      category: 'Test',
      inspiredBy: 'Test Original',
      images: ['/images/product-placeholder.svg'],
      ingredients: 'Alcool, Aqua, Parfum',
      featured: false,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    // Insert the test product
    const result = await collection.insertOne(testProduct);
    console.log('✅ Produit ajouté avec succès !');
    console.log(`📋 ID du nouveau produit: ${result.insertedId}`);
    
    // Count products after adding
    const afterCount = await collection.countDocuments();
    console.log(`📦 Produits après ajout : ${afterCount}`);
    
    // Verify the product was added
    const addedProduct = await collection.findOne({ _id: result.insertedId });
    if (addedProduct) {
      console.log('\n📝 Produit ajouté:');
      console.log(`   Nom: ${addedProduct.name}`);
      console.log(`   Prix: ${addedProduct.price} DH`);
      console.log(`   Genre: ${addedProduct.gender}`);
      console.log(`   Créé: ${addedProduct.createdAt.toLocaleString('fr-FR')}`);
    }
    
    // Clean up: remove the test product
    await collection.deleteOne({ _id: result.insertedId });
    console.log('\n🧹 Produit test supprimé (nettoyage)');
    
    const finalCount = await collection.countDocuments();
    console.log(`📦 Produits final : ${finalCount}`);
    
    console.log('\n✅ Test terminé avec succès !');
    
  } catch (error) {
    console.error('❌ Erreur lors du test:', error);
  } finally {
    if (client) {
      await client.close();
      console.log('📊 Déconnecté de MongoDB');
    }
  }
}

// Run the test
testAddProduct(); 