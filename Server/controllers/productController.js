const Product = require('../models/Product');

// Get all products
exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Get single product by ID
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Add a new product (admin only)
exports.addProduct = async (req, res) => {
  try {
    const { title, description, image, price, category, offer, dailyIncome, totalIncome, days, planType } = req.body;

    const newProduct = new Product({
      title,
      description,
      image,
      price,
      category,
      offer,
      dailyIncome,
      totalIncome,
      days,
      planType: planType || 'daily'
    });
    const saved = await newProduct.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: 'Error adding product', error: err.message });
  }
};
