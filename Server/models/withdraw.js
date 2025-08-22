// models/withdraw.model.js
const mongoose = require("mongoose");

const withdrawSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  amount: { type: Number, required: true },
  status: {
    type: String,
    enum: ["Pending", "Approved", "Rejected"],
    default: "Pending"
  },
  requestedAt: { type: Date, default: Date.now },
  remarks: { type: String },
  bankSnapshot: {
    accountNumber: String,
    ifsc: String,
    bankName: String,
    accountHolder: String
  }
}, { timestamps: true });

module.exports = mongoose.model("Withdraw", withdrawSchema);
