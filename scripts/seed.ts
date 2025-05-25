import dotenv from "dotenv";
// Load environment variables from .env files
dotenv.config({ path: '.env.local' });
dotenv.config(); // Fallback to .env if .env.local doesn't exist

import mongoose from "mongoose";
import { connectToDB } from "@/lib/mongodb";
import Product from "@/models/Product";
import Category from "@/models/Category";

// Fallback MongoDB URI if not found in environment variables
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/perfume-shop';

// Modified connectToDB function specifically for the seed script
async function connectToDBForSeed() {
  try {
    if (!process.env.MONGODB_URI) {
      console.log('⚠️ MONGODB_URI not found in environment variables, using fallback URI');
      // Set it for the regular connectToDB function
      process.env.MONGODB_URI = MONGODB_URI;
    }
    
    // Try to use the regular connectToDB function first
    try {
      return await connectToDB();
    } catch (error) {
      // If that fails, connect directly
      console.log('⚠️ Using direct MongoDB connection...');
      return await mongoose.connect(MONGODB_URI);
    }
  } catch (error) {
    throw new Error(`Failed to connect to MongoDB: ${error}`);
  }
}

async function seedDatabase() {
  try {
    console.log('🌱 Démarrage de l\'ensemencement de la base de données...');
    
    // Connect to the database using our custom function
    await connectToDBForSeed();
    console.log('📊 Connecté à MongoDB');
    
    // Clear existing data
    console.log('🧹 Suppression des données existantes...');
    await Product.deleteMany({});
    // Note: We don't delete categories to preserve collections
    console.log('✅ Produits existants supprimés (catégories préservées)');
    
    // Create categories (only if they don't exist)
    console.log('📝 Création des catégories de base (si nécessaire)...');
    const basicCategories = [
      { name: 'Femme', slug: 'femme', image: '/images/categories/femme.svg' },
      { name: 'Homme', slug: 'homme', image: '/images/categories/homme.svg' },
      { name: 'Unisexe', slug: 'unisexe', image: '/images/categories/unisexe.svg' }
    ];
    
    for (const cat of basicCategories) {
      await Category.findOneAndUpdate(
        { slug: cat.slug },
        { 
          name: cat.name,
          slug: cat.slug,
          image: cat.image,
          featured: true,
          updatedAt: new Date()
        },
        { upsert: true, new: true }
      );
    }
    
    const categoryCount = await Category.countDocuments();
    console.log(`✅ Catégories prêtes : ${categoryCount} au total`);
    
    // Create products with French descriptions
    console.log('📝 Création des produits...');
    const products = [
      {
        name: 'Bright Crystal Versace',
        slug: 'bright-crystal-versace',
        inspiredBy: 'Bright Crystal de Versace',
        description: 'Un mélange rafraîchissant et sensuel de grenade, yuzu et pivoine avec une touche de magnolia et d\'ambre.',
        price: 99,
        volume: '50ml',
        tags: ['versace', 'bright crystal'],
        ingredients: 'Alcool, Aqua, Parfum, Extrait de Grenade, Pivoine, Magnolia, Ambre, Bois d\'Acajou',
        images: ['/images/products/53e99b52-Artboard_1.jpg'],
        category: 'Femme',
        gender: 'Femme',
      },
      {
        name: 'Bombshell Victoria\'s Secret',
        slug: 'bombshell-victoria-secret',
        inspiredBy: 'Bombshell de Victoria\'s Secret',
        description: 'Une explosion fruitée et florale avec des notes de fruit de la passion pourpre, pivoine Shangri-la et orchidée vanille.',
        price: 99,
        volume: '50ml',
        tags: ['victoria', 'bombshell'],
        ingredients: 'Alcool, Aqua, Parfum, Fruit de la Passion Pourpre, Pivoine, Orchidée Vanille, Musc',
        images: ['/images/products/e5419e21-Artboard_6.jpg'],
        category: 'Femme',
        gender: 'Femme',
      },
      {
        name: 'Black Opium YSL',
        slug: 'black-opium-ysl',
        inspiredBy: 'Black Opium d\'Yves Saint Laurent',
        description: 'Un parfum gourmand addictif avec des notes de café noir, fleurs blanches et vanille.',
        price: 99,
        volume: '50ml',
        tags: ['ysl', 'opium'],
        ingredients: 'Alcool, Aqua, Parfum, Accord Café, Jasmin, Vanille, Bois de Cèdre, Patchouli',
        images: ['/images/products/44c51182-Artboard_5.jpg'],
        category: 'Femme',
        gender: 'Femme',
      },
      {
        name: 'Burberry Weekend',
        slug: 'burberry-weekend',
        inspiredBy: 'Weekend de Burberry',
        description: 'Un parfum floral citronné frais avec des notes de tête de mandarine et d\'herbes aromatiques.',
        price: 99,
        volume: '50ml',
        tags: ['burberry'],
        ingredients: 'Alcool, Aqua, Parfum, Mandarine, Rose Sauvage, Fleur de Pêche, Cèdre, Bois de Santal',
        images: ['/images/products/b6c9d384-Artboard_14.jpg'],
        category: 'Femme',
        gender: 'Femme',
      },
      {
        name: 'Le Beau Jean Paul Gaultier',
        slug: 'le-beau-jean-paul-gaultier',
        inspiredBy: 'Le Beau de Jean Paul Gaultier',
        description: 'Un parfum boisé sensuel avec bois de coco et fève tonka.',
        price: 99,
        volume: '50ml',
        tags: ['gaultier', 'le beau'],
        ingredients: 'Alcool, Aqua, Parfum, Bergamote, Bois de Coco, Fève Tonka, Ambre',
        images: ['/images/products/ca819074-Artboard_10.jpg'],
        category: 'Homme',
        gender: 'Homme',
      },
      {
        name: 'Le Male Elixir Jean Paul Gaultier',
        slug: 'le-male-elixir-jean-paul-gaultier',
        inspiredBy: 'Le Male Elixir de Jean Paul Gaultier',
        description: 'Un parfum ambre boisé intense avec lavande, vanille et notes boisées.',
        price: 99,
        volume: '50ml',
        tags: ['gaultier', 'elixir'],
        ingredients: 'Alcool, Aqua, Parfum, Lavande, Menthe, Vanille, Fève Tonka, Notes Boisées',
        images: ['/images/products/9c5a631e-Artboard_12.jpg'],
        category: 'Homme',
        gender: 'Homme',
      },
      {
        name: 'Born in Roma Gold Valentino',
        slug: 'born-in-roma-gold-valentino',
        inspiredBy: 'Born in Roma Gold de Valentino',
        description: 'Un mélange épicé chaleureux avec des notes d\'encens, vanille et épices riches.',
        price: 99,
        volume: '50ml',
        tags: ['valentino', 'roma'],
        ingredients: 'Alcool, Aqua, Parfum, Encens, Vanille, Accord d\'Épices, Bois de Cèdre',
        images: ['/images/products/3f296814-Artboard_15.jpg'],
        category: 'Homme',
        gender: 'Homme',
      },
      {
        name: 'Aventus Creed',
        slug: 'aventus-creed',
        inspiredBy: 'Aventus de Creed',
        description: 'Un mélange sophistiqué d\'ananas, cassis, bouleau et ambre gris.',
        price: 99,
        volume: '50ml',
        tags: ['creed', 'aventus'],
        ingredients: 'Alcool, Aqua, Parfum, Ananas, Cassis, Bouleau, Ambre Gris, Mousse de Chêne',
        images: ['/images/products/d42144e9-Artboard_17.jpg'],
        category: 'Homme',
        gender: 'Homme',
      },
      {
        name: 'Dior Homme 2020',
        slug: 'dior-homme-2020',
        inspiredBy: 'Dior Homme (version 2020)',
        description: 'Un parfum élégant à base d\'iris avec des notes boisées et une pointe de cuir.',
        price: 99,
        volume: '50ml',
        tags: ['dior', 'homme'],
        ingredients: 'Alcool, Aqua, Parfum, Bergamote, Poivre Rose, Iris, Patchouli, Cèdre, Muscs',
        images: ['/images/products/2811be99-Artboard_3.jpg'],
        category: 'Homme',
        gender: 'Homme',
      },
      {
        name: 'Dior Homme Intense',
        slug: 'dior-homme-intense',
        inspiredBy: 'Dior Homme Intense',
        description: 'Un parfum iris boisé intense et sophistiqué avec un cœur de lavande.',
        price: 99,
        volume: '50ml',
        tags: ['dior', 'intense'],
        ingredients: 'Alcool, Aqua, Parfum, Lavande, Iris, Graine d\'Ambrette, Poire, Vanille, Vétiver, Cèdre',
        images: ['/images/products/3dc570fa-Artboard_8.jpg'],
        category: 'Homme',
        gender: 'Homme',
      },
      {
        name: 'Versace Eros',
        slug: 'versace-eros',
        inspiredBy: 'Eros de Versace',
        description: 'Un parfum masculin audacieux avec menthe, pomme verte et notes de vanille.',
        price: 99,
        volume: '50ml',
        tags: ['eros'],
        ingredients: 'Alcool, Aqua, Parfum, Menthe, Pomme Verte, Citron, Fève Tonka, Vanille, Bois de Cèdre, Vétiver',
        images: ['/images/products/versace-eros.jpg'],
        category: 'Homme',
        gender: 'Homme',
      },
      {
        name: 'Emporio Armani Stronger With You',
        slug: 'emporio-armani-stronger-with-you',
        inspiredBy: 'Stronger With You d\'Emporio Armani',
        description: 'Un parfum épicé avec des notes de cardamome, poivre rose et châtaigne.',
        price: 99,
        volume: '50ml',
        tags: ['armani'],
        ingredients: 'Alcool, Aqua, Parfum, Cardamome, Poivre Rose, Châtaigne, Vanille, Bois de Cèdre',
        images: ['/images/products/b5e4e349-Artboard_4.jpg'],
        category: 'Homme',
        gender: 'Homme',
      },
      {
        name: 'Prada Paradoxe',
        slug: 'prada-paradoxe',
        inspiredBy: 'Paradoxe de Prada',
        description: 'Un ambre floral qui mélange néroli, jasmin et notes d\'ambre pour un parfum féminin moderne.',
        price: 99,
        volume: '50ml',
        tags: ['prada'],
        ingredients: 'Alcool, Aqua, Parfum, Néroli, Jasmin, Ambre, Musc, Vanille Bourbon',
        images: ['/images/products/e71b7454-Artboard_4.jpg'],
        category: 'Femme',
        gender: 'Femme',
      },
      {
        name: 'Q by Dolce & Gabbana',
        slug: 'q-dolce-gabbana',
        inspiredBy: 'Q de Dolce & Gabbana',
        description: 'Un parfum musc citronné avec citron frais, mandarine et notes de musc sophistiquées.',
        price: 99,
        volume: '50ml',
        tags: ['dolce'],
        ingredients: 'Alcool, Aqua, Parfum, Citron, Mandarine, Fleurs Blanches, Musc, Bois',
        images: ['/images/products/237db6ef-Artboard_1.jpg'],
        category: 'Femme',
        gender: 'Femme',
      },
      {
        name: 'The One by Dolce & Gabbana',
        slug: 'the-one-dolce-gabbana',
        inspiredBy: 'The One de Dolce & Gabbana',
        description: 'Un floral vanillé chaleureux et sensuel avec des notes de bergamote, lys et musc ambré.',
        price: 99,
        volume: '50ml',
        tags: ['dolce'],
        ingredients: 'Alcool, Aqua, Parfum, Bergamote, Lys, Jasmin, Vanille, Vétiver, Musc Ambré',
        images: ['/images/products/995bbe50-arbord18.jpg'],
        category: 'Femme',
        gender: 'Femme',
      },
      {
        name: 'Erba Pura Xerjoff',
        slug: 'erba-pura-xerjoff',
        inspiredBy: 'Erba Pura de Xerjoff',
        description: 'Un ambre fruité riche avec un mélange vibrant d\'agrumes, fruits sucrés et musc blanc.',
        price: 99,
        volume: '50ml',
        tags: ['xerjoff'],
        ingredients: 'Alcool, Aqua, Parfum, Orange, Citron, Bergamote, Fruits, Musc Blanc, Ambre',
        images: ['/images/products/8d11dd9b-artboard20.jpg'],
        category: 'Femme',
        gender: 'Femme',
      },
      {
        name: 'Lady Million Paco Rabanne',
        slug: 'lady-million-paco-rabanne',
        inspiredBy: 'Lady Million de Paco Rabanne',
        description: 'Un parfum floral miel avec framboise, néroli et notes de miel.',
        price: 99,
        volume: '50ml',
        tags: ['paco rabanne'],
        ingredients: 'Alcool, Aqua, Parfum, Framboise, Néroli, Fleur d\'Oranger, Miel, Patchouli, Ambre',
        images: ['/images/products/45a8d0d0-artboard21.jpg'],
        category: 'Femme',
        gender: 'Femme',
      },
      {
        name: 'Touch of Pink Lacoste',
        slug: 'touch-of-pink-lacoste',
        inspiredBy: 'Touch of Pink de Lacoste',
        description: 'Un parfum floral frais avec coriandre, orange sanguine et jasmin.',
        price: 99,
        volume: '50ml',
        tags: ['lacoste'],
        ingredients: 'Alcool, Aqua, Parfum, Coriandre, Orange Sanguine, Jasmin, Violette, Musc, Bois de Santal',
        images: ['/images/products/074f7eae-Artboard_7.jpg'],
        category: 'Femme',
        gender: 'Femme',
      }
    ];
    
    const createdProducts = await Product.create(products);
    console.log(`✅ ${createdProducts.length} produits créés`);
    
    console.log('🌱 Ensemencement de la base de données terminé avec succès !');
    
  } catch (error) {
    console.error('❌ Erreur lors de l\'ensemencement de la base de données :', error);
  } finally {
    // Disconnect from MongoDB
    try {
      await mongoose.disconnect();
      console.log('📊 Disconnected from MongoDB');
    } catch (error) {
      console.error('Error disconnecting from MongoDB:', error);
    }
    process.exit(0);
  }
}

// Run the seed function
seedDatabase();
