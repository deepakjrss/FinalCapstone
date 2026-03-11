const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/auth');
const { chatWithGuardian } = require('../controllers/chatController');

/**
 * POST /api/chat
 * Protected: must be authenticated
 */
router.post('/', verifyToken, chatWithGuardian);

module.exports = router;
