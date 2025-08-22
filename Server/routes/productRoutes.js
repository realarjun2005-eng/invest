const express = require('express');
const router = express.Router();
const {
  getProducts,
  getProductById,
  addProduct,
} = require('../controllers/productController');
const { protect, isAdmin } = require('../middleware/authMiddleware');

// Public
router.get('/', getProducts);
router.get('/:id', getProductById);

// Protected route (admin)
router.post('/', protect, isAdmin, addProduct);

module.exports = router;
