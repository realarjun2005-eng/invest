const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const User = require('../models/User');

// POST /api/checkin - User checks in for the day
router.post('/', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id || req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const lastCheckin = user.lastCheckin ? new Date(user.lastCheckin) : null;
    let streak = user.checkinStreak || 0;
    let reward = 5;
    if (lastCheckin) {
      const yesterday = new Date(today);
      yesterday.setDate(today.getDate() - 1);
      yesterday.setHours(0, 0, 0, 0);
      if (lastCheckin >= today) {
        return res.status(400).json({ message: 'Already checked in today' });
      } else if (lastCheckin >= yesterday) {
        streak += 1;
        reward = 5 * streak;
      } else {
        streak = 1;
        reward = 5;
      }
    } else {
      streak = 1;
      reward = 5;
    }
    user.lastCheckin = new Date();
    user.checkinStreak = streak;
    user.balance = (user.balance || 0) + reward;
    await user.save();
    res.json({ message: `Check-in successful! You earned ₹${reward}.`, date: user.lastCheckin, streak, reward, balance: user.balance });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// GET /api/checkin/status - Get today's check-in status
router.get('/status', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id || req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const lastCheckin = user.lastCheckin ? new Date(user.lastCheckin) : null;
    const checkedInToday = lastCheckin && lastCheckin >= today;
    res.json({ checkedInToday, lastCheckin: user.lastCheckin });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
