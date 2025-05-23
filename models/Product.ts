import mongoose, { Model } from 'mongoose';

// Define interface for translations
interface ITranslation {
  en: string;
  fr: string;
}

// Define interface for Product document
interface IProduct extends mongoose.Document {
  name: string | ITranslation;
  slug: string;
  description: string | ITranslation;
  price: number;
  originalPrice?: number;
  volume: string;
  gender: 'Homme' | 'Femme' | 'Mixte';
  images: string[];
  inspiredBy?: string | ITranslation;
  category: string;
  inStock: boolean;
  featured: boolean;
  createdAt: Date;
  updatedAt: Date;
  getLocalizedName(locale: string): string;
  getLocalizedDescription(locale: string): string;
  getLocalizedInspiredBy(locale: string): string;
}

// Define translation schema
const translationSchema = new mongoose.Schema({
  en: { type: String, required: true },
  fr: { type: String, required: false }
}, { _id: false });

// Define the schema
const productSchema = new mongoose.Schema({
  name: {
    type: mongoose.Schema.Types.Mixed,
    required: [true, 'Please provide a product name'],
    validate: {
      validator: function(v: any) {
        // Accept either a string or an object with translations
        return typeof v === 'string' || (v && typeof v === 'object' && v.en);
      },
      message: 'Name must be a string or a translation object with at least an English version'
    }
  },
  slug: {
    type: String,
    required: true,
    unique: true,
  },
  description: {
    type: mongoose.Schema.Types.Mixed,
    required: [true, 'Please provide a product description'],
    validate: {
      validator: function(v: any) {
        // Accept either a string or an object with translations
        return typeof v === 'string' || (v && typeof v === 'object' && v.en);
      },
      message: 'Description must be a string or a translation object with at least an English version'
    }
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
    type: mongoose.Schema.Types.Mixed,
    required: false,
    validate: {
      validator: function(v: any) {
        // Accept either a string, null/undefined, or an object with translations
        return v === null || v === undefined || typeof v === 'string' || (v && typeof v === 'object' && v.en);
      },
      message: 'InspiredBy must be a string or a translation object with at least an English version'
    }
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

// Helper methods to get localized content
productSchema.methods.getLocalizedName = function(locale: string): string {
  if (typeof this.name === 'object') {
    // If the name is a translation object, return the requested locale or fall back to French
    return this.name[locale] || this.name.fr || this.name.en || '';
  }
  // If it's a string, just return it
  return this.name || '';
};

productSchema.methods.getLocalizedDescription = function(locale: string): string {
  if (this.description && typeof this.description === 'object') {
    // If the description is a translation object, return the requested locale or fall back to French
    return this.description[locale] || this.description.fr || this.description.en || '';
  }
  // If it's a string or undefined, just return it
  return this.description || '';
};

productSchema.methods.getLocalizedInspiredBy = function(locale: string): string {
  if (this.inspiredBy && typeof this.inspiredBy === 'object') {
    // If the inspiredBy is a translation object, return the requested locale or fall back to French
    return this.inspiredBy[locale] || this.inspiredBy.fr || this.inspiredBy.en || '';
  }
  // If it's a string or undefined, just return it
  return this.inspiredBy || '';
};

// Create slug from name before saving
productSchema.pre('save', function(next) {
  if (this.isModified('name')) {
    // Get the name to use for the slug
    const nameForSlug = typeof this.name === 'string' ? this.name : (this.name?.en || '');
    
    this.slug = nameForSlug
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
  console.log('Using existing Product model');
} catch {
  // Model doesn't exist, create it
  Product = mongoose.model<IProduct>('Product', productSchema);
  console.log('Created new Product model');
}

export default Product;
