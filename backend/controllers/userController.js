const User = require('../models/User');
const EcoLog = require('../models/EcoLog');
const { validationResult } = require('express-validator');
const { createNotification } = require('../services/notificationService');
const { logActivity } = require('../services/activityService');
const { checkAndAwardBadges } = require('./badgeController');

// DELETE /api/users/:id
// Delete a student with audit logging
const deleteUser = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { id } = req.params;
    const { reason } = req.body;
    const deletedBy = req.user._id;
    const deletedByRole = req.user.role;

    // Find the user to delete
    const user = await User.findById(id).select('+password');
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Only allow deletion of students
    if (user.role !== 'student') {
      return res.status(403).json({
        success: false,
        message: 'Only students can be deleted'
      });
    }

    // Check if user is in the same school
    if (user.school.toString() !== req.user.school.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied: User not in your school'
      });
    }

    // Soft delete the user
    await User.findByIdAndUpdate(id, {
      isDeleted: true,
      deletedAt: new Date(),
    });

    // Log activity
    await logActivity(req.user, "Deleted student", user.name);

    // Notify admins about student deletion
    const admins = await User.find({ role: 'admin', isDeleted: false, school: user.school }).select('_id');
    const io = req.app.get('io');
    for (const admin of admins) {
      await createNotification(
        admin._id,
        `Student "${user.name}" has been deleted.`,
        "warning",
        io,
        user.school
      );
    }

    // Invalidate user-related caches
    cacheUtils.invalidateUsers();

    return res.status(200).json({
      success: true,
      message: 'Student moved to deleted list'
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/users/deleted
// Get all deleted users
const getDeletedUsers = async (req, res, next) => {
  try {
    const deletedUsers = await User.find({ isDeleted: true, school: req.user.school })
      .select('name email className role deletedAt')
      .sort({ deletedAt: -1 });

    return res.status(200).json(deletedUsers);
  } catch (error) {
    next(error);
  }
};

// GET /api/users/teachers
// Get all teachers (admin)
const getTeachers = async (req, res, next) => {
  try {
    const teachers = await User.find({ role: 'teacher', isDeleted: false, school: req.user.school }).select('name email _id');
    return res.status(200).json(teachers);
  } catch (error) {
    next(error);
  }
};

// POST /api/users/add-points
// Add ecoPoints to current student
const addPoints = async (req, res, next) => {
  try {
    const { points } = req.body;

    if (typeof points !== 'number' || points <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Points must be a positive number'
      });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    user.ecoPoints = (user.ecoPoints || 0) + points;
    await user.save();

    // Check and award badges after ecoPoints update
    const newlyEarnedBadges = await checkAndAwardBadges(user._id);

    await EcoLog.create({
      user: user._id,
      school: user.school,
      className: user.className || null,
      points,
      type: 'game',
      description: 'Manual eco points adjustment',
      date: new Date()
    });

    await logActivity(req.user, `Added ${points} eco-points`, 'WasteSegregation game');

    return res.status(200).json({
      success: true,
      ecoPoints: user.ecoPoints,
      message: `${points} eco-points added successfully`
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/users/restore/:id
// Restore a previously deleted student user (teacher/admin only)
const restoreUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);
    if (!user || !user.isDeleted) {
      return res.status(404).json({
        success: false,
        message: 'Deleted user not found'
      });
    }

    // Ensure no active user with same email exists
    const existingUser = await User.findOne({ email: user.email, isDeleted: false });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'A user with this email already exists'
      });
    }

    // Restore the user
    await User.findByIdAndUpdate(id, {
      isDeleted: false,
      deletedAt: null,
    });

    // Log activity
    await logActivity(req.user, "Restored student", user.name);

    // Invalidate user-related caches
    cacheUtils.invalidateUsers();

    return res.status(200).json({
      success: true,
      message: 'User restored successfully'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  deleteUser,
  getDeletedUsers,
  restoreUser,
  getTeachers,
  addPoints
};