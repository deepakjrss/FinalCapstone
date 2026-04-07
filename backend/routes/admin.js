const express = require('express');
const router = express.Router();
const { verifyToken, authorizeRoles } = require('../middleware/auth');
const { getAdminAnalytics } = require('../controllers/analyticsController');

// GET /api/admin/analytics
// Get admin stats for their school (admin only)
router.get(
  '/analytics',
  verifyToken,
  authorizeRoles('admin'),
  getAdminAnalytics
);

module.exports = router;