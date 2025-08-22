const express = require('express');
const router = express.Router();
const { getTeam, getReferralEarnings } = require('../controllers/teamController');
const { protect } = require('../middleware/authMiddleware');

router.get('/hierarchy', protect, getTeam);
router.get('/earnings', protect, getReferralEarnings);

module.exports = router;
