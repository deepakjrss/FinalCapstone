import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  const navItems = [
    {
      icon: '🏠',
      label: 'Dashboard',
      path: '/student-dashboard',
    },
    {
      icon: '🎮',
      label: 'Games',
      path: '/games',
    },
    {
      icon: '🏆',
      label: 'Leaderboard',
      path: '/leaderboard',
    },
    {
      icon: '🏅',
      label: 'Achievements',
      path: '/achievements',
    },
  ];

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-gradient-to-b from-emerald-600 to-teal-700 shadow-2xl overflow-y-auto">
      {/* Logo Section */}
      <div className="px-6 py-8 border-b border-emerald-500/30">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-4xl">🌍</span>
          <h1 className="text-3xl font-bold text-white">EcoVerse</h1>
        </div>
        <p className="text-emerald-100 text-sm">Grow Your Digital Forest</p>
      </div>

      {/* User Profile Section */}
      <div className="px-6 py-6 border-b border-emerald-500/30">
        <p className="text-emerald-100 text-xs font-semibold uppercase tracking-wider">Current User</p>
        <p className="text-white font-bold mt-2 truncate">{user?.name}</p>
        <div className="mt-2 inline-block bg-emerald-500/40 backdrop-blur-sm px-3 py-1 rounded-full">
          <p className="text-emerald-100 text-xs font-medium capitalize">{user?.role}</p>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="px-4 py-8 space-y-2">
        {navItems.map((item) => (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
              isActive(item.path)
                ? 'bg-white/20 backdrop-blur-md text-white shadow-lg'
                : 'text-emerald-100 hover:bg-white/10 hover:text-white'
            }`}
          >
            <span className="text-xl">{item.icon}</span>
            <span className="font-semibold">{item.label}</span>
            {isActive(item.path) && (
              <div className="ml-auto w-2 h-2 bg-white rounded-full animate-pulse"></div>
            )}
          </button>
        ))}
      </nav>

      {/* Spacer */}
      <div className="flex-1"></div>

      {/* Logout Section */}
      <div className="px-4 py-8 border-t border-emerald-500/30">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-red-500/20 hover:bg-red-500/40 text-red-100 hover:text-white transition-all duration-300 font-semibold"
        >
          <span className="text-xl">🚪</span>
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
