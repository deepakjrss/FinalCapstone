const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const { verifyToken } = require('../middleware/auth');
const { chatWithGuardian } = require('../controllers/chatController');

/**
 * POST /api/chat
 * Protected: must be authenticated
 */
router.get('/health', async (req, res) => {
  try {
    const { chatHealth } = require('../controllers/chatController');
    await chatHealth(req, res);
  } catch (error) {
    console.error('Health check handler error:', error);
    res.status(500).json({ success: false, message: 'Health check failed', error: error.message });
  }
});

router.post(
  '/',
  verifyToken,
  [
    body('message')
      .trim()
      .notEmpty()
      .withMessage('Message is required')
      .isLength({ min: 1, max: 1000 })
      .withMessage('Message must be between 1 and 1000 characters')
      .escape() // Prevent XSS
  ],
  chatWithGuardian
);

module.exports = router;
