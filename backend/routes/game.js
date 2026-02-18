const express = require('express');
const router = express.Router();
const { verifyToken, authorizeRoles } = require('../middleware/auth');
const {
  getAvailableGames,
  getGameById,
  submitGameAttempt,
  getStudentGameStats,
  getStudentAttempts
} = require('../controllers/gameController');

/**
 * GET /api/games
 * Get all available games
 * Access: Student only (protected)
 */
router.get(
  '/',
  verifyToken,
  authorizeRoles('student'),
  getAvailableGames
);

/**
 * GET /api/games/stats/progress
 * Get student's game statistics
 * Access: Student only (protected)
 * Route order matters: specific routes before :id routes
 */
router.get(
  '/stats/progress',
  verifyToken,
  authorizeRoles('student'),
  getStudentGameStats
);

/**
 * GET /api/games/attempts/history
 * Get student's attempt history
 * Access: Student only (protected)
 */
router.get(
  '/attempts/history',
  verifyToken,
  authorizeRoles('student'),
  getStudentAttempts
);

/**
 * GET /api/games/:id
 * Get single game details
 * Access: Student only (protected)
 */
router.get(
  '/:id',
  verifyToken,
  authorizeRoles('student'),
  getGameById
);

/**
 * POST /api/games/submit
 * Submit game attempt and calculate score
 * Body: { gameId, answers: [0, 2, 1, ...] }
 * Access: Student only (protected)
 */
router.post(
  '/submit',
  verifyToken,
  authorizeRoles('student'),
  submitGameAttempt
);

module.exports = router;
