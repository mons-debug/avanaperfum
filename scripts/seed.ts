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
    // Note: We don't delete categories to preserve collections
    console.log('✅ Existing products cleared (categories preserved)');
    
    // Create categories (only if they don't exist)
    console.log('📝 Creating basic categories (if needed)...');
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
    console.log(`✅ Categories ready: ${categoryCount} total`);
    
    // Create products
    console.log('📝 Creating products...');
    const products = [
      {
        name: 'Bright Crystal Versace',
        slug: 'bright-crystal-versace',
        inspiredBy: 'Bright Crystal by Versace',
        description: 'A refreshing and sensual blend of pomegranate, yuzu, and peony with a touch of magnolia and amber.',
        price: 99,
        volume: '50ml',
        tags: ['versace', 'bright crystal'],
        ingredients: 'Alcohol, Aqua, Parfum, Pomegranate Extract, Peony, Magnolia, Amber, Mahogany Wood',
        images: ['/images/products/53e99b52-Artboard_1.jpg'],
        category: 'Femme',
        gender: 'Femme',
      },
      {
        name: 'Bombshell Victoria\'s Secret',
        slug: 'bombshell-victoria-secret',
        inspiredBy: 'Bombshell by Victoria\'s Secret',
        description: 'A fruity and floral explosion with notes of purple passion fruit, Shangri-la peony, and vanilla orchid.',
        price: 99,
        volume: '50ml',
        tags: ['victoria', 'bombshell'],
        ingredients: 'Alcohol, Aqua, Parfum, Purple Passion Fruit, Peony, Vanilla Orchid, Musk',
        images: ['/images/products/e5419e21-Artboard_6.jpg'],
        category: 'Femme',
        gender: 'Femme',
      },
      {
        name: 'Black Opium YSL',
        slug: 'black-opium-ysl',
        inspiredBy: 'Black Opium by Yves Saint Laurent',
        description: 'An addictive gourmand fragrance featuring notes of black coffee, white flowers, and vanilla.',
        price: 99,
        volume: '50ml',
        tags: ['ysl', 'opium'],
        ingredients: 'Alcohol, Aqua, Parfum, Coffee Accord, Jasmine, Vanilla, Cedarwood, Patchouli',
        images: ['/images/products/44c51182-Artboard_5.jpg'],
        category: 'Femme',
        gender: 'Femme',
      },
      {
        name: 'Burberry Weekend',
        slug: 'burberry-weekend',
        inspiredBy: 'Weekend by Burberry',
        description: 'A fresh floral citrus scent with top notes of mandarin and aromatic grasses.',
        price: 99,
        volume: '50ml',
        tags: ['burberry'],
        ingredients: 'Alcohol, Aqua, Parfum, Mandarin, Wild Rose, Peach Flower, Cedar, Sandalwood',
        images: ['/images/products/b6c9d384-Artboard_14.jpg'],
        category: 'Femme',
        gender: 'Femme',
      },
      {
        name: 'Le Beau Jean Paul Gaultier',
        slug: 'le-beau-jean-paul-gaultier',
        inspiredBy: 'Le Beau by Jean Paul Gaultier',
        description: 'A sensual woody fragrance featuring coconut wood and tonka bean.',
        price: 99,
        volume: '50ml',
        tags: ['gaultier', 'le beau'],
        ingredients: 'Alcohol, Aqua, Parfum, Bergamot, Coconut Wood, Tonka Bean, Amber',
        images: ['/images/products/ca819074-Artboard_10.jpg'],
        category: 'Homme',
        gender: 'Homme',
      },
      {
        name: 'Le Male Elixir Jean Paul Gaultier',
        slug: 'le-male-elixir-jean-paul-gaultier',
        inspiredBy: 'Le Male Elixir by Jean Paul Gaultier',
        description: 'An intense amber woody fragrance with lavender, vanilla, and woody notes.',
        price: 99,
        volume: '50ml',
        tags: ['gaultier', 'elixir'],
        ingredients: 'Alcohol, Aqua, Parfum, Lavender, Mint, Vanilla, Tonka Bean, Woody Notes',
        images: ['/images/products/9c5a631e-Artboard_12.jpg'],
        category: 'Homme',
        gender: 'Homme',
      },
      {
        name: 'Born in Roma Gold Valentino',
        slug: 'born-in-roma-gold-valentino',
        inspiredBy: 'Born in Roma Gold by Valentino',
        description: 'A warm spicy blend with notes of incense, vanilla, and rich spices.',
        price: 99,
        volume: '50ml',
        tags: ['valentino', 'roma'],
        ingredients: 'Alcohol, Aqua, Parfum, Incense, Vanilla, Spice Accord, Cedarwood',
        images: ['/images/products/3f296814-Artboard_15.jpg'],
        category: 'Homme',
        gender: 'Homme',
      },
      {
        name: 'Aventus Creed',
        slug: 'aventus-creed',
        inspiredBy: 'Aventus by Creed',
        description: 'A sophisticated blend of pineapple, blackcurrant, birch, and ambergris.',
        price: 99,
        volume: '50ml',
        tags: ['creed', 'aventus'],
        ingredients: 'Alcohol, Aqua, Parfum, Pineapple, Blackcurrant, Birch, Ambergris, Oakmoss',
        images: ['/images/products/d42144e9-Artboard_17.jpg'],
        category: 'Homme',
        gender: 'Homme',
      },
      {
        name: 'Dior Homme 2020',
        slug: 'dior-homme-2020',
        inspiredBy: 'Dior Homme (2020 version)',
        description: 'An elegant iris-based fragrance with woody notes and a hint of leather.',
        price: 99,
        volume: '50ml',
        tags: ['dior', 'homme'],
        ingredients: 'Alcohol, Aqua, Parfum, Bergamot, Pink Pepper, Iris, Patchouli, Cedar, Musks',
        images: ['/images/products/2811be99-Artboard_3.jpg'],
        category: 'Homme',
        gender: 'Homme',
      },
      {
        name: 'Dior Homme Intense',
        slug: 'dior-homme-intense',
        inspiredBy: 'Dior Homme Intense',
        description: 'An intense and sophisticated iris woody fragrance with a lavender heart.',
        price: 99,
        volume: '50ml',
        tags: ['dior', 'intense'],
        ingredients: 'Alcohol, Aqua, Parfum, Lavender, Iris, Ambrette Seed, Pear, Vanilla, Vetiver, Cedar',
        images: ['/images/products/3dc570fa-Artboard_8.jpg'],
        category: 'Homme',
        gender: 'Homme',
      },
      {
        name: 'Versace Eros',
        slug: 'versace-eros',
        inspiredBy: 'Eros by Versace',
        description: 'A bold masculine fragrance with mint, green apple, and vanilla notes.',
        price: 99,
        volume: '50ml',
        tags: ['eros'],
        ingredients: 'Alcohol, Aqua, Parfum, Mint, Green Apple, Lemon, Tonka Bean, Vanilla, Cedarwood, Vetiver',
        images: ['/images/products/versace-eros.jpg'],
        category: 'Homme',
        gender: 'Homme',
      },
      {
        name: 'Emporio Armani Stronger With You',
        slug: 'emporio-armani-stronger-with-you',
        inspiredBy: 'Stronger With You by Emporio Armani',
        description: 'A spicy fragrance with notes of cardamom, pink pepper, and chestnut.',
        price: 99,
        volume: '50ml',
        tags: ['armani'],
        ingredients: 'Alcohol, Aqua, Parfum, Cardamom, Pink Pepper, Chestnut, Vanilla, Cedarwood',
        images: ['/images/products/b5e4e349-Artboard_4.jpg'],
        category: 'Homme',
        gender: 'Homme',
      },
      {
        name: 'Prada Paradoxe',
        slug: 'prada-paradoxe',
        inspiredBy: 'Paradoxe by Prada',
        description: 'A floral amber that blends neroli, jasmine, and amber notes for a modern feminine scent.',
        price: 99,
        volume: '50ml',
        tags: ['prada'],
        ingredients: 'Alcohol, Aqua, Parfum, Neroli, Jasmine, Amber, Musk, Bourbon Vanilla',
        images: ['/images/products/e71b7454-Artboard_4.jpg'],
        category: 'Femme',
        gender: 'Femme',
      },
      {
        name: 'Q by Dolce & Gabbana',
        slug: 'q-dolce-gabbana',
        inspiredBy: 'Q by Dolce & Gabbana',
        description: 'A citrusy musk fragrance with fresh lemon, mandarin, and sophisticated musk notes.',
        price: 99,
        volume: '50ml',
        tags: ['dolce'],
        ingredients: 'Alcohol, Aqua, Parfum, Lemon, Mandarin, White Flowers, Musk, Woods',
        images: ['/images/products/237db6ef-Artboard_1.jpg'],
        category: 'Femme',
        gender: 'Femme',
      },
      {
        name: 'The One by Dolce & Gabbana',
        slug: 'the-one-dolce-gabbana',
        inspiredBy: 'The One by Dolce & Gabbana',
        description: 'A warm and sensual vanilla floral with notes of bergamot, lily, and amber musk.',
        price: 99,
        volume: '50ml',
        tags: ['dolce'],
        ingredients: 'Alcohol, Aqua, Parfum, Bergamot, Lily, Jasmine, Vanilla, Vetiver, Amber Musk',
        images: ['/images/products/995bbe50-arbord18.jpg'],
        category: 'Femme',
        gender: 'Femme',
      },
      {
        name: 'Erba Pura Xerjoff',
        slug: 'erba-pura-xerjoff',
        inspiredBy: 'Erba Pura by Xerjoff',
        description: 'A rich fruity amber with a vibrant blend of citrus, sweet fruits, and white musk.',
        price: 99,
        volume: '50ml',
        tags: ['xerjoff'],
        ingredients: 'Alcohol, Aqua, Parfum, Orange, Lemon, Bergamot, Fruits, White Musk, Amber',
        images: ['/images/products/8d11dd9b-artboard20.jpg'],
        category: 'Femme',
        gender: 'Femme',
      },
      {
        name: 'Lady Million Paco Rabanne',
        slug: 'lady-million-paco-rabanne',
        inspiredBy: 'Lady Million by Paco Rabanne',
        description: 'A honey floral fragrance with raspberry, neroli, and honey notes.',
        price: 99,
        volume: '50ml',
        tags: ['paco rabanne'],
        ingredients: 'Alcohol, Aqua, Parfum, Raspberry, Neroli, Orange Blossom, Honey, Patchouli, Amber',
        images: ['/images/products/45a8d0d0-artboard21.jpg'],
        category: 'Femme',
        gender: 'Femme',
      },
      {
        name: 'Touch of Pink Lacoste',
        slug: 'touch-of-pink-lacoste',
        inspiredBy: 'Touch of Pink by Lacoste',
        description: 'A fresh floral fragrance with coriander, blood orange, and jasmine.',
        price: 99,
        volume: '50ml',
        tags: ['lacoste'],
        ingredients: 'Alcohol, Aqua, Parfum, Coriander, Blood Orange, Jasmine, Violet, Musk, Sandalwood',
        images: ['/images/products/074f7eae-Artboard_7.jpg'],
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
