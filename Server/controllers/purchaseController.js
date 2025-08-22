const User = require('../models/User');
const Product = require('../models/Product');

// Purchase a product
exports.purchaseProduct = async (req, res) => {
  try {
    const userId = req.user._id;
    const { productId } = req.body;
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Prevent duplicate purchase (optional)
    const alreadyPurchased = user.purchasedProducts.some(p => p.product.toString() === productId);
    if (alreadyPurchased) {
      return res.status(400).json({ message: 'Product already purchased' });
    }

    user.purchasedProducts.push({ product: productId });
    await user.save();
    res.status(200).json({ message: 'Product purchased successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Get all purchased products for a user
exports.getMyPurchases = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId).populate('purchasedProducts.product');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.status(200).json(user.purchasedProducts);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
