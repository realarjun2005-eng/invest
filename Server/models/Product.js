const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  image: String,
  price: { type: Number, required: true },
  category: String,
  offer: String,
  dailyIncome: Number,
  totalIncome: Number,
  days: Number,
  planType: { type: String, default: 'daily' },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Product', productSchema);
