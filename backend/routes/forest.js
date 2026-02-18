const express = require('express');
const router = express.Router();
const { verifyToken, authorizeRoles } = require('../middleware/auth');
const {
  getForestByClass,
  updateForestScore,
  getAllForests,
  getForestStats
} = require('../controllers/forestController');

/**
 * GET /api/forest/:className
 * Get forest data for a specific class
 * Access: Student, Teacher (protected)
 */
router.get(
  '/:className',
  verifyToken,
  authorizeRoles('student', 'teacher'),
  getForestByClass
);

/**
 * GET /api/forest
 * Get all forests
 * Access: Teacher, Admin (protected)
 */
router.get(
  '/',
  verifyToken,
  authorizeRoles('teacher', 'admin'),
  getAllForests
);

/**
 * PUT /api/forest/update
 * Update forest eco score
 * Body: { className, points }
 * Access: Teacher only (protected)
 */
router.put(
  '/update',
  verifyToken,
  authorizeRoles('teacher'),
  updateForestScore
);

/**
 * GET /api/forest/stats/summary
 * Get forest statistics
 * Access: Teacher, Admin (protected)
 */
router.get(
  '/stats/summary',
  verifyToken,
  authorizeRoles('teacher', 'admin'),
  getForestStats
);

module.exports = router;
