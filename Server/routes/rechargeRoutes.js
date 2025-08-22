// POST /api/recharge/reject - Admin rejects recharge

const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');

const User = require('../models/User');
const Recharge = require('../models/Recharge');
const QRCode = require('qrcode');


// POST /api/recharge/request - User requests recharge, gets QR code
router.post('/request', protect, async (req, res) => {
  try {
    const { amount } = req.body;
    if (!amount || amount <= 0) {
      return res.status(400).json({ message: 'Invalid amount' });
    }
    // Generate QR code for payment (for demo, encode amount and user)
    const qrData = `upi://pay?pa=7300655336@ptyes&pn=InvestPro&am=${amount}&cu=INR&user=${req.user._id}`;
    const qrUrl = await QRCode.toDataURL(qrData);
    // Create recharge record (pending)
    const recharge = await Recharge.create({
      user: req.user._id,
      amount,
      qrUrl,
      status: 'Pending',
    });
    res.json({ message: 'Recharge request created', recharge });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// POST /api/recharge/utr - User submits UTR for pending recharge
router.post('/utr', protect, async (req, res) => {
  try {
    const { rechargeId, utr } = req.body;
    if (!rechargeId || !utr) return res.status(400).json({ message: 'Missing rechargeId or UTR' });
    const recharge = await Recharge.findOne({ _id: rechargeId, user: req.user._id });
    if (!recharge) return res.status(404).json({ message: 'Recharge not found' });
    recharge.utr = utr;
    recharge.status = 'Pending';
    await recharge.save();
    res.json({ message: 'UTR submitted, waiting for admin approval', recharge });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// GET /api/recharge/history - User's recharge requests
router.get('/history', protect, async (req, res) => {
  try {
    // Return all recharge records for the user, including UTR and status
    const recharges = await Recharge.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .select('amount utr status createdAt approvedAt qrUrl');
    res.json(recharges);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// POST /api/recharge/approve - Admin approves recharge
router.post('/approve', protect, async (req, res) => {
  try {
    if (req.user.role !== 'admin') return res.status(403).json({ message: 'Admin only' });
    const { rechargeId } = req.body;
    const recharge = await Recharge.findById(rechargeId);
    if (!recharge) return res.status(404).json({ message: 'Recharge not found' });
    if (recharge.status !== 'Pending') return res.status(400).json({ message: 'Already processed' });
    recharge.status = 'Approved';
    recharge.approvedAt = new Date();
    recharge.admin = req.user._id;
    await recharge.save();
    // Credit user's balance
    const user = await User.findById(recharge.user);
    user.balance = (user.balance || 0) + recharge.amount;
    await user.save();
    res.json({ message: 'Recharge approved', recharge });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// GET /api/recharge/all-pending - Admin gets all pending recharges
router.get('/all-pending', protect, async (req, res) => {
  try {
    if (req.user.role !== 'admin') return res.status(403).json({ message: 'Admin only' });
    // Ensure UTR is included in the response
    const recharges = await Recharge.find({ status: 'Pending' })
      .sort({ createdAt: -1 })
      .populate('user', 'email name')
      .select('amount utr status createdAt approvedAt qrUrl user');
    res.json(recharges);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});
router.post('/reject', protect, async (req, res) => {
  try {
    if (req.user.role !== 'admin') return res.status(403).json({ message: 'Admin only' });
    const { rechargeId } = req.body;
    const recharge = await Recharge.findById(rechargeId);
    if (!recharge) return res.status(404).json({ message: 'Recharge not found' });
    if (recharge.status !== 'Pending') return res.status(400).json({ message: 'Already processed' });
    recharge.status = 'Rejected';
    recharge.approvedAt = new Date();
    recharge.admin = req.user._id;
    await recharge.save();
    res.json({ message: 'Recharge rejected', recharge });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});
module.exports = router;
