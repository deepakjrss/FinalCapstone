const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const { verifyToken, authorizeRoles } = require('../middleware/auth');
const { submitFeedback, getTeacherFeedback, getAllFeedback } = require('../controllers/feedbackController');

// POST /api/feedback
// Submit feedback (students only)
router.post(
  '/',
  verifyToken,
  authorizeRoles('student'),
  [
    body('teacherId')
      .isMongoId()
      .withMessage('Invalid teacher ID'),
    body('rating')
      .isInt({ min: 1, max: 5 })
      .withMessage('Rating must be between 1 and 5'),
    body('comment')
      .optional()
      .trim()
      .isLength({ max: 500 })
      .withMessage('Comment must be less than 500 characters')
  ],
  submitFeedback
);

// GET /api/feedback/teacher
// Get feedback for current teacher
router.get(
  '/teacher',
  verifyToken,
  authorizeRoles('teacher'),
  getTeacherFeedback
);

// GET /api/feedback/admin
// Get all feedback (admin only)
router.get(
  '/admin',
  verifyToken,
  authorizeRoles('admin'),
  getAllFeedback
);

module.exports = router;