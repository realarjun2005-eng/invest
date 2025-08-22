const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const User = require('../models/User');
const Product = require('../models/Product');

// GET /api/income/today-total
router.get('/today-total', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('purchasedProducts.product');
    if (!user) return res.status(404).json({ message: 'User not found' });
    
    const today = new Date();
    const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const todayEnd = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59);
    
    let totalToday = 0;
    let todayEntries = [];
    
    for (const p of user.purchasedProducts) {
      if (!p.product) continue;
      const purchaseDate = new Date(p.purchaseDate);
      const today = new Date();
      
      // Income starts from next day after purchase, at 12 PM
      const incomeStartDate = new Date(purchaseDate);
      incomeStartDate.setDate(incomeStartDate.getDate() + 1); // Next day
      incomeStartDate.setHours(12, 0, 0, 0); // 12 PM
      
      // Check if income period has started
      if (today < incomeStartDate) {
        continue; // Income hasn't started yet
      }
      
      // Calculate how many days of income are eligible
      const daysPassed = Math.floor((today - incomeStartDate) / (1000 * 60 * 60 * 24));
      const maxDays = p.product.days || 0;
      
      // Check if today is a valid income day for this product
      if (daysPassed >= 0 && daysPassed < maxDays) {
        // Calculate today's income date
        const todayIncomeDate = new Date(incomeStartDate);
        todayIncomeDate.setDate(incomeStartDate.getDate() + daysPassed);
        todayIncomeDate.setHours(12, 0, 0, 0); // Income at 12 PM
        
        // Only include if today's income time has passed AND it's actually today
        const currentTime = new Date();
        if (todayIncomeDate >= todayStart && todayIncomeDate <= todayEnd && todayIncomeDate <= currentTime) {
          totalToday += p.product.dailyIncome || 0;
          todayEntries.push({
            productName: p.product.name,
            amount: p.product.dailyIncome || 0,
            purchaseDate: p.purchaseDate,
            incomeDay: daysPassed + 1, // Which day of income period
            totalDays: maxDays,
            incomeDate: todayIncomeDate
          });
        }
      }
    }
    
    res.json({
      date: today.toLocaleDateString('en-IN'),
      totalIncome: totalToday,
      entriesCount: todayEntries.length,
      entries: todayEntries,
      debug: {
        todayString: today.toDateString(),
        userProductsCount: user.purchasedProducts.length
      }
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// GET /api/income/perday?page=1
router.get('/perday', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('purchasedProducts.product');
    if (!user) return res.status(404).json({ message: 'User not found' });
    
    // Calculate daily income records for each purchased product
    let records = [];
    
    for (const p of user.purchasedProducts) {
      if (!p.product) continue;
      const purchaseDate = new Date(p.purchaseDate);
      const today = new Date();
      
      // Income starts from next day after purchase, at 12 PM
      const incomeStartDate = new Date(purchaseDate);
      incomeStartDate.setDate(incomeStartDate.getDate() + 1); // Next day
      incomeStartDate.setHours(12, 0, 0, 0); // 12 PM
      
      // Check if income period has started
      if (today < incomeStartDate) {
        continue; // Income hasn't started yet
      }
      
      // Calculate how many days of income are eligible
      const daysPassed = Math.floor((today - incomeStartDate) / (1000 * 60 * 60 * 24));
      const maxDays = p.product.days || 0;
      const eligibleDays = Math.min(daysPassed + 1, maxDays);
      
      for (let i = 0; i < eligibleDays; i++) {
        const incomeDate = new Date(incomeStartDate);
        incomeDate.setDate(incomeDate.getDate() + i);
        
        // Set payment time at 12 PM + some consistent offset based on product
        const paymentTime = new Date(incomeDate);
        const baseHour = 12 + (p.product._id.toString().charCodeAt(0) % 6); // 12 PM to 6 PM
        const baseMinute = (p.product._id.toString().charCodeAt(1) % 60); // Consistent minute
        
        paymentTime.setHours(baseHour, baseMinute, 0, 0);
        
        // Only add if payment time has passed
        if (paymentTime <= today) {
          records.push({
            date: paymentTime,
            amount: p.product.dailyIncome || 0,
            source: p.product.name || 'Product',
            productId: p.product._id,
            purchaseDate: p.purchaseDate,
            incomeDay: i + 1 // Which day of income period
          });
        }
      }
    }
    
    // Sort by date descending
    records.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    // Pagination
    const page = parseInt(req.query.page) || 1;
    const perPage = 10;
    const paged = records.slice((page - 1) * perPage, page * perPage);
    res.json(paged);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
