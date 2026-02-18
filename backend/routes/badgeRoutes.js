const express = require('express');
const router = express.Router();
const {
  getMyBadges,
  getStudentBadgeProgress,
  getAllBadges,
  createBadge
} = require('../controllers/badgeController');
const { verifyToken, authorizeRoles } = require('../middleware/auth');

// Student routes (protected)
router.get('/my', verifyToken, authorizeRoles('student'), getMyBadges);
router.get('/progress', verifyToken, authorizeRoles('student'), getStudentBadgeProgress);

// Admin routes (protected)
router.get('/admin/all', verifyToken, authorizeRoles('admin'), getAllBadges);
router.post('/admin/create', verifyToken, authorizeRoles('admin'), createBadge);

module.exports = router;
