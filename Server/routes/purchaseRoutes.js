const express = require('express');
const router = express.Router();
const { purchaseProduct, getMyPurchases } = require('../controllers/purchaseController');
const { protect } = require('../middleware/authMiddleware');

// Purchase a product
router.post('/purchase', protect, purchaseProduct);

// Get all purchased products for the logged-in user
router.get('/mypurchases', protect, getMyPurchases);

module.exports = router;
