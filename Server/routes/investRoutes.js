const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const User = require('../models/User');
const Product = require('../models/Product');

// POST /api/invest/:productId
router.post('/:productId', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const product = await Product.findById(req.params.productId);
    if (!user || !product) return res.status(404).json({ message: 'User or Product not found' });
    
    // Check if user already purchased this product to prevent duplicates
    const alreadyPurchased = user.purchasedProducts.some(p => p.product.toString() === req.params.productId);
    if (alreadyPurchased) {
      return res.status(400).json({ message: 'Product already purchased' });
    }
    
    if ((user.balance || 0) < product.price) return res.status(400).json({ message: 'Insufficient balance' });
    // Deduct balance
    user.balance -= product.price;
    // Add to purchasedProducts
    user.purchasedProducts.push({ product: product._id });
    await user.save();
    res.json({ message: 'Investment successful', balance: user.balance });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
