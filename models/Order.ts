import mongoose, { Schema } from 'mongoose';

// Item schema for order items
const OrderItemSchema = new Schema({
  id: {
    type: String,
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  }
});

const OrderSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Name is required']
  },
  email: {
    type: String,
    required: false
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required']
  },
  address: {
    type: String,
    required: [true, 'Delivery address is required']
  },
  city: {
    type: String,
    required: [true, 'City is required']
  },
  // Single product reference
  product: {
    type: String,
    required: false
  },
  // For cart orders with multiple items
  items: {
    type: [OrderItemSchema],
    required: false
  },
  // Order totals
  originalSubtotal: {
    type: Number,
    required: false
  },
  bulkDiscount: {
    type: Number,
    required: false,
    default: 0
  },
  subtotal: {
    type: Number,
    required: [true, 'Subtotal is required']
  },
  shipping: {
    type: Number,
    required: [true, 'Shipping fee is required']
  },
  total: {
    type: Number,
    required: [true, 'Total is required']
  },
  totalQuantity: {
    type: Number,
    required: false
  },
  promoMessage: {
    type: String,
    required: false
  },
  note: {
    type: String
  },
  status: {
    type: String,
    enum: ['New', 'Called', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled'],
    default: 'New'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.models.Order || mongoose.model('Order', OrderSchema); 