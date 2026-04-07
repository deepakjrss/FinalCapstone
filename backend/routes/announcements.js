const express = require('express');
const router = express.Router();
const { verifyToken, authorizeRoles } = require('../middleware/auth');
const {
  createAnnouncement,
  getAnnouncements
} = require('../controllers/announcementController');

router.post('/', verifyToken, authorizeRoles('teacher', 'admin'), (req, res, next) => {
  console.log('DEBUG /api/announcements POST req.user:', req.user);
  console.log('DEBUG /api/announcements POST body:', req.body);
  next();
}, createAnnouncement);
router.get('/', verifyToken, getAnnouncements);

module.exports = router;
