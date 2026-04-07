/**
 * Modern SaaS TopNavbar for EcoVerse
 * Professional navigation bar with user info and quick actions
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useDarkMode } from '../context/DarkModeContext';
import NotificationBell from './NotificationBell';

const ModernTopNavbar = () => {
  const { user, logout } = useAuth();
  const { darkMode, toggleDarkMode } = useDarkMode();
  const navigate = useNavigate();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 shadow-sm z-40 backdrop-blur-sm bg-opacity-95 dark:bg-gray-800 dark:border-gray-700">
      <div className="flex items-center justify-between px-6 sm:px-8 py-4 max-w-full">
        {/* Left Side - Logo/Brand */}
        <div className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity" onClick={() => navigate('/student-dashboard')}>
          <div className="text-2xl">🌍</div>
          <div>
            <h1 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100">EcoVerse</h1>
            <p className="text-xs text-gray-500 hidden sm:block dark:text-gray-400">Digital Forest Platform</p>
          </div>
        </div>

        {/* Right Side - User Menu */}
        <div className="flex items-center gap-4 sm:gap-6">
          {/* Dark Mode Toggle */}
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 transition-all duration-300 hover:scale-105 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-300"
            title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {darkMode ? "☀️" : "🌙"}
          </button>

          {/* Notification Bell */}
          <NotificationBell />

          {/* User Info */}
          <div className="hidden sm:block text-right border-r border-gray-200 pr-6 dark:border-gray-600">
            <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{user?.name}</p>
            <p className="text-xs text-gray-500 capitalize dark:text-gray-400">{user?.role}</p>
          </div>

          {/* User Avatar/Menu */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 text-white font-bold hover:shadow-lg hover:from-green-600 hover:to-emerald-700 transition-all duration-200 active:scale-95"
              title={user?.name}
            >
              {user?.name?.charAt(0).toUpperCase()}
            </button>

            {/* Dropdown Menu */}
            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden z-50 animate-slide-in-right dark:bg-gray-800 dark:border-gray-700">
                <div className="px-4 py-3 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-green-50 dark:from-gray-700 dark:to-gray-600 dark:border-gray-600">
                  <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{user?.name}</p>
                  <p className="text-xs text-gray-500 capitalize dark:text-gray-400">{user?.role}</p>
                </div>

                <div className="py-2">
                  <button
                    onClick={() => {
                      navigate('/profile');
                      setShowUserMenu(false);
                    }}
                    className="w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-100 transition flex items-center gap-2 font-medium dark:text-gray-300 dark:hover:bg-gray-700"
                  >
                    👤 Profile
                  </button>
                  <button
                    onClick={() => {
                      navigate('/settings');
                      setShowUserMenu(false);
                    }}
                    className="w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-100 transition flex items-center gap-2 font-medium dark:text-gray-300 dark:hover:bg-gray-700"
                  >
                    ⚙️ Settings
                  </button>
                  <div className="border-t border-gray-100 mt-2 pt-2 dark:border-gray-600">
                    <button
                      onClick={handleLogout}
                      className="w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition flex items-center gap-2 font-medium dark:text-red-400 dark:hover:bg-red-900/20"
                    >
                      🚪 Logout
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default ModernTopNavbar;
