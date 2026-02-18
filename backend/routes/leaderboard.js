const express = require('express');
const router = express.Router();
const { verifyToken, authorizeRoles } = require('../middleware/auth');
const {
  getLeaderboard,
  getLeaderboardByState,
  getTopClasses,
  getClassRank
} = require('../controllers/leaderboardController');

/**
 * GET /api/leaderboard
 * Get complete class vs class leaderboard
 * Access: Student, Teacher (protected)
 * 
 * Returns: [{rank, className, ecoScore, forestState, lastUpdated}]
 */
router.get(
  '/',
  verifyToken,
  authorizeRoles('student', 'teacher'),
  getLeaderboard
);

/**
 * GET /api/leaderboard/state/:state
 * Get leaderboard filtered by forest state
 * Access: Student, Teacher (protected)
 * 
 * params: state (polluted, growing, healthy)
 * Returns: Leaderboard filtered by state
 */
router.get(
  '/state/:state',
  verifyToken,
  authorizeRoles('student', 'teacher'),
  getLeaderboardByState
);

/**
 * GET /api/leaderboard/top/:limit
 * Get top N classes by ecoScore
 * Access: Student, Teacher (protected)
 * 
 * params: limit (1-100)
 * Returns: Top N classes
 */
router.get(
  '/top/:limit',
  verifyToken,
  authorizeRoles('student', 'teacher'),
  getTopClasses
);

/**
 * GET /api/leaderboard/rank/:className
 * Get specific class rank and position
 * Access: Student, Teacher (protected)
 * 
 * params: className
 * Returns: Class rank, ecoScore, and position
 */
router.get(
  '/rank/:className',
  verifyToken,
  authorizeRoles('student', 'teacher'),
  getClassRank
);

module.exports = router;
