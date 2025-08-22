
const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const AccountDetails = require("../models/accountDetails");

// GET: Fetch user account details
router.get("/", protect, async (req, res) => {
  try {
    const userId = req.user._id;
    const details = await AccountDetails.findOne({ user: userId });
    if (!details) return res.status(404).json({ message: "Account details not found" });
    res.json(details);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// POST: Create or update account details
router.post("/", protect, async (req, res) => {
  try {
    const userId = req.user._id;
    const { bankName, accountNumber, ifsc, upi } = req.body;

    const updated = await AccountDetails.findOneAndUpdate(
      { user: userId },
      { bankName, accountNumber, ifsc, upi },
      { new: true, upsert: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "Failed to update details", error: err.message });
  }
});

module.exports = router;
