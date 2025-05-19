require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');

// Connect to MongoDB
async function connectToDB() {
  try {
    const mongoURI = process.env.MONGODB_URI;
    
    if (!mongoURI) {
      console.error('MongoDB URI is not defined in environment variables');
      process.exit(1);
    }
    
    await mongoose.connect(mongoURI);
    console.log('Connected to MongoDB successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
}

// Define Product schema
const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  volume: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
    required: true,
    enum: ['Homme', 'Femme', 'Mixte'],
  },
  images: {
    type: [String],
    required: true,
  },
  inspiredBy: {
    type: String,
  },
  category: {
    type: String,
    required: true,
  },
  inStock: {
    type: Boolean,
    default: true,
  },
  featured: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Create slug from name before saving
productSchema.pre('save', function(next) {
  if (this.isModified('name')) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
  }
  
  // Always update the updatedAt timestamp
  this.updatedAt = new Date();
  
  next();
});

// Initialize the Product model
let Product;
try {
  // Try to get existing model
  Product = mongoose.model('Product');
} catch {
  // Create new model
  Product = mongoose.model('Product', productSchema);
}

// Sample product data
const sampleProduct = {
  name: 'Sample Fragrance',
  description: 'A wonderful sample fragrance with woody and floral notes.',
  price: 95,
  volume: '100ml',
  gender: 'Mixte',
  images: ['/images/product-placeholder.svg'],
  inspiredBy: 'Nature',
  category: 'Perfume',
  inStock: true,
  featured: true,
  slug: 'sample-fragrance',
};

// Check if products exist and add a sample if needed
async function checkAndAddProduct() {
  try {
    await connectToDB();
    
    // Check if there are any products
    const count = await Product.countDocuments();
    console.log(`Found ${count} products in the database`);
    
    if (count === 0) {
      console.log('No products found. Adding a sample product...');
      await Product.create(sampleProduct);
      console.log('Sample product added successfully');
    } else {
      console.log('Products already exist in the database');
    }
    
    // List some products
    const products = await Product.find().limit(5).lean();
    console.log('Sample of products in database:');
    products.forEach((product, i) => {
      console.log(`${i + 1}. ${product.name} (${product.slug}) - ${product.price} DH`);
    });
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

// Run the function
checkAndAddProduct(); 