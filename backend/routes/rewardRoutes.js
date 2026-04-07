const express = require('express');
const router = express.Router();
const { verifyToken, authorizeRoles } = require('../middleware/auth');
const { getRewardItems, purchaseReward } = require('../controllers/rewardController');

router.get('/items', verifyToken, authorizeRoles('student'), getRewardItems);
router.post('/purchase', verifyToken, authorizeRoles('student'), purchaseReward);

module.exports = router;
