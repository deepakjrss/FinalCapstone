const express = require('express');
const router = express.Router();
const { verifyToken, authorizeRoles } = require('../middleware/auth');
const { downloadCertificate } = require('../controllers/certificateController');

router.get('/download', verifyToken, authorizeRoles('student'), downloadCertificate);

module.exports = router;
