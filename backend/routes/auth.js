const express = require('express');
const { body } = require('express-validator');
const authController = require('../controllers/authController');
const { verifyToken, authorizeRoles } = require('../middleware/auth');

const router = express.Router();

// Send registration OTP route
router.post(
  '/send-register-otp',
  [
    body('email')
      .isEmail()
      .withMessage('Invalid email format')
      .normalizeEmail()
  ],
  authController.sendRegisterOTP
);

// Verify registration OTP route
router.post(
  '/verify-register-otp',
  [
    body('email')
      .isEmail()
      .withMessage('Invalid email format')
      .normalizeEmail(),
    body('otp')
      .trim()
      .notEmpty()
      .withMessage('OTP is required')
      .isLength({ min: 6, max: 6 })
      .withMessage('OTP must be 6 digits')
  ],
  authController.verifyRegisterOTP
);

// Send OTP route
router.post(
  '/send-otp',
  [
    body('email')
      .isEmail()
      .withMessage('Invalid email format')
      .normalizeEmail()
  ],
  authController.sendOTP
);

// Verify OTP route
router.post(
  '/verify-otp',
  [
    body('email')
      .isEmail()
      .withMessage('Invalid email format')
      .normalizeEmail(),
    body('otp')
      .trim()
      .notEmpty()
      .withMessage('OTP is required')
      .isLength({ min: 6, max: 6 })
      .withMessage('OTP must be 6 digits')
  ],
  authController.verifyOTP
);

// Resend OTP route
router.post(
  '/resend-otp',
  [
    body('email')
      .isEmail()
      .withMessage('Invalid email format')
      .normalizeEmail()
  ],
  authController.resendOTP
);

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
      .isIn(['student', 'teacher'])
      .withMessage('Invalid role'),
    body('schoolId')
      .notEmpty()
      .withMessage('School is required'),
    body('inviteCode')
      .trim()
      .notEmpty()
      .withMessage('Invite code is required'),
    body('classId')
      .custom((value, { req }) => {
        if (req.body.role === 'student' && !value) {
          throw new Error('Class is required for students');
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

// Verify password and send login OTP
router.post(
  '/login-otp',
  [
    body('email')
      .isEmail()
      .withMessage('Invalid email format')
      .normalizeEmail(),
    body('password')
      .notEmpty()
      .withMessage('Password is required')
  ],
  authController.verifyPasswordAndSendOTP
);

// Verify login OTP and return JWT
router.post(
  '/verify-login-otp',
  [
    body('email')
      .isEmail()
      .withMessage('Invalid email format')
      .normalizeEmail(),
    body('otp')
      .trim()
      .notEmpty()
      .withMessage('OTP is required')
      .isLength({ min: 6, max: 6 })
      .withMessage('OTP must be 6 digits')
  ],
  authController.verifyLoginOTP
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
