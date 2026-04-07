const Notification = require('../models/Notification');
const User = require('../models/User');
const mongoose = require('mongoose');
const { createNotification } = require('../services/notificationService');

/**
 * GET /api/notifications
 * Get all notifications for logged-in user
 * Pagination support: ?page=1&limit=20
 * Access: Logged-in users
 */
exports.getNotifications = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    // Get total count for pagination
    const total = await Notification.countDocuments({ user: userId, school: req.user.school });

    // Get notifications sorted by newest first
    const notifications = await Notification.find({ user: userId, school: req.user.school })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('relatedId');

    // Get unread count
    const unreadCount = await Notification.countDocuments({
      user: userId,
      isRead: false,
      school: req.user.school
    });

    return res.status(200).json({
      success: true,
      data: {
        notifications,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          totalNotifications: total,
          unreadCount
        }
      },
      message: 'Notifications retrieved successfully'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/notifications/unread
 * Get only unread notifications
 * Access: Logged-in users
 */
exports.getUnreadNotifications = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const notifications = await Notification.find({
      user: userId,
      isRead: false
    })
      .sort({ createdAt: -1 })
      .populate('relatedId');

    return res.status(200).json({
      success: true,
      count: notifications.length,
      notifications,
      message: 'Unread notifications retrieved successfully'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/notifications/:id/read
 * Mark a single notification as read
 * Access: Logged-in users (own notifications only)
 */
exports.markAsRead = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const notification = await Notification.findById(id);

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found'
      });
    }

    // Verify ownership
    if (notification.user.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized to update this notification'
      });
    }

    await notification.markAsRead();

    return res.status(200).json({
      success: true,
      notification,
      message: 'Notification marked as read'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/notifications/read (bulk operation)
 * Mark all notifications as read
 * Access: Logged-in users
 */
exports.markAllAsRead = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const result = await Notification.updateMany(
      { user: userId, isRead: false },
      { $set: { isRead: true } }
    );

    return res.status(200).json({
      success: true,
      data: {
        modifiedCount: result.modifiedCount
      },
      message: `${result.modifiedCount} notifications marked as read`
    });
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/notifications/:id
 * Delete a single notification
 * Access: Logged-in users (own notifications only)
 */
exports.deleteNotification = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const notification = await Notification.findById(id);

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found'
      });
    }

    // Verify ownership
    if (notification.user.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized to delete this notification'
      });
    }

    await Notification.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: 'Notification deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/notifications (bulk delete)
 * Delete all notifications for logged-in user
 * Access: Logged-in users
 */
exports.deleteAllNotifications = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const result = await Notification.deleteMany({ user: userId });

    return res.status(200).json({
      success: true,
      data: {
        deletedCount: result.deletedCount
      },
      message: `${result.deletedCount} notifications deleted`
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/notifications/stats
 * Get notification statistics
 * Access: Logged-in users
 */
exports.getNotificationStats = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const [totalCount, unreadCount, byType] = await Promise.all([
      Notification.countDocuments({ user: userId }),
      Notification.countDocuments({ user: userId, isRead: false }),
      Notification.aggregate([
        { $match: { user: new mongoose.Types.ObjectId(userId) } },
        { $group: { _id: '$type', count: { $sum: 1 } } }
      ])
    ]);

    const typeStats = {
      task: 0,
      badge: 0,
      system: 0
    };

    byType.forEach(item => {
      typeStats[item._id] = item.count;
    });

    return res.status(200).json({
      success: true,
      data: {
        totalNotifications: totalCount,
        unreadNotifications: unreadCount,
        readNotifications: totalCount - unreadCount,
        byType: typeStats
      },
      message: 'Notification statistics retrieved successfully'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Internal function: Create notification for task approval/rejection
 * Called from taskController
 */
exports.createTaskNotification = async (userId, taskTitle, status, schoolId) => {
  try {
    const message = status === 'approved'
      ? `Your task submission "${taskTitle}" has been approved! ✓`
      : `Your task submission "${taskTitle}" was rejected. Please review the feedback.`;

    return await createNotification(
      userId,
      message,
      'task',
      null, // io not available here
      schoolId
    );
  } catch (error) {
    console.error('Error creating task notification:', error);
  }
};

/**
 * Internal function: Create notification for badge earned
 * Called from badgeController
 */
exports.createBadgeNotification = async (userId, badgeName, badgeId, schoolId) => {
  try {
    const message = `Congratulations! You've earned the "${badgeName}" badge! 🏆`;

    return await createNotification(
      userId,
      message,
      'badge',
      null, // io not available here
      schoolId
    );
  } catch (error) {
    console.error('Error creating badge notification:', error);
  }
};

/**
 * Internal function: Create notification for task submission (for teacher)
 * Called from taskController
 */
exports.createTaskSubmissionNotification = async (teacherId, studentName, taskTitle, schoolId) => {
  try {
    const message = `${studentName} has submitted a task: "${taskTitle}". Please review their submission.`;

    return await createNotification(
      teacherId,
      message,
      'task',
      null, // io not available here
      schoolId
    );
  } catch (error) {
    console.error('Error creating submission notification:', error);
  }
};;

/**
 * Internal function: Create system notification
 */
exports.createSystemNotification = async (userId, message) => {
  try {
    return await Notification.createNotification(
      userId,
      message,
      'system'
    );
  } catch (error) {
    console.error('Error creating system notification:', error);
  }
};
