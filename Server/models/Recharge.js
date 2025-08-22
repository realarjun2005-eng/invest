const mongoose = require('mongoose');

const rechargeSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  amount: { type: Number, required: true },
  utr: { type: String },
  qrUrl: { type: String },
  status: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' },
  createdAt: { type: Date, default: Date.now },
  approvedAt: { type: Date },
  admin: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // who approved
});

module.exports = mongoose.model('Recharge', rechargeSchema);
