import mongoose, { Schema } from 'mongoose';

const ContactFormSchema = new Schema({
  name: String,
  phone: String,
  message: String,
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.ContactForm || mongoose.model('ContactForm', ContactFormSchema);
