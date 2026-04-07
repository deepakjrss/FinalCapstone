const express = require('express');
const { verifyToken, verifySuperAdmin } = require('../middleware/auth');
const {
  getAllSchools,
  createSchool,
  getAllUsers,
  getGlobalAnalytics
} = require('../controllers/superadminController');

const router = express.Router();

// All superadmin routes require authentication and superadmin privileges
router.use(verifyToken);
router.use(verifySuperAdmin);

// GET /api/superadmin/schools - Get all schools with stats
router.get('/schools', getAllSchools);

// POST /api/superadmin/schools - Create new school
router.post('/schools', createSchool);

// GET /api/superadmin/users - Get all users globally
router.get('/users', getAllUsers);

// GET /api/superadmin/analytics - Global system analytics
router.get('/analytics', getGlobalAnalytics);

module.exports = router;