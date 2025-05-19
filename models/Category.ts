import mongoose, { Model } from 'mongoose';

// Define interface for Category document
interface ICategory extends mongoose.Document {
  name: string;
  slug: string;
  description?: string;
  image?: string;
  featured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Define the schema
const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a category name'],
    trim: true,
    unique: true,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
  },
  description: {
    type: String,
    required: false,
  },
  image: {
    type: String,
    required: false,
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
categorySchema.pre('save', function(next) {
  if (this.isModified('name')) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
  }
  
  if (this.isModified()) {
    this.updatedAt = new Date();
  }
  
  next();
});

// Initialize the model with proper type checking
let Category: Model<ICategory>;

try {
  // Try to get the existing model
  Category = mongoose.model<ICategory>('Category');
} catch {
  // Model doesn't exist, create it
  Category = mongoose.model<ICategory>('Category', categorySchema);
}

export default Category;
