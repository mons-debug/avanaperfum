// Seed script to populate the database with sample data
const { MongoClient } = require('mongodb');
require('dotenv').config({ path: '.env.local' });

// Connect to MongoDB
const main = async () => {
  let client;
  
  try {
    console.log('Connecting to MongoDB...');
    client = new MongoClient(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    await client.connect();
    console.log('Connected to MongoDB successfully');
    
    const db = client.db();
    
    // Clear existing data
    console.log('Clearing existing data...');
    await db.collection('products').deleteMany({});
    await db.collection('categories').deleteMany({});
    
    // Create categories
    console.log('Creating categories...');
    const categories = [
      {
        name: 'Homme',
        slug: 'homme',
        description: 'Fragrances for men',
        image: '/images/product-placeholder.svg',
        featured: true
      },
      {
        name: 'Femme',
        slug: 'femme',
        description: 'Fragrances for women',
        image: '/images/product-placeholder.svg',
        featured: true
      },
      {
        name: 'Mixte',
        slug: 'mixte',
        description: 'Unisex fragrances',
        image: '/images/product-placeholder.svg',
        featured: true
      }
    ];
    
    const categoriesResult = await db.collection('categories').insertMany(categories);
    console.log(`${categories.length} categories created`);
    
    // Create products
    console.log('Creating products...');
    const products = [
      {
        name: 'Royal Oud',
        slug: 'royal-oud',
        description: 'A luxurious woody fragrance with notes of oud, sandalwood and cedar',
        price: 249.99,
        originalPrice: 299.99,
        volume: '100ml',
        gender: 'Homme',
        images: ['/images/product-placeholder.svg'],
        inspiredBy: 'Creed Royal Oud',
        category: 'Homme',
        inStock: true,
        featured: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Azure Dream',
        slug: 'azure-dream',
        description: 'A refreshing aquatic fragrance with notes of bergamot, sea salt and ambergris',
        price: 199.99,
        originalPrice: 249.99,
        volume: '100ml',
        gender: 'Homme',
        images: ['/images/product-placeholder.svg'],
        inspiredBy: 'Bleu de Chanel',
        category: 'Homme',
        inStock: true,
        featured: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Rose Elixir',
        slug: 'rose-elixir',
        description: 'A captivating floral fragrance with notes of Bulgarian rose, jasmine and patchouli',
        price: 229.99,
        originalPrice: 279.99,
        volume: '100ml',
        gender: 'Femme',
        images: ['/images/product-placeholder.svg'],
        inspiredBy: 'Miss Dior',
        category: 'Femme',
        inStock: true,
        featured: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Amber Mystique',
        slug: 'amber-mystique',
        description: 'A seductive oriental fragrance with notes of amber, vanilla and musk',
        price: 219.99,
        originalPrice: 269.99,
        volume: '100ml',
        gender: 'Femme',
        images: ['/images/product-placeholder.svg'],
        inspiredBy: 'YSL Black Opium',
        category: 'Femme',
        inStock: true,
        featured: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Citrus Paradisi',
        slug: 'citrus-paradisi',
        description: 'A refreshing unisex fragrance with notes of grapefruit, bergamot and vetiver',
        price: 189.99,
        originalPrice: 229.99,
        volume: '100ml',
        gender: 'Mixte',
        images: ['/images/product-placeholder.svg'],
        inspiredBy: 'Tom Ford Neroli Portofino',
        category: 'Mixte',
        inStock: true,
        featured: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];
    
    const productsResult = await db.collection('products').insertMany(products);
    console.log(`${products.length} products created`);
    
    console.log('Database seeding completed successfully');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    if (client) {
      await client.close();
      console.log('Disconnected from MongoDB');
    }
    process.exit(0);
  }
};

main(); 