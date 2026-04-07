const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { verifyToken, authorizeRoles } = require('../middleware/auth');
const {
  getAnalyticsOverview,
  getTopStudents,
  getEngagement,
  getStudents,
  getGames,
  getTeachers,
  getDashboardCharts,
  getClasses,
  getClassPerformance,
  getEcoScoreTrend
} = require('../controllers/analyticsController');

// All analytics routes are protected and accessible to teacher and admin roles
router.get(
  '/overview',
  verifyToken,
  authorizeRoles('teacher', 'admin'),
  (req, res, next) => {
    console.log('DEBUG /api/analytics/overview req.user:', req.user);
    console.log('DEBUG /api/analytics/overview school:', req.user?.school);
    next();
  },
  getAnalyticsOverview
);

router.get(
  '/top-students',
  verifyToken,
  authorizeRoles('teacher', 'admin'),
  getTopStudents
);

router.get(
  '/engagement',
  verifyToken,
  authorizeRoles('teacher', 'admin'),
  getEngagement
);

router.get(
  '/students',
  verifyToken,
  authorizeRoles('teacher', 'admin'),
  getStudents
);

router.get(
  '/games',
  verifyToken,
  authorizeRoles('teacher', 'admin'),
  getGames
);

// GET /api/analytics/dashboard
// Get dashboard summary data (teacher and admin only)
router.get(
  '/dashboard',
  verifyToken,
  authorizeRoles('teacher', 'admin'),
  async (req, res) => {
    try {
      console.log('DEBUG /api/analytics/dashboard req.user:', req.user);
      console.log('DEBUG /api/analytics/dashboard school:', req.user?.school);

      const students = await User.find({
        role: 'student',
        school: req.user?.school,
        status: 'approved',
        isDeleted: false
      }, 'ecoPoints className');

      const totalStudents = students.length;
      const totalEcoPoints = students.reduce(
        (sum, s) => sum + (s.ecoPoints || 0),
        0
      );

      const avgEcoPoints =
        totalStudents > 0 ? totalEcoPoints / totalStudents : 0;

      res.json({
        totalStudents,
        avgEcoPoints,
        totalGamesPlayed: 0,
        classesTracked: [...new Set(students.map(s => s.className))].length
      });

    } catch (error) {
      console.error('ERROR /api/analytics/dashboard:', error);
      res.status(500).json({ message: 'Error loading dashboard' });
    }
  }
);

// GET /api/analytics/dashboard-charts
// Get data for dashboard charts (teacher and admin only)
router.get(
  '/dashboard-charts',
  verifyToken,
  authorizeRoles('teacher', 'admin'),
  async (req, res) => {
    try {
      console.log('DEBUG /api/analytics/dashboard-charts req.user:', req.user);
      console.log('DEBUG /api/analytics/dashboard-charts school:', req.user?.school);

      const users = await User.find({
        isDeleted: false,
        school: req.user?.school,
        status: 'approved'
      }, 'className ecoPoints role');
      console.log('🔥 Users:', users);

      const classData = {};

      users.forEach((u) => {
        const className = u.className || 'Unknown';

        if (!classData[className]) {
          classData[className] = 0;
        }

        classData[className] += u.ecoPoints || 0;
      });

      const result = Object.keys(classData).map((c) => ({
        name: c,
        score: classData[c],
      }));

      console.log('🔥 Result:', result);

      if (result.length === 0) {
        return res.json([]);
      }

      res.json(result);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error loading charts" });
    }
  }
);

// GET /api/analytics/classes
// Get list of classes (teacher and admin only)
router.get(
  '/classes',
  verifyToken,
  authorizeRoles('teacher', 'admin'),
  getClasses
);

// GET /api/analytics/teachers
// Get list of teachers (for feedback)
router.get(
  '/teachers',
  verifyToken,
  authorizeRoles('student'),
  getTeachers
);

// GET /api/analytics/class-performance
// Get class-wise average ecoPoints (teacher and admin only)
router.get(
  '/class-performance',
  verifyToken,
  authorizeRoles('teacher', 'admin'),
  getClassPerformance
);

router.get(
  '/eco-score-trend',
  verifyToken,
  authorizeRoles('teacher', 'admin'),
  getEcoScoreTrend
);

module.exports = router;
