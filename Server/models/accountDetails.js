// models/accountDetails.model.js
const mongoose = require("mongoose");

const accountDetailsSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  bankName: { type: String },
  accountNumber: { type: String },
  ifsc: { type: String },
  upi: { type: String },
}, { timestamps: true });

module.exports = mongoose.model("AccountDetails", accountDetailsSchema);
