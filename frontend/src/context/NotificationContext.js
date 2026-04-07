import React, { createContext, useState, useEffect, useContext } from 'react';
import { useAuth } from './AuthContext';
import socket from '../socket';
import notificationService from '../services/notificationService';
import announcementService from '../services/announcementService';

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user, isAuthenticated } = useAuth();

  // Fetch announcements from API
  const fetchAnnouncements = async () => {
    if (!isAuthenticated || !user) return;

    try {
      const response = await announcementService.getAnnouncements();
      if (response.success) {
        setAnnouncements(response.data || []);
      }
    } catch (error) {
      console.error('Error fetching announcements:', error);
    }
  };

  // Fetch notifications from API
  const fetchNotifications = async () => {
    if (!isAuthenticated || !user) return;

    try {
      setLoading(true);
      const response = await notificationService.getNotifications(1, 50); // Get more notifications for dropdown
      if (response.success) {
        setNotifications(response.data.notifications);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch both notifications and announcements
  const fetchAll = async () => {
    await fetchNotifications();
    await fetchAnnouncements();
  };

  useEffect(() => {
    if (isAuthenticated && user) {
      const userId = user._id || localStorage.getItem('userId');

      // Fetch existing notifications and announcements
      fetchAll();

      // Join socket room
      socket.emit('join', userId);

      // Listen for notifications
      socket.on('notification', (notification) => {
        setNotifications((prev) => [notification, ...prev]);
      });

      // Cleanup on unmount
      return () => {
        socket.off('notification');
      };
    }
  }, [isAuthenticated, user]);

  const markAsRead = async (notificationId) => {
    try {
      // Update local state immediately for better UX
      setNotifications((prev) =>
        prev.map((notif) =>
          notif._id === notificationId ? { ...notif, isRead: true } : notif
        )
      );

      // Call API to mark as read
      await notificationService.markAsRead(notificationId);
    } catch (error) {
      console.error('Error marking notification as read:', error);
      // Revert local state on error
      setNotifications((prev) =>
        prev.map((notif) =>
          notif._id === notificationId ? { ...notif, isRead: false } : notif
        )
      );
    }
  };

  const markAllAsRead = async () => {
    try {
      // Update local state immediately
      setNotifications((prev) =>
        prev.map((notif) => ({ ...notif, isRead: true }))
      );

      // Call API to mark all as read
      await notificationService.markAllAsRead();
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      // Revert on error - refetch from API
      fetchNotifications();
    }
  };

  const clearNotifications = () => {
    setNotifications([]);
    setAnnouncements([]);
  };

  // Combine notifications and announcements for the bell icon
  const allItems = [
    ...notifications.map(n => ({ ...n, type: 'notification' })),
    ...announcements.map(a => ({ ...a, type: 'announcement', isRead: true }))
  ].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const unreadCount = notifications.filter((n) => !n.isRead).length + announcements.length;


  return (
    <NotificationContext.Provider
      value={{
        notifications: allItems,
        unreadCount,
        loading,
        markAsRead,
        markAllAsRead,
        clearNotifications,
        fetchNotifications: fetchAll,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};