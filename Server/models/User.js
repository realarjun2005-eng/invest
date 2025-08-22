const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');


const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  purchasedProducts: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
      },
      purchaseDate: {
        type: Date,
        default: Date.now
      }
    }
  ],
  balance: { type: Number, default: 0 },
  totalIncome: { type: Number, default: 0 },
  bankAccount: {
    accountNumber: { type: String },
    ifsc: { type: String },
    bankName: { type: String },
    accountHolder: { type: String }
  },
  lastCheckin: { type: Date },
  checkinStreak: { type: Number, default: 0 },
  inviteCode: { type: String, unique: true },
  invitedBy: { type: String }
}, { timestamps: true });

// Virtual for direct referrals
userSchema.virtual('referrals', {
  ref: 'User',
  localField: 'inviteCode',
  foreignField: 'invitedBy',
  justOne: false
});

userSchema.set('toObject', { virtuals: true });
userSchema.set('toJSON', { virtuals: true });

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.comparePassword = function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
