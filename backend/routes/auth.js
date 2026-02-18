const express = require('express');
const { body } = require('express-validator');
const authController = require('../controllers/authController');
const { verifyToken, authorizeRoles } = require('../middleware/auth');

const router = express.Router();

// Register route with validation
router.post(
  '/register',
  [
    body('name')
      .trim()
      .notEmpty()
      .withMessage('Name is required')
      .isLength({ min: 2 })
      .withMessage('Name must be at least 2 characters'),
    body('email')
      .isEmail()
      .withMessage('Invalid email format')
      .normalizeEmail(),
    body('password')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters'),
    body('role')
      .isIn(['student', 'teacher', 'admin'])
      .withMessage('Invalid role'),
    body('className')
      .custom((value, { req }) => {
        if (req.body.role === 'student' && !value) {
          throw new Error('className is required for students');
        }
        return true;
      })
  ],
  authController.register
);

// Login route with validation
router.post(
  '/login',
  [
    body('email')
      .isEmail()
      .withMessage('Invalid email format')
      .normalizeEmail(),
    body('password')
      .notEmpty()
      .withMessage('Password is required')
  ],
  authController.login
);

// Protected routes
router.get(
  '/me',
  verifyToken,
  authController.getCurrentUser
);

router.post(
  '/logout',
  verifyToken,
  authController.logout
);

module.exports = router;
