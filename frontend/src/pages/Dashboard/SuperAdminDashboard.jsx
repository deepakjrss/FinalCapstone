import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../components/ToastNotification';
import { ModernCard, ModernButton } from '../../components/ModernComponents';
import api from '../../utils/api';

const SuperAdminDashboard = () => {
  const { user, logout } = useAuth();
  const { showSuccess, showError } = useToast();
  const navigate = useNavigate();

  const [schools, setSchools] = useState([]);
  const [users, setUsers] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [schoolsLoading, setSchoolsLoading] = useState(false);
  const [usersLoading, setUsersLoading] = useState(false);

  // New school form
  const [newSchool, setNewSchool] = useState({
    name: '',
    emailDomain: ''
  });
  const [creatingSchool, setCreatingSchool] = useState(false);

  useEffect(() => {
    if (!user?.isSuperAdmin) {
      navigate('/');
      return;
    }
    fetchAllData();
  }, [user, navigate, fetchAllData]);

  const fetchAllData = useCallback(async () => {
    setLoading(true);
    try {
      await Promise.all([
        fetchSchools(),
        fetchUsers(),
        fetchAnalytics()
      ]);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchSchools = async () => {
    setSchoolsLoading(true);
    try {
      const response = await api.get('/superadmin/schools');
      setSchools(response.data);
    } catch (error) {
      showError('Failed to load schools');
      console.error('Fetch schools error:', error);
    } finally {
      setSchoolsLoading(false);
    }
  };

  const fetchUsers = async () => {
    setUsersLoading(true);
    try {
      const response = await api.get('/superadmin/users');
      setUsers(response.data);
    } catch (error) {
      showError('Failed to load users');
      console.error('Fetch users error:', error);
    } finally {
      setUsersLoading(false);
    }
  };

  const fetchAnalytics = async () => {
    try {
      const response = await api.get('/superadmin/analytics');
      setAnalytics(response.data);
    } catch (error) {
      showError('Failed to load analytics');
      console.error('Fetch analytics error:', error);
    }
  };

  const handleCreateSchool = async (e) => {
    e.preventDefault();

    if (!newSchool.name.trim() || !newSchool.emailDomain.trim()) {
      showError('Please fill in all fields');
      return;
    }

    setCreatingSchool(true);
    try {
      const response = await api.post('/superadmin/schools', newSchool);

      if (response.data.success) {
        showSuccess('School created successfully!');
        setNewSchool({ name: '', emailDomain: '' });
        fetchSchools(); // Refresh schools list
        fetchAnalytics(); // Refresh analytics
      }
    } catch (error) {
      showError(error.response?.data?.message || 'Failed to create school');
      console.error('Create school error:', error);
    } finally {
      setCreatingSchool(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center px-4 transition-all duration-300">
        <div className="text-center p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-slate-200 dark:border-gray-700 transition-all duration-300">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 dark:border-emerald-500 mx-auto mb-4" />
          <p className="text-2xl font-bold text-slate-800 dark:text-gray-100">Loading Super Admin Panel...</p>
          <p className="text-sm text-slate-500 dark:text-gray-400 mt-2">Gathering system data</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-gray-900 dark:to-gray-800 transition-all duration-300">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-slate-200 dark:border-gray-700 sticky top-0 z-50 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-4">
            <h1 className="text-4xl font-bold text-slate-900 dark:text-gray-100">👑 Super Admin Panel</h1>
            <div className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-semibold border border-purple-200">
              System Control
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors duration-200"
          >
            Logout
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* Analytics Cards */}
        {analytics && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <ModernCard className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">{analytics.totalSchools}</div>
              <div className="text-sm text-gray-600">Total Schools</div>
            </ModernCard>
            <ModernCard className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">{analytics.totalUsers}</div>
              <div className="text-sm text-gray-600">Total Users</div>
            </ModernCard>
            <ModernCard className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">{analytics.totalStudents}</div>
              <div className="text-sm text-gray-600">Students</div>
            </ModernCard>
            <ModernCard className="text-center">
              <div className="text-3xl font-bold text-orange-600 mb-2">{analytics.totalTeachers}</div>
              <div className="text-sm text-gray-600">Teachers</div>
            </ModernCard>
          </div>
        )}

        {/* Create School Form */}
        <ModernCard>
          <h2 className="text-2xl font-bold text-gray-800 mb-6">🏫 Create New School</h2>
          <form onSubmit={handleCreateSchool} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">School Name</label>
                <input
                  type="text"
                  value={newSchool.name}
                  onChange={(e) => setNewSchool(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter school name"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Domain</label>
                <input
                  type="text"
                  value={newSchool.emailDomain}
                  onChange={(e) => setNewSchool(prev => ({ ...prev, emailDomain: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., school.edu"
                  required
                />
              </div>
            </div>
            <ModernButton
              type="submit"
              disabled={creatingSchool}
              className="w-full md:w-auto"
            >
              {creatingSchool ? 'Creating...' : 'Create School'}
            </ModernButton>
          </form>
        </ModernCard>

        {/* Schools List */}
        <ModernCard>
          <h2 className="text-2xl font-bold text-gray-800 mb-6">🏫 Schools Overview</h2>
          {schoolsLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4" />
              <p className="text-gray-600">Loading schools...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold text-gray-900">School Name</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-900">Email Domain</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-900">Invite Code</th>
                    <th className="px-4 py-3 text-center font-semibold text-gray-900">Students</th>
                    <th className="px-4 py-3 text-center font-semibold text-gray-900">Teachers</th>
                    <th className="px-4 py-3 text-center font-semibold text-gray-900">Total Users</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {schools.map((school) => (
                    <tr key={school._id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium text-gray-900">{school.name}</td>
                      <td className="px-4 py-3 text-gray-600">{school.emailDomain}</td>
                      <td className="px-4 py-3 font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                        {school.inviteCode}
                      </td>
                      <td className="px-4 py-3 text-center text-blue-600 font-semibold">
                        {school.totalStudents}
                      </td>
                      <td className="px-4 py-3 text-center text-green-600 font-semibold">
                        {school.totalTeachers}
                      </td>
                      <td className="px-4 py-3 text-center text-purple-600 font-semibold">
                        {school.totalUsers}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {schools.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  No schools found. Create your first school above.
                </div>
              )}
            </div>
          )}
        </ModernCard>

        {/* Users Table */}
        <ModernCard>
          <h2 className="text-2xl font-bold text-gray-800 mb-6">👥 All Users</h2>
          {usersLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-4" />
              <p className="text-gray-600">Loading users...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold text-gray-900">Name</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-900">Email</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-900">Role</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-900">School</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-900">Class</th>
                    <th className="px-4 py-3 text-center font-semibold text-gray-900">Status</th>
                    <th className="px-4 py-3 text-center font-semibold text-gray-900">Eco Points</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {users.map((user) => (
                    <tr key={user._id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium text-gray-900">{user.name}</td>
                      <td className="px-4 py-3 text-gray-600">{user.email}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          user.role === 'superadmin' ? 'bg-purple-100 text-purple-800' :
                          user.role === 'admin' ? 'bg-red-100 text-red-800' :
                          user.role === 'teacher' ? 'bg-green-100 text-green-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-600">
                        {user.school?.name || 'N/A'}
                      </td>
                      <td className="px-4 py-3 text-gray-600">
                        {user.class?.name || 'N/A'}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          user.status === 'approved' ? 'bg-green-100 text-green-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {user.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center font-semibold text-green-600">
                        {user.ecoPoints}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {users.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  No users found.
                </div>
              )}
            </div>
          )}
        </ModernCard>
      </div>
    </div>
  );
};

export default SuperAdminDashboard;