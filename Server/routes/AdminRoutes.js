
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Product = require('../models/Product');
const WithdrawRequest = require('../models/withdraw');
const { protect, isAdmin } = require('../middleware/authMiddleware');

// Create or update the offer product (Special Plan)
router.post('/offer-product', protect, isAdmin, async (req, res) => {
  try {
    const {
      title = 'Special Plan',
      description = 'Special offer plan',
      image = 'https://via.placeholder.com/150x90?text=OLA+Car',
      price = 600,
      category = 'Special',
      offer = 'Special',
      dailyIncome = 1900,
      totalIncome = 1900,
      days = 1
    } = req.body || {};
    let product = await Product.findOne({ title });
    if (product) {
      product.description = description;
      product.image = image;
      product.price = price;
      product.category = category;
      product.offer = offer;
      product.dailyIncome = dailyIncome;
      product.totalIncome = totalIncome;
      product.days = days;
      await product.save();
      return res.json({ message: 'Offer product updated', product });
    } else {
      product = await Product.create({
        title,
        description,
        image,
        price,
        category,
        offer,
        dailyIncome,
        totalIncome,
        days
      });
      return res.json({ message: 'Offer product created', product });
    }
  } catch (err) {
    res.status(500).json({ message: 'Error creating/updating offer product', error: err.message });
  }
});

// Get all users
router.get('/users', protect, isAdmin, async (req, res) => {
  const users = await User.find();
  res.json(users);
});

// Add product
router.post('/product', protect, isAdmin, async (req, res) => {
  try {
    const { title, price } = req.body;
    if (!title || !price) {
      return res.status(400).json({ message: 'Title and price are required.' });
    }
    const product = await Product.create(req.body);
    res.json(product);
  } catch (err) {
    res.status(400).json({ message: 'Error adding product', error: err.message });
  }
});

// Approve withdraw
router.put('/withdraw/:id/approve', protect, isAdmin, async (req, res) => {
  const reqId = req.params.id;
  const withdraw = await WithdrawRequest.findByIdAndUpdate(reqId, { status: 'Approved' }, { new: true });
  res.json(withdraw);
});
// ...existing code...
// Reject withdraw
router.put('/withdraw/:id/reject', protect, isAdmin, async (req, res) => {
  const reqId = req.params.id;
  const withdraw = await WithdrawRequest.findByIdAndUpdate(reqId, { status: 'Rejected' }, { new: true });
  res.json(withdraw);
});



// Get all withdrawal requests (for admin panel)
router.get('/withdraws', protect, isAdmin, async (req, res) => {
  try {
    const withdraws = await WithdrawRequest.find().sort({ createdAt: -1 }).populate('user', 'name email');
    res.json(withdraws);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching withdraw requests', error: err.message });
  }
});

// Update user
router.put('/user/:id', protect, isAdmin, async (req, res) => {
  const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updatedUser);
});

module.exports = router;
