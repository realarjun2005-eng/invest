const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const Withdraw = require("../models/withdraw");

// GET: Available withdrawable amount for user
router.get("/available", protect, async (req, res) => {
  try {
    const User = require("../models/User");
    const user = await User.findById(req.user.id).populate('purchasedProducts.product');
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
    
    // Update user.totalIncome in the database
    
    // Update user.totalIncome in the database
    if (user.totalIncome !== totalIncome) {
      user.totalIncome = totalIncome;
      await user.save();
    }
    // Subtract withdrawals with status Pending or Approved only
    const relevantWithdrawals = await Withdraw.find({
      user: req.user.id,
      status: { $in: ['Pending', 'Approved'] }
    });
    const withdrawn = relevantWithdrawals.reduce((sum, w) => sum + (w.amount || 0), 0);
    let available = totalIncome - withdrawn;
    let netIncome = totalIncome;
    // Clamp to zero if negative
    if (totalIncome < 0) totalIncome = 0;
    if (available < 0) available = 0;
    if (netIncome < 0) netIncome = 0;
    
    res.json({ 
      available, 
      totalIncome, 
      netIncome,
      debug: {
        totalWithdrawals: relevantWithdrawals.length,
        withdrawnAmount: withdrawn,
        withdrawalDetails: relevantWithdrawals.map(w => ({
          amount: w.amount,
          status: w.status,
          date: w.requestedAt
        })),
        calculation: `${totalIncome} - ${withdrawn} = ${available}`
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch available amount", error: error.message });
  }
});

// GET: User-specific withdraw requests
router.get("/", protect, async (req, res) => {
  try {
    const withdrawals = await Withdraw.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(withdrawals);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch records", error: error.message });
  }
});

// POST: Request a withdrawal
const User = require("../models/User");
// POST: Request a withdrawal (up to totalIncome)
const AccountDetails = require("../models/accountDetails");
router.post("/", protect, async (req, res) => {
  try {
    const { amount } = req.body;
    if (!amount || amount <= 0) {
      return res.status(400).json({ message: "Enter valid amount" });
    }
    // Calculate totalIncome dynamically
    const user = await User.findById(req.user.id).populate('purchasedProducts.product');
    // Fetch bank details from AccountDetails collection
    const accountDetails = await AccountDetails.findOne({ user: req.user.id });
    if (!accountDetails || !accountDetails.accountNumber || !accountDetails.ifsc) {
      return res.status(400).json({ message: "Please add your bank account details before withdrawing." });
    }
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
    
    // Update user.totalIncome in the database
    if (user.totalIncome !== totalIncome) {
      user.totalIncome = totalIncome;
      await user.save();
    }
    // User can only request up to available to withdraw (totalIncome - all pending/approved withdrawals)
    const relevantWithdrawals = await Withdraw.find({
      user: req.user.id,
      status: { $in: ['Pending', 'Approved'] }
    });
    const withdrawn = relevantWithdrawals.reduce((sum, w) => sum + (w.amount || 0), 0);
    const available = totalIncome - withdrawn;
    if (amount > available) {
      return res.status(400).json({ message: `You can withdraw up to your available to withdraw amount: ₹${available}` });
    }
    const withdraw = new Withdraw({
      user: req.user.id,
      amount,
      status: 'Pending',
      bankSnapshot: {
        accountNumber: accountDetails.accountNumber,
        ifsc: accountDetails.ifsc,
        bankName: accountDetails.bankName,
        accountHolder: accountDetails.accountHolder || user.name
      }
    });
    await withdraw.save();
    // Do NOT update user.totalIncome here; only approved withdrawals affect available balance
    res.status(201).json({ message: "Withdrawal requested", withdraw });
  } catch (error) {
    res.status(500).json({ message: "Failed to request withdrawal", error: error.message });
  }
});

// POST: Admin approves withdrawal
router.post("/approve", protect, async (req, res) => {
  try {
    if (req.user.role !== 'admin') return res.status(403).json({ message: 'Admin only' });
    const { withdrawId } = req.body;
    const withdraw = await Withdraw.findById(withdrawId);
    if (!withdraw) return res.status(404).json({ message: 'Withdraw request not found' });
    if (withdraw.status !== 'Pending') return res.status(400).json({ message: 'Already processed' });
    withdraw.status = 'Approved';
    await withdraw.save();
    // Do NOT update user.totalIncome here; only approved withdrawals affect available balance
    res.json({ message: 'Withdrawal approved', withdraw });
  } catch (error) {
    res.status(500).json({ message: "Failed to approve withdrawal", error: error.message });
  }
});

module.exports = router;
