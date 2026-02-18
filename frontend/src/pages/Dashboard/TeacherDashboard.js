import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const TeacherDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">EcoVerse</h1>
            <p className="text-gray-600">Teacher Dashboard</p>
          </div>
          <button
            onClick={handleLogout}
            className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-12">
        {/* Welcome Section */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Welcome, {user?.name}! 👨‍🏫
          </h2>
          <p className="text-gray-600">
            You are logged in as a <span className="font-semibold text-amber-600">Teacher</span>
          </p>
        </div>

        {/* User Information Card */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h3 className="text-xl font-bold text-gray-800 mb-6">Your Profile</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border-l-4 border-amber-500 pl-4">
              <p className="text-gray-600 text-sm">Name</p>
              <p className="text-gray-900 font-semibold">{user?.name}</p>
            </div>
            <div className="border-l-4 border-amber-500 pl-4">
              <p className="text-gray-600 text-sm">Email</p>
              <p className="text-gray-900 font-semibold">{user?.email}</p>
            </div>
            <div className="border-l-4 border-amber-500 pl-4">
              <p className="text-gray-600 text-sm">Role</p>
              <p className="text-gray-900 font-semibold capitalize">{user?.role}</p>
            </div>
            <div className="border-l-4 border-amber-500 pl-4">
              <p className="text-gray-600 text-sm">Account Status</p>
              <p className="text-gray-900 font-semibold text-green-600">Active</p>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Feature 1 */}
          <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition">
            <div className="flex items-center justify-center h-12 w-12 rounded-md bg-amber-500 text-white mb-4">
              <span className="text-xl">📖</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Manage Courses</h3>
            <p className="text-gray-600">Create and manage your courses and classes</p>
          </div>

          {/* Feature 2 */}
          <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition">
            <div className="flex items-center justify-center h-12 w-12 rounded-md bg-orange-500 text-white mb-4">
              <span className="text-xl">👥</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Students</h3>
            <p className="text-gray-600">View and manage your students</p>
          </div>

          {/* Feature 3 */}
          <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition">
            <div className="flex items-center justify-center h-12 w-12 rounded-md bg-red-500 text-white mb-4">
              <span className="text-xl">✅</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Grading</h3>
            <p className="text-gray-600">Grade assignments and give feedback</p>
          </div>
        </div>

        {/* Statistics */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-gradient-to-br from-amber-500 to-amber-600 rounded-lg shadow-lg p-6 text-white">
            <p className="text-sm opacity-90">Courses</p>
            <p className="text-3xl font-bold">4</p>
          </div>
          <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg shadow-lg p-6 text-white">
            <p className="text-sm opacity-90">Total Students</p>
            <p className="text-3xl font-bold">120</p>
          </div>
          <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-lg shadow-lg p-6 text-white">
            <p className="text-sm opacity-90">Pending Grading</p>
            <p className="text-3xl font-bold">25</p>
          </div>
          <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-lg shadow-lg p-6 text-white">
            <p className="text-sm opacity-90">Class Avg Grade</p>
            <p className="text-3xl font-bold">B+</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default TeacherDashboard;
