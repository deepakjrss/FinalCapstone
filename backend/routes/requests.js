const express = require('express');
const { verifyToken } = require('../middleware/auth');
const { getPendingRequests, approveRequest, rejectRequest } = require('../controllers/requestController');

const router = express.Router();

// GET /api/requests/pending - Get pending requests for approval
router.get('/pending', verifyToken, getPendingRequests);

// PUT /api/requests/approve/:id - Approve a request
router.put('/approve/:id', verifyToken, approveRequest);

// PUT /api/requests/reject/:id - Reject a request
router.put('/reject/:id', verifyToken, rejectRequest);

module.exports = router;