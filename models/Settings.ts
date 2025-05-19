import mongoose, { Schema, Document } from 'mongoose';

export interface ISettings extends Document {
  shippingFee: number;
  freeShippingThreshold: number;
  currency: string;
  taxRate: number;
  createdAt: Date;
  updatedAt: Date;
}

const SettingsSchema: Schema = new Schema(
  {
    shippingFee: {
      type: Number,
      default: 30,
      required: true,
    },
    freeShippingThreshold: {
      type: Number,
      default: 250,
      required: true,
    },
    currency: {
      type: String,
      default: 'DH',
      required: true,
    },
    taxRate: {
      type: Number,
      default: 0,
      required: true,
    }
  },
  {
    timestamps: true,
  }
);

// Export Settings model or create it if it doesn't exist
export default mongoose.models.Settings || mongoose.model<ISettings>('Settings', SettingsSchema); 