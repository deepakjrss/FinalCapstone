const express = require('express');
const router = express.Router();
const { verifyToken, authorizeRoles } = require('../middleware/auth');
const { deleteUser, getDeletedUsers, restoreUser, getTeachers, addPoints } = require('../controllers/userController');
const { body } = require('express-validator');
const ActivityLog = require('../models/ActivityLog');
const User = require('../models/User');
const { logActivity } = require('../services/activityService');
const nodemailer = require('nodemailer');

// DELETE /api/users/:id
// Delete a student (teacher/admin only)
router.delete(
  '/:id',
  verifyToken,
  authorizeRoles('teacher', 'admin'),
  [
    body('reason')
      .trim()
      .notEmpty()
      .withMessage('Deletion reason is required')
      .isLength({ max: 500 })
      .withMessage('Reason cannot exceed 500 characters')
  ],
  deleteUser
);

// GET /api/users/deleted
// Get all deleted users (teacher/admin only)
router.get(
  '/deleted',
  verifyToken,
  authorizeRoles('teacher', 'admin'),
  getDeletedUsers
);

// GET /api/users/teachers
// Get all teachers (admin only)
router.get(
  '/teachers',
  verifyToken,
  authorizeRoles('admin'),
  getTeachers
);

// POST /api/users/add-points
// Add ecoPoints for a student
router.post(
  '/add-points',
  verifyToken,
  authorizeRoles('student'),
  addPoints
);

// POST /api/users/restore/:id
// Restore a deleted user (teacher/admin only)
router.post(
  '/restore/:id',
  verifyToken,
  authorizeRoles('teacher', 'admin'),
  restoreUser
);

// GET /api/users/logs
// Get activity logs (admin only)
router.get(
  '/logs',
  verifyToken,
  authorizeRoles('admin'),
  async (req, res) => {
    try {
      const logs = await ActivityLog.find()
        .populate('user', 'name role')
        .sort({ createdAt: -1 })
        .limit(100); // Limit to last 100 logs

      res.json(logs);
    } catch (error) {
      console.error('Error fetching activity logs:', error);
      res.status(500).json({
        success: false,
        message: 'Error fetching activity logs'
      });
    }
  }
);

// GET /api/users/pending-teachers
// Get all pending teachers (admin only)
router.get(
  '/pending-teachers',
  verifyToken,
  authorizeRoles('admin'),
  async (req, res) => {
    try {
      const pendingTeachers = await User.find({
        role: 'teacher',
        status: 'pending',
        isDeleted: false
      }).select('name email createdAt');

      res.json(pendingTeachers);
    } catch (error) {
      console.error('Error fetching pending teachers:', error);
      res.status(500).json({
        success: false,
        message: 'Error fetching pending teachers'
      });
    }
  }
);

// PUT /api/users/approve/:id
// Approve a pending teacher (admin only)
router.put(
  '/approve/:id',
  verifyToken,
  authorizeRoles('admin'),
  async (req, res) => {
    try {
      const teacher = await User.findById(req.params.id);

      if (!teacher) {
        return res.status(404).json({
          success: false,
          message: 'Teacher not found'
        });
      }

      if (teacher.role !== 'teacher' || teacher.status !== 'pending') {
        return res.status(400).json({
          success: false,
          message: 'Invalid teacher or already approved'
        });
      }

      teacher.status = 'approved';
      await teacher.save();

      // Send approval email
      try {
        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
          },
        });

        await transporter.sendMail({
          from: process.env.EMAIL_USER,
          to: teacher.email,
          subject: 'Account Approved',
          html: `
            <div style="font-family: Arial, sans-serif; padding: 20px;">
              <h2 style="color: #059669;">Account Approved!</h2>
              <p>Dear ${teacher.name},</p>
              <p>Your account has been approved. You can now login using OTP verification.</p>
              <p>Please visit the login page and enter your email to receive an OTP.</p>
              <p style="color: #999; font-size: 12px;">If you didn't request this, please ignore this email.</p>
            </div>
          `
        });
      } catch (emailError) {
        console.error('Error sending approval email:', emailError);
        // Don't fail the approval if email fails
      }

      // Log activity
      await logActivity(req.user, "Approved teacher", teacher.name);

      res.json({
        success: true,
        message: 'Teacher approved successfully'
      });
    } catch (error) {
      console.error('Error approving teacher:', error);
      res.status(500).json({
        success: false,
        message: 'Error approving teacher'
      });
    }
  }
);

module.exports = router;