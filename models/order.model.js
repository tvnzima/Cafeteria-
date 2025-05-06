

// ✅ models/order.model.js
const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  orderId: { type: String, unique: true, required: true },
  customerId: { type: String, required: true },
  customerName: { type: String, required: true },
  items: [
    {
      name: { type: String, required: true },
      price: { type: Number, required: true },
      quantity: { type: Number, required: true }
    }
  ],
  totalPrice: { type: Number, required: true },
  paymentMethod: { type: String, enum: ['CASH', 'Bkash'], required: true },
  paymentStatus: { type: String, enum: ['Paid', 'Unpaid'], required: true },
  orderStatus: { type: String, enum: ['in process', 'done', 'canceled'], default: 'in process' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', orderSchema);