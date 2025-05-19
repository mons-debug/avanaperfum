import mongoose, { Schema } from 'mongoose';

const StaticContentSchema = new Schema({
  section: String,  // example: 'about'
  content: String,
  updatedAt: { type: Date, default: Date.now }
});

export default mongoose.models.StaticContent || mongoose.model('StaticContent', StaticContentSchema);
