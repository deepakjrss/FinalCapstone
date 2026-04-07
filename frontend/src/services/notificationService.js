/**
 * Notification Service
 * Handles all notification-related API calls
 */

import api from '../utils/api';
import { simpleCache, CACHE_KEYS } from '../utils/cache';

const notificationService = {
  /**
   * Get all notifications with pagination
   */
  getNotifications: async (page = 1, limit = 20) => {
    try {
      const cacheKey = `notifications_page_${page}_limit_${limit}`;
      const cached = simpleCache.get(cacheKey);
      if (cached) {
        return cached;
      }

      const response = await api.get(`/notifications?page=${page}&limit=${limit}`);
      simpleCache.set(cacheKey, response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching notifications:', error);
      throw error;
    }
  },

  /**
   * Get unread notifications only
   */
  getUnreadNotifications: async () => {
    try {
      const cached = simpleCache.get(CACHE_KEYS.NOTIFICATIONS);
      if (cached) {
        return cached;
      }

      const response = await api.get('/notifications/unread');
      simpleCache.set(CACHE_KEYS.NOTIFICATIONS, response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching unread notifications:', error);
      throw error;
    }
  },

  /**
   * Get notification statistics
   */
  getNotificationStats: async () => {
    try {
      const cached = simpleCache.get(CACHE_KEYS.NOTIFICATIONS_STATS);
      if (cached) {
        return cached;
      }

      const response = await api.get('/notifications/stats');
      simpleCache.set(CACHE_KEYS.NOTIFICATIONS_STATS, response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching notification stats:', error);
      throw error;
    }
  },

  /**
   * Mark a single notification as read
   */
  markAsRead: async (notificationId) => {
    try {
      const response = await api.put(`/notifications/${notificationId}/read`);
      // Invalidate notification caches
      simpleCache.invalidatePattern('notifications_');
      simpleCache.invalidate(CACHE_KEYS.NOTIFICATIONS);
      simpleCache.invalidate(CACHE_KEYS.NOTIFICATIONS_STATS);
      return response.data;
    } catch (error) {
      console.error('Error marking notification as read:', error);
      throw error;
    }
  },

  /**
   * Mark all notifications as read
   */
  markAllAsRead: async () => {
    try {
      const response = await api.put('/notifications/read');
      // Invalidate notification caches
      simpleCache.invalidatePattern('notifications_');
      simpleCache.invalidate(CACHE_KEYS.NOTIFICATIONS);
      simpleCache.invalidate(CACHE_KEYS.NOTIFICATIONS_STATS);
      return response.data;
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      throw error;
    }
  },

  /**
   * Delete a single notification
   */
  deleteNotification: async (notificationId) => {
    try {
      const response = await api.delete(`/notifications/${notificationId}`);
      // Invalidate notification caches
      simpleCache.invalidatePattern('notifications_');
      simpleCache.invalidate(CACHE_KEYS.NOTIFICATIONS);
      simpleCache.invalidate(CACHE_KEYS.NOTIFICATIONS_STATS);
      return response.data;
    } catch (error) {
      console.error('Error deleting notification:', error);
      throw error;
    }
  },

  /**
   * Delete all notifications
   */
  deleteAllNotifications: async () => {
    try {
      const response = await api.delete('/notifications');
      // Invalidate notification caches
      simpleCache.invalidatePattern('notifications_');
      simpleCache.invalidate(CACHE_KEYS.NOTIFICATIONS);
      simpleCache.invalidate(CACHE_KEYS.NOTIFICATIONS_STATS);
      return response.data;
    } catch (error) {
      console.error('Error deleting all notifications:', error);
      throw error;
    }
  }
};

export default notificationService;
