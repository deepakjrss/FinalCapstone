/**
 * Modern SaaS Sidebar for EcoVerse
 * Professional, clean navigation sidebar with modern design
 */

import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ModernSidebar = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname.includes(path);

  const getNavItems = () => {
    if (user?.role === 'student') {
      return [
        { icon: '📊', label: 'Dashboard', path: '/student-dashboard' },
        { icon: '🎮', label: 'Games', path: '/games' },
        { icon: '🌲', label: 'Forest', path: '/forest' },
        { icon: '🤖', label: 'Forest Guardian AI', path: '/ai-chat' },
        { icon: '🏆', label: 'Leaderboard', path: '/leaderboard' },
        { icon: '🏅', label: 'Achievements', path: '/achievements' },
      ];
    } else if (user?.role === 'teacher') {
      return [
        { icon: '📊', label: 'Dashboard', path: '/teacher-dashboard' },
        { icon: '👥', label: 'Classes', path: '/teacher-classes' },
        { icon: '📈', label: 'Analytics', path: '/teacher-analytics' },
        { icon: '🤖', label: 'Forest Guardian AI', path: '/ai-chat' },
        { icon: '🏆', label: 'Leaderboard', path: '/leaderboard' },
      ];
    } else if (user?.role === 'admin') {
      return [
        { icon: '📊', label: 'Dashboard', path: '/admin-dashboard' },
        { icon: '👥', label: 'Users', path: '/admin-users' },
        { icon: '🎮', label: 'Games', path: '/admin-games' },
        { icon: '🤖', label: 'Forest Guardian AI', path: '/ai-chat' },
        { icon: '⚙️', label: 'Settings', path: '/admin-settings' },
      ];
    }
    return [];
  };

  return (
    <aside className="fixed left-0 top-0 w-64 h-screen bg-gray-900 text-white overflow-y-auto z-50 pt-20 shadow-xl">
      {/* Navigation Items */}
      <nav className="px-4 py-8 space-y-2">
        {getNavItems().map((item) => (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            className={`
              w-full flex items-center gap-4 px-4 py-3 rounded-lg transition-all duration-300 text-left
              ${
                isActive(item.path)
                  ? 'bg-green-600 text-white shadow-lg'
                  : 'text-gray-300 hover:text-white hover:bg-gray-800'
              }
            `.trim()}
          >
            <span className="text-xl">{item.icon}</span>
            <span className="font-medium">{item.label}</span>
            {isActive(item.path) && (
              <span className="ml-auto w-2 h-2 bg-white rounded-full animate-pulse" />
            )}
          </button>
        ))}
      </nav>

      {/* Divider */}
      <div className="border-t border-gray-700 mx-4 my-6" />

      {/* Quick Info */}
      <div className="px-4 py-4 space-y-3">
        <div className="text-sm">
          <p className="text-gray-400 text-xs uppercase font-semibold tracking-wide">
            Eco Points
          </p>
          <p className="text-2xl font-bold text-green-400 mt-1">{user?.ecoPoints || 0}</p>
        </div>

        {user?.role === 'student' && user?.className && (
          <div className="text-sm">
            <p className="text-gray-400 text-xs uppercase font-semibold tracking-wide">
              Your Class
            </p>
            <p className="text-lg font-bold text-gray-100 mt-1">{user.className}</p>
          </div>
        )}
      </div>
    </aside>
  );
};

export default ModernSidebar;
