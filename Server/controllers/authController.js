const User = require('../models/User');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
  try {
    const { name, email, password, invite } = req.body;
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: 'Email already registered' });
    // Generate a unique invite code (6 chars, alphanumeric)
    let inviteCode;
    while (true) {
      inviteCode = Math.random().toString(36).substring(2, 8).toUpperCase();
      if (!(await User.findOne({ inviteCode }))) break;
    }
    const user = new User({ name, email, password, inviteCode, invitedBy: invite });
    await user.save();
    res.status(201).json({ message: 'Registered successfully', inviteCode });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    let user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    // Auto-generate inviteCode for existing users if missing
    if (!user.inviteCode) {
      let inviteCode;
      while (true) {
        inviteCode = Math.random().toString(36).substring(2, 8).toUpperCase();
        if (!(await User.findOne({ inviteCode }))) break;
      }
      user.inviteCode = inviteCode;
      await user.save();
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
    // Exclude password from user object
    const { password: pwd, ...userData } = user.toObject();
    res.json({ token, user: userData });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};