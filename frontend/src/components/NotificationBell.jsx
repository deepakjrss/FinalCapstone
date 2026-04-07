/**
 * Notification Bell Component
 * Shows unread notification count and dropdown with recent notifications
 */

import React, { useState, useEffect, useRef } from 'react';
import { useNotifications } from '../context/NotificationContext';

const NotificationBell = () => {
  const { notifications, unreadCount, loading, markAsRead, markAllAsRead } = useNotifications();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    if (showDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showDropdown]);

  // Handle mark as read
  const handleMarkAsRead = (notificationId, e) => {
    e.stopPropagation();
    markAsRead(notificationId);
  };

  // Handle mark all as read
  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead();
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  // Format time
  const formatTime = (date) => {
    const now = new Date();
    const notifDate = new Date(date);
    const diffSeconds = Math.floor((now - notifDate) / 1000);

    if (diffSeconds < 60) return 'just now';
    if (diffSeconds < 3600) return `${Math.floor(diffSeconds / 60)}m ago`;
    if (diffSeconds < 86400) return `${Math.floor(diffSeconds / 3600)}h ago`;
    if (diffSeconds < 604800) return `${Math.floor(diffSeconds / 86400)}d ago`;

    return notifDate.toLocaleDateString();
  };

  // Get icon based on notification type
  const getTypeIcon = (item) => {
    if (item.type === 'announcement') return '📢';
    
    const icons = {
      info: 'ℹ️',
      success: '✅',
      warning: '⚠️'
    };
    return icons[item.type] || '📢';
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Button */}
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="relative p-2 text-gray-700 hover:text-green-600 hover:bg-gray-100 rounded-lg transition-all duration-200 group"
        title="Notifications"
      >
        {/* Bell Icon */}
        <svg
          className="w-6 h-6 transition-transform group-hover:scale-110"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
          />
        </svg>

        {/* Unread Badge */}
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-500 rounded-full animate-pulse">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Menu */}
      {showDropdown && (
        <div className="absolute right-0 mt-2 w-96 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden z-50 animate-slide-in-right">
          {/* Header */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 px-6 py-4 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-900">Notifications</h3>
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllAsRead}
                  className="text-sm text-green-600 hover:text-green-700 font-medium transition-colors"
                >
                  Mark all as read
                </button>
              )}
            </div>
          </div>

          {/* Notifications List */}
          <div className="max-h-96 overflow-y-auto">
            {notifications.length > 0 ? (
              notifications.slice(0, 10).map(notification => (
                <NotificationItem
                  key={notification._id}
                  item={notification}
                  onMarkAsRead={handleMarkAsRead}
                  getTypeIcon={getTypeIcon}
                  formatTime={formatTime}
                />
              ))
            ) : (
              // Empty State
              <div className="px-6 py-12 text-center">
                <div className="text-4xl mb-3">🔔</div>
                <p className="text-gray-500 font-medium">No new notifications</p>
                <p className="text-xs text-gray-400 mt-1">Your notifications will appear here</p>
              </div>
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="border-t border-gray-100 px-6 py-3 bg-gray-50 text-center">
              <button className="text-sm text-green-600 hover:text-green-700 font-medium transition-colors">
                View all notifications →
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// Individual Notification Item Component
const NotificationItem = ({ item, onMarkAsRead, getTypeIcon, formatTime }) => {
  const getTypeColor = (type) => {
    if (type === 'announcement') return 'bg-green-100 text-green-700';
    const colors = {
      info: 'bg-blue-100 text-blue-700',
      success: 'bg-green-100 text-green-700',
      warning: 'bg-yellow-100 text-yellow-700'
    };
    return colors[type] || 'bg-gray-100 text-gray-700';
  };

  // Handle both announcements and notifications
  const displayTitle = item.title || 'Announcement';
  const displayMessage = item.title ? item.message : item.message; // announcements have title+message, notifications just have message
  const displaySender = item.sender?.name || item.senderName || 'System';

  return (
    <div className="px-6 py-3 border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer group">
      <div className="flex gap-3">
        {/* Icon */}
        <div className={`${getTypeColor(item.type)} w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold`}>
          {getTypeIcon(item)}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {item.type === 'announcement' && (
            <p className="text-xs text-gray-500 font-semibold">
              📣 From: {displaySender}
            </p>
          )}
          <p className="text-sm font-medium text-gray-900 line-clamp-2">
            {displayTitle}
          </p>
          {item.type === 'announcement' && (
            <p className="text-xs text-gray-600 mt-1 line-clamp-2">
              {displayMessage}
            </p>
          )}
          <p className="text-xs text-gray-500 mt-1">
            {formatTime(item.createdAt)}
          </p>
        </div>

        {/* Mark as Read Button */}
        <button
          onClick={(e) => onMarkAsRead(item._id, e)}
          className="flex-shrink-0 ml-2 opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 hover:text-red-600 p-1"
          title="Dismiss"
        >
          ✕
        </button>
      </div>
    </div>
  );
};

export default NotificationBell;
