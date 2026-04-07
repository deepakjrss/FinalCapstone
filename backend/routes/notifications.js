const express = require('express');
const router = express.Router();
const { verifyToken, authorizeRoles } = require('../middleware/auth');
const {
  getNotifications,
  getUnreadNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  deleteAllNotifications,
  getNotificationStats
} = require('../controllers/notificationController');

// All routes are protected - require authentication
router.use(verifyToken);

/**
 * GET /api/notifications/unread
 * Get only unread notifications (must come before /:id to avoid conflicts)
 * Access: All authenticated users
 */
router.get('/unread', getUnreadNotifications);

/**
 * GET /api/notifications/stats
 * Get notification statistics (must come before /:id to avoid conflicts)
 * Access: All authenticated users
 */
router.get('/stats', getNotificationStats);

/**
 * GET /api/notifications
 * Get all notifications with pagination
 * Query params: ?page=1&limit=20
 */
router.get('/', getNotifications);

/**
 * PUT /api/notifications/read
 * Mark all notifications as read (bulk operation)
 * NOTE: Must use POST or different approach for bulk operations to avoid route conflicts
 */
router.put('/read', markAllAsRead);

/**
 * PUT /api/notifications/:id/read
 * Mark single notification as read
 */
router.put('/:id/read', markAsRead);

/**
 * DELETE /api/notifications/:id
 * Delete single notification
 */
router.delete('/:id', deleteNotification);

/**
 * DELETE /api/notifications
 * Delete all notifications (bulk delete)
 */
router.delete('/', deleteAllNotifications);

module.exports = router;
