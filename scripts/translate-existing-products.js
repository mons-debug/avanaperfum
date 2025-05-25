const { MongoClient } = require('mongodb');
const path = require('path');

// Load environment variables
require('dotenv').config({ path: path.join(__dirname, '..', '.env.local') });
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

// Check if MongoDB URI is available
if (!process.env.MONGODB_URI) {
  console.error('❌ MONGODB_URI n\'est pas défini dans les variables d\'environnement');
  console.log('Vérifiez que le fichier .env.local ou .env contient MONGODB_URI');
  process.exit(1);
}

console.log('🔧 MongoDB URI trouvé:', process.env.MONGODB_URI ? 'Oui' : 'Non');

// French translations for common English product descriptions
const translations = {
  descriptions: {
    'A refreshing and sensual blend of pomegranate, yuzu, and peony with a touch of magnolia and amber.': 'Un mélange rafraîchissant et sensuel de grenade, yuzu et pivoine avec une touche de magnolia et d\'ambre.',
    'A fruity and floral explosion with notes of purple passion fruit, Shangri-la peony, and vanilla orchid.': 'Une explosion fruitée et florale avec des notes de fruit de la passion pourpre, pivoine Shangri-la et orchidée vanille.',
    'An addictive gourmand fragrance featuring notes of black coffee, white flowers, and vanilla.': 'Un parfum gourmand addictif avec des notes de café noir, fleurs blanches et vanille.',
    'A fresh floral citrus scent with top notes of mandarin and aromatic grasses.': 'Un parfum floral citronné frais avec des notes de tête de mandarine et d\'herbes aromatiques.',
    'A sensual woody fragrance featuring coconut wood and tonka bean.': 'Un parfum boisé sensuel avec bois de coco et fève tonka.',
    'An intense amber woody fragrance with lavender, vanilla, and woody notes.': 'Un parfum ambre boisé intense avec lavande, vanille et notes boisées.',
    'A warm spicy blend with notes of incense, vanilla, and rich spices.': 'Un mélange épicé chaleureux avec des notes d\'encens, vanille et épices riches.',
    'A sophisticated blend of pineapple, blackcurrant, birch, and ambergris.': 'Un mélange sophistiqué d\'ananas, cassis, bouleau et ambre gris.',
    'An elegant iris-based fragrance with woody notes and a hint of leather.': 'Un parfum élégant à base d\'iris avec des notes boisées et une pointe de cuir.',
    'An intense and sophisticated iris woody fragrance with a lavender heart.': 'Un parfum iris boisé intense et sophistiqué avec un cœur de lavande.',
    'A bold masculine fragrance with mint, green apple, and vanilla notes.': 'Un parfum masculin audacieux avec menthe, pomme verte et notes de vanille.',
    'A spicy fragrance with notes of cardamom, pink pepper, and chestnut.': 'Un parfum épicé avec des notes de cardamome, poivre rose et châtaigne.',
    'A floral amber that blends neroli, jasmine, and amber notes for a modern feminine scent.': 'Un ambre floral qui mélange néroli, jasmin et notes d\'ambre pour un parfum féminin moderne.',
    'A citrusy musk fragrance with fresh lemon, mandarin, and sophisticated musk notes.': 'Un parfum musc citronné avec citron frais, mandarine et notes de musc sophistiquées.',
    'A warm and sensual vanilla floral with notes of bergamot, lily, and amber musk.': 'Un floral vanillé chaleureux et sensuel avec des notes de bergamote, lys et musc ambré.',
    'A rich fruity amber with a vibrant blend of citrus, sweet fruits, and white musk.': 'Un ambre fruité riche avec un mélange vibrant d\'agrumes, fruits sucrés et musc blanc.',
    'A honey floral fragrance with raspberry, neroli, and honey notes.': 'Un parfum floral miel avec framboise, néroli et notes de miel.',
    'A fresh floral fragrance with coriander, blood orange, and jasmine.': 'Un parfum floral frais avec coriandre, orange sanguine et jasmin.',
    'A beautiful floral scent': 'Un magnifique parfum floral',
    'A masculine woody scent': 'Un parfum boisé masculin'
  },
  
  inspiredBy: {
    'Bright Crystal by Versace': 'Bright Crystal de Versace',
    'Bombshell by Victoria\'s Secret': 'Bombshell de Victoria\'s Secret',
    'Black Opium by Yves Saint Laurent': 'Black Opium d\'Yves Saint Laurent',
    'Weekend by Burberry': 'Weekend de Burberry',
    'Le Beau by Jean Paul Gaultier': 'Le Beau de Jean Paul Gaultier',
    'Le Male Elixir by Jean Paul Gaultier': 'Le Male Elixir de Jean Paul Gaultier',
    'Born in Roma Gold by Valentino': 'Born in Roma Gold de Valentino',
    'Aventus by Creed': 'Aventus de Creed',
    'Eros by Versace': 'Eros de Versace',
    'Stronger With You by Emporio Armani': 'Stronger With You d\'Emporio Armani',
    'Paradoxe by Prada': 'Paradoxe de Prada',
    'Q by Dolce & Gabbana': 'Q de Dolce & Gabbana',
    'The One by Dolce & Gabbana': 'The One de Dolce & Gabbana',
    'Erba Pura by Xerjoff': 'Erba Pura de Xerjoff',
    'Lady Million by Paco Rabanne': 'Lady Million de Paco Rabanne',
    'Touch of Pink by Lacoste': 'Touch of Pink de Lacoste',
    'Designer Brand 1': 'Marque de Créateur 1',
    'Designer Brand 2': 'Marque de Créateur 2'
  },

  ingredients: {
    'Alcohol, Aqua, Parfum': 'Alcool, Aqua, Parfum',
    'Alcohol, Water, Fragrance': 'Alcool, Eau, Fragrance',
    'Pomegranate Extract': 'Extrait de Grenade',
    'Peony': 'Pivoine',
    'Magnolia': 'Magnolia',
    'Amber': 'Ambre',
    'Mahogany Wood': 'Bois d\'Acajou',
    'Purple Passion Fruit': 'Fruit de la Passion Pourpre',
    'Vanilla Orchid': 'Orchidée Vanille',
    'Musk': 'Musc',
    'Coffee Accord': 'Accord Café',
    'Jasmine': 'Jasmin',
    'Vanilla': 'Vanille',
    'Cedarwood': 'Bois de Cèdre',
    'Patchouli': 'Patchouli',
    'Mandarin': 'Mandarine',
    'Wild Rose': 'Rose Sauvage',
    'Peach Flower': 'Fleur de Pêche',
    'Cedar': 'Cèdre',
    'Sandalwood': 'Bois de Santal',
    'Bergamot': 'Bergamote',
    'Coconut Wood': 'Bois de Coco',
    'Tonka Bean': 'Fève Tonka',
    'Lavender': 'Lavande',
    'Mint': 'Menthe',
    'Woody Notes': 'Notes Boisées',
    'Incense': 'Encens',
    'Spice Accord': 'Accord d\'Épices',
    'Pineapple': 'Ananas',
    'Blackcurrant': 'Cassis',
    'Birch': 'Bouleau',
    'Ambergris': 'Ambre Gris',
    'Oakmoss': 'Mousse de Chêne',
    'Pink Pepper': 'Poivre Rose',
    'Iris': 'Iris',
    'Musks': 'Muscs',
    'Ambrette Seed': 'Graine d\'Ambrette',
    'Pear': 'Poire',
    'Vetiver': 'Vétiver',
    'Green Apple': 'Pomme Verte',
    'Lemon': 'Citron',
    'Cardamom': 'Cardamome',
    'Chestnut': 'Châtaigne',
    'Neroli': 'Néroli',
    'Bourbon Vanilla': 'Vanille Bourbon',
    'White Flowers': 'Fleurs Blanches',
    'Woods': 'Bois',
    'Lily': 'Lys',
    'Amber Musk': 'Musc Ambré',
    'Orange': 'Orange',
    'Fruits': 'Fruits',
    'White Musk': 'Musc Blanc',
    'Raspberry': 'Framboise',
    'Orange Blossom': 'Fleur d\'Oranger',
    'Honey': 'Miel',
    'Coriander': 'Coriandre',
    'Blood Orange': 'Orange Sanguine',
    'Violet': 'Violette'
  }
};

// Function to translate text
function translateText(text, translationType) {
  if (!text) return text;
  
  const translationMap = translations[translationType];
  if (!translationMap) return text;
  
  // Direct translation lookup
  if (translationMap[text]) {
    return translationMap[text];
  }
  
  // For ingredients, try to translate each part
  if (translationType === 'ingredients') {
    let translatedText = text;
    Object.keys(translationMap).forEach(englishTerm => {
      const frenchTerm = translationMap[englishTerm];
      translatedText = translatedText.replace(new RegExp(englishTerm, 'gi'), frenchTerm);
    });
    return translatedText;
  }
  
  return text; // Return original if no translation found
}

async function translateExistingProducts() {
  let client;
  
  try {
    console.log('🌍 Démarrage de la traduction des produits existants...');
    
    client = new MongoClient(process.env.MONGODB_URI);
    await client.connect();
    console.log('📊 Connecté à MongoDB');
    
    const db = client.db();
    const collection = db.collection('products');
    
    // Get all products
    const products = await collection.find({}).toArray();
    console.log(`📦 Trouvé ${products.length} produits à traduire`);
    
    let updatedCount = 0;
    
    for (const product of products) {
      const updates = {};
      let hasUpdates = false;
      
      // Translate description
      if (product.description && typeof product.description === 'string') {
        const translatedDescription = translateText(product.description, 'descriptions');
        if (translatedDescription !== product.description) {
          updates.description = translatedDescription;
          hasUpdates = true;
        }
      }
      
      // Translate inspiredBy
      if (product.inspiredBy && typeof product.inspiredBy === 'string') {
        const translatedInspiredBy = translateText(product.inspiredBy, 'inspiredBy');
        if (translatedInspiredBy !== product.inspiredBy) {
          updates.inspiredBy = translatedInspiredBy;
          hasUpdates = true;
        }
      }
      
      // Translate ingredients
      if (product.ingredients && typeof product.ingredients === 'string') {
        const translatedIngredients = translateText(product.ingredients, 'ingredients');
        if (translatedIngredients !== product.ingredients) {
          updates.ingredients = translatedIngredients;
          hasUpdates = true;
        }
      }
      
      // Update the product if there are changes
      if (hasUpdates) {
        updates.updatedAt = new Date();
        await collection.updateOne(
          { _id: product._id },
          { $set: updates }
        );
        updatedCount++;
        console.log(`✅ Traduit: ${product.name}`);
      }
    }
    
    console.log(`🎉 Traduction terminée ! ${updatedCount} produits mis à jour.`);
    
  } catch (error) {
    console.error('❌ Erreur lors de la traduction:', error);
  } finally {
    if (client) {
      await client.close();
      console.log('📊 Déconnecté de MongoDB');
    }
  }
}

// Run the translation
translateExistingProducts(); 