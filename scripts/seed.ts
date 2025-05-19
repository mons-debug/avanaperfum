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
    console.log('🌱 Starting database seeding...');
    
    // Connect to the database using our custom function
    await connectToDBForSeed();
    console.log('📊 Connected to MongoDB');
    
    // Clear existing data
    console.log('🧹 Clearing existing data...');
    await Product.deleteMany({});
    await Category.deleteMany({});
    console.log('✅ Existing data cleared');
    
    // Create categories
    console.log('📝 Creating categories...');
    const categories = await Category.create([
      { name: 'Femme', slug: 'femme', imageUrl: '/images/categories/femme.jpg' },
      { name: 'Homme', slug: 'homme', imageUrl: '/images/categories/homme.jpg' },
      { name: 'Unisexe', slug: 'unisexe', imageUrl: '/images/categories/unisexe.jpg' }
    ]);
    console.log(`✅ Created ${categories.length} categories`);
    
    // Create products
    console.log('📝 Creating products...');
    const products = [
      {
        name: 'Bright Crystal Versace',
        inspiredBy: 'Bright Crystal by Versace',
        description: 'A refreshing and sensual blend of pomegranate, yuzu, and peony with a touch of magnolia and amber.',
        volume: '30',
        tags: ['versace', 'bright crystal'],
        ingredients: 'Alcohol, Aqua, Parfum, Pomegranate Extract, Peony, Magnolia, Amber, Mahogany Wood',
        imageUrl: '/images/products/bright-crystal.jpg',
        category: 'Femme',
        gender: 'Femme',
      },
      {
        name: 'Bombshell Victoria\'s Secret',
        inspiredBy: 'Bombshell by Victoria\'s Secret',
        description: 'A fruity and floral explosion with notes of purple passion fruit, Shangri-la peony, and vanilla orchid.',
        volume: '30',
        tags: ['victoria', 'bombshell'],
        ingredients: 'Alcohol, Aqua, Parfum, Purple Passion Fruit, Peony, Vanilla Orchid, Musk',
        imageUrl: '/images/products/bombshell.jpg',
        category: 'Femme',
        gender: 'Femme',
      },
      {
        name: 'Black Opium YSL',
        inspiredBy: 'Black Opium by Yves Saint Laurent',
        description: 'An addictive gourmand fragrance featuring notes of black coffee, white flowers, and vanilla.',
        volume: '30',
        tags: ['ysl', 'opium'],
        ingredients: 'Alcohol, Aqua, Parfum, Coffee Accord, Jasmine, Vanilla, Cedarwood, Patchouli',
        imageUrl: '/images/products/black-opium.jpg',
        category: 'Femme',
        gender: 'Femme',
      },
      {
        name: 'Burberry Weekend',
        inspiredBy: 'Weekend by Burberry',
        description: 'A fresh floral citrus scent with top notes of mandarin and aromatic grasses.',
        volume: '30',
        tags: ['burberry'],
        ingredients: 'Alcohol, Aqua, Parfum, Mandarin, Wild Rose, Peach Flower, Cedar, Sandalwood',
        imageUrl: '/images/products/burberry-weekend.jpg',
        category: 'Femme',
        gender: 'Femme',
      },
      {
        name: 'Le Beau Jean Paul Gaultier',
        inspiredBy: 'Le Beau by Jean Paul Gaultier',
        description: 'A sensual woody fragrance featuring coconut wood and tonka bean.',
        volume: '30',
        tags: ['gaultier', 'le beau'],
        ingredients: 'Alcohol, Aqua, Parfum, Bergamot, Coconut Wood, Tonka Bean, Amber',
        imageUrl: '/images/products/le-beau.jpg',
        category: 'Homme',
        gender: 'Homme',
      },
      {
        name: 'Le Male Elixir Jean Paul Gaultier',
        inspiredBy: 'Le Male Elixir by Jean Paul Gaultier',
        description: 'An intense amber woody fragrance with lavender, vanilla, and woody notes.',
        volume: '30',
        tags: ['gaultier', 'elixir'],
        ingredients: 'Alcohol, Aqua, Parfum, Lavender, Mint, Vanilla, Tonka Bean, Woody Notes',
        imageUrl: '/images/products/le-male-elixir.jpg',
        category: 'Homme',
        gender: 'Homme',
      },
      {
        name: 'Born in Roma Gold Valentino',
        inspiredBy: 'Born in Roma Gold by Valentino',
        description: 'A warm spicy blend with notes of incense, vanilla, and rich spices.',
        volume: '30',
        tags: ['valentino', 'roma'],
        ingredients: 'Alcohol, Aqua, Parfum, Incense, Vanilla, Spice Accord, Cedarwood',
        imageUrl: '/images/products/born-in-roma-gold.jpg',
        category: 'Unisexe',
        gender: 'Mixte',
      },
      {
        name: 'Aventus Creed',
        inspiredBy: 'Aventus by Creed',
        description: 'A sophisticated blend of pineapple, blackcurrant, birch, and ambergris.',
        volume: '30',
        tags: ['creed', 'aventus'],
        ingredients: 'Alcohol, Aqua, Parfum, Pineapple, Blackcurrant, Birch, Ambergris, Oakmoss',
        imageUrl: '/images/products/aventus.jpg',
        category: 'Homme',
        gender: 'Homme',
      },
      {
        name: 'Dior Homme 2020',
        inspiredBy: 'Dior Homme (2020 version)',
        description: 'An elegant iris-based fragrance with woody notes and a hint of leather.',
        volume: '30',
        tags: ['dior', 'homme'],
        ingredients: 'Alcohol, Aqua, Parfum, Bergamot, Pink Pepper, Iris, Patchouli, Cedar, Musks',
        imageUrl: '/images/products/dior-homme-2020.jpg',
        category: 'Homme',
        gender: 'Homme',
      },
      {
        name: 'Dior Homme Intense',
        inspiredBy: 'Dior Homme Intense',
        description: 'An intense and sophisticated iris woody fragrance with a lavender heart.',
        volume: '30',
        tags: ['dior', 'intense'],
        ingredients: 'Alcohol, Aqua, Parfum, Lavender, Iris, Ambrette Seed, Pear, Vanilla, Vetiver, Cedar',
        imageUrl: '/images/products/dior-homme-intense.jpg',
        category: 'Homme',
        gender: 'Homme',
      },
      {
        name: 'Versace Eros',
        inspiredBy: 'Eros by Versace',
        description: 'A bold masculine fragrance with mint, green apple, and vanilla notes.',
        volume: '30',
        tags: ['eros'],
        ingredients: 'Alcohol, Aqua, Parfum, Mint, Green Apple, Lemon, Tonka Bean, Vanilla, Cedarwood, Vetiver',
        imageUrl: '/images/products/versace-eros.jpg',
        category: 'Homme',
        gender: 'Homme',
      },
      {
        name: 'Emporio Armani Stronger With You',
        inspiredBy: 'Stronger With You by Emporio Armani',
        description: 'A spicy fragrance with notes of cardamom, pink pepper, and chestnut.',
        volume: '30',
        tags: ['armani'],
        ingredients: 'Alcohol, Aqua, Parfum, Cardamom, Pink Pepper, Chestnut, Vanilla, Cedarwood',
        imageUrl: '/images/products/stronger-with-you.jpg',
        category: 'Homme',
        gender: 'Homme',
      },
      {
        name: 'Prada Paradoxe',
        inspiredBy: 'Paradoxe by Prada',
        description: 'A floral amber that blends neroli, jasmine, and amber notes for a modern feminine scent.',
        volume: '30',
        tags: ['prada'],
        ingredients: 'Alcohol, Aqua, Parfum, Neroli, Jasmine, Amber, Musk, Bourbon Vanilla',
        imageUrl: '/images/products/prada-paradoxe.jpg',
        category: 'Femme',
        gender: 'Femme',
      },
      {
        name: 'Q by Dolce & Gabbana',
        inspiredBy: 'Q by Dolce & Gabbana',
        description: 'A citrusy musk fragrance with fresh lemon, mandarin, and sophisticated musk notes.',
        volume: '30',
        tags: ['dolce'],
        ingredients: 'Alcohol, Aqua, Parfum, Lemon, Mandarin, White Flowers, Musk, Woods',
        imageUrl: '/images/products/q-dolce.jpg',
        category: 'Femme',
        gender: 'Femme',
      },
      {
        name: 'The One by Dolce & Gabbana',
        inspiredBy: 'The One by Dolce & Gabbana',
        description: 'A warm and sensual vanilla floral with notes of bergamot, lily, and amber musk.',
        volume: '30',
        tags: ['dolce'],
        ingredients: 'Alcohol, Aqua, Parfum, Bergamot, Lily, Jasmine, Vanilla, Vetiver, Amber Musk',
        imageUrl: '/images/products/the-one.jpg',
        category: 'Femme',
        gender: 'Femme',
      },
      {
        name: 'Erba Pura Xerjoff',
        inspiredBy: 'Erba Pura by Xerjoff',
        description: 'A rich fruity amber with a vibrant blend of citrus, sweet fruits, and white musk.',
        volume: '30',
        tags: ['xerjoff'],
        ingredients: 'Alcohol, Aqua, Parfum, Orange, Lemon, Bergamot, Fruits, White Musk, Amber',
        imageUrl: '/images/products/erba-pura.jpg',
        category: 'Unisexe',
        gender: 'Mixte',
      },
      {
        name: 'Lady Million Paco Rabanne',
        inspiredBy: 'Lady Million by Paco Rabanne',
        description: 'A honey floral fragrance with raspberry, neroli, and honey notes.',
        volume: '30',
        tags: ['paco rabanne'],
        ingredients: 'Alcohol, Aqua, Parfum, Raspberry, Neroli, Orange Blossom, Honey, Patchouli, Amber',
        imageUrl: '/images/products/lady-million.jpg',
        category: 'Femme',
        gender: 'Femme',
      },
      {
        name: 'Touch of Pink Lacoste',
        inspiredBy: 'Touch of Pink by Lacoste',
        description: 'A fresh floral fragrance with coriander, blood orange, and jasmine.',
        volume: '30',
        tags: ['lacoste'],
        ingredients: 'Alcohol, Aqua, Parfum, Coriander, Blood Orange, Jasmine, Violet, Musk, Sandalwood',
        imageUrl: '/images/products/touch-of-pink.jpg',
        category: 'Femme',
        gender: 'Femme',
      }
    ];
    
    const createdProducts = await Product.create(products);
    console.log(`✅ Created ${createdProducts.length} products`);
    
    console.log('🌱 Database seeding completed successfully!');
    
  } catch (error) {
    console.error('❌ Error seeding database:', error);
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
