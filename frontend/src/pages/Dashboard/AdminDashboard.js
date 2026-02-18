import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
      {/* Header */}
      <header className="bg-gray-900 shadow-lg border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 py-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-white">EcoVerse</h1>
            <p className="text-gray-400">Admin Dashboard</p>
          </div>
          <button
            onClick={handleLogout}
            className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-12">
        {/* Welcome Section */}
        <div className="bg-gray-800 rounded-lg shadow-lg p-8 mb-8 border border-gray-700">
          <h2 className="text-2xl font-bold text-white mb-4">
            Welcome, {user?.name}! 🔐
          </h2>
          <p className="text-gray-300">
            You are logged in as an <span className="font-semibold text-red-400">Administrator</span>
          </p>
        </div>

        {/* User Information Card */}
        <div className="bg-gray-800 rounded-lg shadow-lg p-8 mb-8 border border-gray-700">
          <h3 className="text-xl font-bold text-white mb-6">Your Profile</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border-l-4 border-red-500 pl-4">
              <p className="text-gray-400 text-sm">Name</p>
              <p className="text-white font-semibold">{user?.name}</p>
            </div>
            <div className="border-l-4 border-red-500 pl-4">
              <p className="text-gray-400 text-sm">Email</p>
              <p className="text-white font-semibold">{user?.email}</p>
            </div>
            <div className="border-l-4 border-red-500 pl-4">
              <p className="text-gray-400 text-sm">Role</p>
              <p className="text-white font-semibold capitalize">{user?.role}</p>
            </div>
            <div className="border-l-4 border-red-500 pl-4">
              <p className="text-gray-400 text-sm">System Access</p>
              <p className="text-white font-semibold text-green-400">Full Access</p>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Feature 1 */}
          <div className="bg-gray-800 rounded-lg shadow-lg p-6 hover:shadow-xl transition border border-gray-700">
            <div className="flex items-center justify-center h-12 w-12 rounded-md bg-red-600 text-white mb-4">
              <span className="text-xl">👥</span>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">User Management</h3>
            <p className="text-gray-400">Manage all users, roles, and permissions</p>
          </div>

          {/* Feature 2 */}
          <div className="bg-gray-800 rounded-lg shadow-lg p-6 hover:shadow-xl transition border border-gray-700">
            <div className="flex items-center justify-center h-12 w-12 rounded-md bg-red-600 text-white mb-4">
              <span className="text-xl">⚙️</span>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">System Settings</h3>
            <p className="text-gray-400">Configure system settings and policies</p>
          </div>

          {/* Feature 3 */}
          <div className="bg-gray-800 rounded-lg shadow-lg p-6 hover:shadow-xl transition border border-gray-700">
            <div className="flex items-center justify-center h-12 w-12 rounded-md bg-red-600 text-white mb-4">
              <span className="text-xl">📊</span>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Reports & Analytics</h3>
            <p className="text-gray-400">View system analytics and reports</p>
          </div>
        </div>

        {/* Statistics */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-gradient-to-br from-red-600 to-red-700 rounded-lg shadow-lg p-6 text-white border border-red-500">
            <p className="text-sm opacity-90">Total Users</p>
            <p className="text-3xl font-bold">356</p>
          </div>
          <div className="bg-gradient-to-br from-orange-600 to-orange-700 rounded-lg shadow-lg p-6 text-white border border-orange-500">
            <p className="text-sm opacity-90">Active Sessions</p>
            <p className="text-3xl font-bold">127</p>
          </div>
          <div className="bg-gradient-to-br from-yellow-600 to-yellow-700 rounded-lg shadow-lg p-6 text-white border border-yellow-500">
            <p className="text-sm opacity-90">System Health</p>
            <p className="text-3xl font-bold">99%</p>
          </div>
          <div className="bg-gradient-to-br from-green-600 to-green-700 rounded-lg shadow-lg p-6 text-white border border-green-500">
            <p className="text-sm opacity-90">Data Backup</p>
            <p className="text-3xl font-bold text-green-300">✓</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-700">
            <h3 className="text-lg font-semibold text-white mb-4">Recent Activities</h3>
            <ul className="space-y-3 text-gray-400 text-sm">
              <li className="flex items-center">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                New student registered: John Doe
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                Teacher updated course materials
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-yellow-500 rounded-full mr-3"></span>
                System maintenance completed
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-purple-500 rounded-full mr-3"></span>
                New announcement posted
              </li>
            </ul>
          </div>

          <div className="bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-700">
            <h3 className="text-lg font-semibold text-white mb-4">System Status</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex justify-between items-center">
                <span className="text-gray-400">Database</span>
                <span className="text-green-400 font-semibold">Online</span>
              </li>
              <li className="flex justify-between items-center">
                <span className="text-gray-400">API Server</span>
                <span className="text-green-400 font-semibold">Running</span>
              </li>
              <li className="flex justify-between items-center">
                <span className="text-gray-400">Email Service</span>
                <span className="text-green-400 font-semibold">Active</span>
              </li>
              <li className="flex justify-between items-center">
                <span className="text-gray-400">Storage</span>
                <span className="text-green-400 font-semibold">Healthy</span>
              </li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
