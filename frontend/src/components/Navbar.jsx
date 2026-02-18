import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    navigate('/');
  };

  const handleNavClick = (path) => {
    navigate(path);
    setMobileMenuOpen(false);
  };

  // Nav links for authenticated users
  const authNavLinks = [
    { label: 'Dashboard', path: '/student-dashboard', icon: '📊' },
    { label: 'Games', path: '/games', icon: '🎮' },
    { label: 'Leaderboard', path: '/leaderboard', icon: '🏆' },
    { label: 'Achievements', path: '/achievements', icon: '🏅' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <>
      {/* Main Navbar */}
      <nav className="fixed w-full top-0 z-50 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 h-16 flex justify-between items-center">
          {/* Left: Logo */}
          <div
            className="flex items-center gap-2 cursor-pointer group transition-all duration-300"
            onClick={() => navigate('/')}
          >
            <span className="text-2xl">🌿</span>
            <span className="text-2xl font-bold">
              <span className="text-green-600">Eco</span>
              <span className="text-gray-900">Verse</span>
            </span>
          </div>

          {/* Center: Navigation Links (Desktop only) */}
          {user && (
            <div className="hidden md:flex items-center gap-8">
              {authNavLinks.map((link) => (
                <button
                  key={link.path}
                  onClick={() => handleNavClick(link.path)}
                  className={`flex items-center gap-2 font-medium transition-all duration-300 pb-1 border-b-2 ${
                    isActive(link.path)
                      ? 'text-green-600 border-b-green-600'
                      : 'text-gray-700 border-b-transparent hover:text-green-600'
                  }`}
                >
                  <span>{link.icon}</span>
                  <span>{link.label}</span>
                </button>
              ))}
            </div>
          )}

          {/* Right: Auth Section */}
          <div className="flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-4">
                {/* Avatar Dropdown */}
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 text-white font-bold hover:shadow-lg transition-all duration-300 transform hover:scale-110"
                    title={user.name}
                  >
                    {user.name.charAt(0).toUpperCase()}
                  </button>

                  {/* Dropdown Menu */}
                  {dropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-100 py-2 animate-in fade-in zoom-in-95 origin-top-right">
                      {/* User Info */}
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="text-sm font-bold text-gray-900">{user.name}</p>
                        <p className="text-xs text-gray-500 mt-1 capitalize">{user.role}</p>
                      </div>

                      {/* Menu Items */}
                      <button
                        onClick={() => {
                          navigate('/student-dashboard');
                          setDropdownOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200 flex items-center gap-2"
                      >
                        <span>👤</span>
                        <span>Profile</span>
                      </button>

                      <button
                        onClick={() => {
                          navigate('/student-dashboard');
                          setDropdownOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200 flex items-center gap-2"
                      >
                        <span>⚙️</span>
                        <span>Settings</span>
                      </button>

                      {/* Divider */}
                      <div className="border-t border-gray-100 my-1" />

                      {/* Logout */}
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors duration-200 flex items-center gap-2 font-medium"
                      >
                        <span>🚪</span>
                        <span>Logout</span>
                      </button>
                    </div>
                  )}
                </div>

                {/* Mobile Menu Button */}
                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="md:hidden p-2 text-gray-700 hover:text-green-600 transition-colors"
                >
                  <svg
                    className={`w-6 h-6 transition-transform duration-300 ${
                      mobileMenuOpen ? 'rotate-90' : ''
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    {mobileMenuOpen ? (
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    ) : (
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 6h16M4 12h16M4 18h16"
                      />
                    )}
                  </svg>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <button
                  onClick={() => navigate('/login')}
                  className="hidden sm:flex px-5 py-2 border-2 border-green-600 text-green-600 rounded-lg hover:bg-green-50 transition-all duration-300 font-semibold text-sm"
                >
                  Login
                </button>
                <button
                  onClick={() => navigate('/register')}
                  className="px-5 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-300 font-semibold text-sm transform hover:scale-105"
                >
                  Register
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Mobile Navigation Menu */}
      {user && mobileMenuOpen && (
        <div className="fixed top-16 left-0 right-0 md:hidden bg-white border-b border-gray-100 shadow-lg z-40 animate-in slide-in-from-top-2">
          <div className="px-6 py-4 space-y-2">
            {authNavLinks.map((link) => (
              <button
                key={link.path}
                onClick={() => handleNavClick(link.path)}
                className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-300 flex items-center gap-3 font-medium ${
                  isActive(link.path)
                    ? 'bg-green-50 text-green-600'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <span>{link.icon}</span>
                <span>{link.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Spacer to account for fixed navbar */}
      <div className="h-16" />
    </>
  );
}

