import mongoose, { Model } from 'mongoose';

// Define interface for Product document
interface IProduct extends mongoose.Document {
  name: string;
  slug: string;
  description: string;
  price: number;
  originalPrice?: number;
  volume: string;
  gender: 'Homme' | 'Femme' | 'Mixte';
  images: string[];
  inspiredBy?: string;
  category: string;
  inStock: boolean;
  featured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Define the schema
const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a product name'],
    trim: true,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
  },
  description: {
    type: String,
    required: [true, 'Please provide a product description'],
  },
  price: {
    type: Number,
    required: [true, 'Please provide a product price'],
    min: [0, 'Price cannot be negative'],
  },
  originalPrice: {
    type: Number,
    min: [0, 'Original price cannot be negative'],
  },
  volume: {
    type: String,
    required: [true, 'Please provide the volume'],
  },
  gender: {
    type: String,
    required: [true, 'Please specify the gender'],
    enum: ['Homme', 'Femme', 'Mixte'],
  },
  images: {
    type: [String],
    required: [true, 'Please provide at least one image'],
    validate: {
      validator: function(v: string[]) {
        // Allow empty array since we'll add placeholder in the API
        return Array.isArray(v);
      },
      message: 'Images must be an array of strings'
    }
  },
  inspiredBy: {
    type: String,
    required: false,
  },
  category: {
    type: String,
    required: [true, 'Please provide a category'],
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
  
  // Ensure images array exists
  if (!this.images || !Array.isArray(this.images)) {
    this.images = ['/images/product-placeholder.svg'];
  }
  
  next();
});

// Initialize the model with proper type checking
let Product: Model<IProduct>;

try {
  // Try to get the existing model
  Product = mongoose.model<IProduct>('Product');
} catch {
  // Model doesn't exist, create it
  Product = mongoose.model<IProduct>('Product', productSchema);
}

export default Product;
