const User = require('../models/User');

// Get direct referrals (level 1)
exports.getTeam = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId).populate({
      path: 'referrals',
      select: 'name email inviteCode invitedBy createdAt',
      options: { lean: true }
    }).lean();
    const level1 = user.referrals.map(r => ({ ...r }));
    // Level 2: users invited by level1
    const level2 = await User.find({ invitedBy: { $in: level1.map(u => u.inviteCode) } }, 'name email inviteCode invitedBy createdAt').lean();
    // Level 3: users invited by level2
    const level3 = await User.find({ invitedBy: { $in: level2.map(u => u.inviteCode) } }, 'name email inviteCode invitedBy createdAt').lean();
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.set('Pragma', 'no-cache');
    res.set('Expires', '0');
    res.set('Surrogate-Control', 'no-store');
    res.json({
      level1,
      level2,
      level3,
      totalReferrals: level1.length + level2.length + level3.length,
    });
  } catch (err) {
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
};

// Earnings (you can use static amount for simplicity)
exports.getReferralEarnings = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId).populate('referrals');

    const level1 = user.referrals;
    const level2 = await User.find({ referredBy: { $in: level1.map(u => u.referralCode) } });
    const level3 = await User.find({ referredBy: { $in: level2.map(u => u.referralCode) } });

    const earnings = {
      level1: level1.length * 10,
      level2: level2.length * 5,
      level3: level3.length * 2,
    };

    res.json({
      ...earnings,
      total: earnings.level1 + earnings.level2 + earnings.level3,
    });
  } catch (err) {
    res.status(500).json({ message: 'Error calculating earnings', error: err.message });
  }
};
