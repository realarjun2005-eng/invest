const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const User = require('../models/User');

// GET /api/user/profile
const Recharge = require('../models/Recharge');
router.get('/profile', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password').populate('purchasedProducts.product');
    if (!user) return res.status(404).json({ message: 'User not found' });
    // Calculate totalIncome dynamically with 12 PM rule
    let totalIncome = 0;
    const today = new Date();
    
    for (const p of user.purchasedProducts) {
      if (!p.product) continue;
      const purchaseDate = new Date(p.purchaseDate);
      
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
      
      // Only count completed income periods (past 12 PM)
      let actualEligibleDays = eligibleDays;
      const currentTime = new Date();
      const todayAt12PM = new Date();
      todayAt12PM.setHours(12, 0, 0, 0);
      
      // If today's income time hasn't passed yet, don't count today
      if (daysPassed === eligibleDays - 1 && currentTime < todayAt12PM) {
        actualEligibleDays -= 1;
      }
      
      totalIncome += (p.product.dailyIncome || 0) * Math.max(0, actualEligibleDays);
    }
    // Subtract both pending and approved withdrawals from total earning (only rejected withdrawals don't affect total earning)
    const Withdraw = require('../models/withdraw');
    const processedWithdrawals = await Withdraw.find({ user: req.user._id, status: { $in: ['Pending', 'Approved'] } });
    const processedAmount = processedWithdrawals.reduce((sum, w) => sum + (w.amount || 0), 0);
    // Also show total rejected withdrawals for transparency
    const rejectedWithdrawals = await Withdraw.find({ user: req.user._id, status: 'Rejected' });
    const rejectedAmount = rejectedWithdrawals.reduce((sum, w) => sum + (w.amount || 0), 0);
    // Calculate total recharge (sum of all approved recharges)
    const recharges = await Recharge.find({ user: req.user._id, status: 'Approved' });
    const totalRecharge = recharges.reduce((sum, r) => sum + (r.amount || 0), 0);
    const userObj = user.toObject();
    // Subtract both pending and approved withdrawals from total earning
    const totalEarning = totalIncome - processedAmount;
    res.json({
      user: {
        ...userObj,
        totalEarning,
        recharge: totalRecharge,
        inviteCode: userObj.inviteCode,
        rejectedWithdrawals: rejectedAmount
      }
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
