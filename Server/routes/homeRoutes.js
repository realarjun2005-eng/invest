const express = require('express');
const router = express.Router();

const Product = require('../models/Product');
router.get('/offer', async (req, res) => {
  try {
    const offer = await Product.findOne({ title: 'Special Plan' });
    if (!offer) return res.status(404).json({ message: 'Offer product not found' });
    res.json({
      _id: offer._id,
      offerPeriod: offer.days,
      price: offer.price,
      dailyProfit: offer.dailyIncome,
      totalRevenue: offer.totalIncome,
      image: offer.image,
      title: offer.title
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

router.get('/transactions', (req, res) => {
  res.json([
    { message: 'User ka****gmail.com withdrew ₹2500 successfully - 2025/07/19 01:18' },
    { message: 'User kshra****gmail.com withdrew ₹1200 successfully - 2025/07/19 02:35' },
     { message: 'User pava****gmail.com withdrew ₹2500 successfully - 2025/07/19 01:18' },
    { message: 'User kun****gmail.com withdrew ₹1200 successfully - 2025/07/19 02:35' }, { message: 'User 8740 *** 29 withdrew ₹2500 successfully - 2025/07/19 01:18' },
    { message: 'User shivam****gmail.comwithdrew ₹1200 successfully - 2025/07/19 02:35' },
     { message: 'User karan****gmail.com withdrew ₹2500 successfully - 2025/07/19 01:18' },
    { message: 'User karam****gmail.com withdrew ₹1200 successfully - 2025/07/19 02:35' },
     { message: 'User karan****gmail.com withdrew ₹2500 successfully - 2025/07/19 01:18' },
    { message: 'User ka****gmail.com withdrew ₹1200 successfully - 2025/07/19 02:35' }, { message: 'User 8740 *** 29 withdrew ₹2500 successfully - 2025/07/19 01:18' },
    { message: 'User 9kan****gmail.com withdrew ₹1200 successfully - 2025/07/19 02:35' },
     { message: 'User karan****gmail.com withdrew ₹2500 successfully - 2025/07/19 01:18' },
    { message: 'User karan****gmail.com withdrew ₹1200 successfully - 2025/07/19 02:35' },
     { message: 'User nav****gmail.com withdrew ₹2500 successfully - 2025/07/19 01:18' },
    { message: 'User an****gmail.com withdrew ₹1200 successfully - 2025/07/19 02:35' }, { message: 'User 8740 *** 29 withdrew ₹2500 successfully - 2025/07/19 01:18' },
    { message: 'User ran****gmail.comwithdrew ₹1200 successfully - 2025/07/19 02:35' },
    // Add more as needed
  ]);
});

module.exports = router;
