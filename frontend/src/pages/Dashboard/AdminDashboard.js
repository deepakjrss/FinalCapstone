import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useDarkMode } from '../../context/DarkModeContext';
import { useToast } from '../../components/ToastNotification';
import api from '../../utils/api';
import userService from '../../services/userService';
import feedbackService from '../../services/feedbackService';
import analyticsService from '../../services/analyticsService';
import announcementService from '../../services/announcementService';
import schoolService from '../../services/schoolService';
import requestService from '../../services/requestService';
import socket from '../../socket';
import {
  LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid,
  BarChart, Bar, ResponsiveContainer
} from 'recharts';
import { SkeletonChart, SkeletonTable, SkeletonList } from '../../components/Skeletons';

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const { darkMode, toggleDarkMode } = useDarkMode();
  const { showSuccess, showError } = useToast();
  const navigate = useNavigate();
  const [deletedUsers, setDeletedUsers] = useState([]);
  const [classClearHistory, setClassClearHistory] = useState([]);
  const [showDeleted, setShowDeleted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [teachers, setTeachers] = useState([]);

  // School state
  const [school, setSchool] = useState(null);
  const [schoolLoading, setSchoolLoading] = useState(false);

  // Feedback state
  const [feedback, setFeedback] = useState([]);
  const [feedbackLoading, setFeedbackLoading] = useState(false);
  const [feedbackError, setFeedbackError] = useState('');

  // Pending teachers state
  const [pendingTeachers, setPendingTeachers] = useState([]);
  const [pendingTeachersLoading, setPendingTeachersLoading] = useState(false);

  // Pending requests state
  const [pendingRequests, setPendingRequests] = useState([]);
  const [pendingRequestsLoading, setPendingRequestsLoading] = useState(false);

  // Analytics state
  const [analyticsData, setAnalyticsData] = useState({
    classComparison: [],
    studentPerformance: [],
    monthlyProgress: [],
    topStudents: []
  });
  const [analyticsLoading, setAnalyticsLoading] = useState(false);
  const [analyticsError, setAnalyticsError] = useState('');
  const [adminStats, setAdminStats] = useState({
    totalUsers: 0,
    totalStudents: 0,
    totalTeachers: 0,
    activeUsers: 0,
    systemHealth: 0
  });
  const [adminStatsLoading, setAdminStatsLoading] = useState(false);
  const [adminStatsError, setAdminStatsError] = useState('');
  const [announcements, setAnnouncements] = useState([]);
  const [announcementTitle, setAnnouncementTitle] = useState('');
  const [announcementMessage, setAnnouncementMessage] = useState('');
  const [announcementTargetType, setAnnouncementTargetType] = useState('school');
  const [announcementClass, setAnnouncementClass] = useState('');
  const [announcementSending, setAnnouncementSending] = useState(false);
  const [classOptions, setClassOptions] = useState([]);

  // Activity logs state
  const [activityLogs, setActivityLogs] = useState([]);
  const [activityLogsLoading, setActivityLogsLoading] = useState(false);
  const [activityLogsError, setActivityLogsError] = useState('');

  // Super Admin state
  const [allSchools, setAllSchools] = useState([]);
  const [allSchoolsLoading, setAllSchoolsLoading] = useState(false);

  // Pagination states
  const [deletedUsersPage, setDeletedUsersPage] = useState(1);
  const [classHistoryPage, setClassHistoryPage] = useState(1);
  const [teachersPage, setTeachersPage] = useState(1);
  const [activityLogsPage, setActivityLogsPage] = useState(1);
  const itemsPerPage = 10;

  // Memoized pagination calculations
  const teachersPagination = useMemo(() => {
    const indexOfLast = teachersPage * itemsPerPage;
    const indexOfFirst = indexOfLast - itemsPerPage;
    const currentTeachers = teachers.slice(indexOfFirst, indexOfLast);
    const totalPages = Math.ceil(teachers.length / itemsPerPage);
    return { currentTeachers, totalPages, indexOfFirst, indexOfLast };
  }, [teachers, teachersPage, itemsPerPage]);

  const deletedUsersPagination = useMemo(() => {
    const indexOfLast = deletedUsersPage * itemsPerPage;
    const indexOfFirst = indexOfLast - itemsPerPage;
    const currentDeletedUsers = deletedUsers.slice(indexOfFirst, indexOfLast);
    const totalPages = Math.ceil(deletedUsers.length / itemsPerPage);
    return { currentDeletedUsers, totalPages, indexOfFirst, indexOfLast };
  }, [deletedUsers, deletedUsersPage, itemsPerPage]);

  const classHistoryPagination = useMemo(() => {
    const indexOfLast = classHistoryPage * itemsPerPage;
    const indexOfFirst = indexOfLast - itemsPerPage;
    const currentClassHistory = classClearHistory.slice(indexOfFirst, indexOfLast);
    const totalPages = Math.ceil(classClearHistory.length / itemsPerPage);
    return { currentClassHistory, totalPages, indexOfFirst, indexOfLast };
  }, [classClearHistory, classHistoryPage, itemsPerPage]);

  const activityLogsPagination = useMemo(() => {
    const indexOfLast = activityLogsPage * itemsPerPage;
    const indexOfFirst = indexOfLast - itemsPerPage;
    const currentActivityLogs = activityLogs.slice(indexOfFirst, indexOfLast);
    const totalPages = Math.ceil(activityLogs.length / itemsPerPage);
    return { currentActivityLogs, totalPages, indexOfFirst, indexOfLast };
  }, [activityLogs, activityLogsPage, itemsPerPage]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const fetchAdminData = useCallback(async () => {
    setLoading(true);
    setFeedbackLoading(true);
    setActivityLogsLoading(true);
    setSchoolLoading(true);
    setFeedbackError('');
    setActivityLogsError('');

    try {
      const [deletedResult, feedbackResult, teachersResult, activityLogsResult, schoolResult, classesResult, announcementsResult] = await Promise.all([
        userService.getDeletedUsers(),
        feedbackService.getAllFeedback(),
        userService.getTeachers(),
        userService.getActivityLogs(),
        schoolService.getMySchool(),
        analyticsService.getClasses(),
        announcementService.getAnnouncements()
      ]);

      if (deletedResult.success) setDeletedUsers(deletedResult.data);
      if (feedbackResult.success) setFeedback(feedbackResult.data);
      if (teachersResult.success) setTeachers(teachersResult.data);
      if (activityLogsResult.success) setActivityLogs(activityLogsResult.data);
      if (schoolResult.success) setSchool(schoolResult.data);
      if (classesResult.success) setClassOptions(classesResult.data || []);
      if (announcementsResult.success) setAnnouncements(announcementsResult.data || []);

      const savedHistory = localStorage.getItem('classClearHistory');
      if (savedHistory) {
        try {
          setClassClearHistory(JSON.parse(savedHistory));
        } catch (e) {
          setClassClearHistory([]);
        }
      }
    } catch (e) {
      setFeedbackError('Failed to load feedback analytics. Please try again.');
      console.error('Error fetching admin data:', e);
    } finally {
      setLoading(false);
      setFeedbackLoading(false);
      setActivityLogsLoading(false);
      setSchoolLoading(false);
    }
  }, []);

  const fetchDeletedUsers = useCallback(async () => {
    const res = await userService.getDeletedUsers();
    if (res.success) setDeletedUsers(res.data);
  }, []);

  const fetchPendingTeachers = useCallback(async () => {
    setPendingTeachersLoading(true);
    const result = await userService.getPendingTeachers();
    if (result.success) {
      setPendingTeachers(result.data);
    } else {
      showError(result.error);
    }
    setPendingTeachersLoading(false);
  }, [showError]);

  const fetchPendingRequests = useCallback(async () => {
    setPendingRequestsLoading(true);
    const result = await requestService.getPendingRequests();
    if (result.success) {
      setPendingRequests(result.data);
    } else {
      showError(result.error);
    }
    setPendingRequestsLoading(false);
  }, [showError]);

  const fetchAllSchools = useCallback(async () => {
    if (!user?.isSuperAdmin) return;
    setAllSchoolsLoading(true);
    const result = await schoolService.getAllSchools();
    if (result.success) {
      setAllSchools(result.data);
    } else {
      showError(result.error);
    }
    setAllSchoolsLoading(false);
  }, [user?.isSuperAdmin, showError]);

  const fetchAdminStats = useCallback(async () => {
    if (!user) return;
    setAdminStatsLoading(true);
    setAdminStatsError('');
    try {
      const response = await api.get('/admin/analytics');
      setAdminStats(response.data);
    } catch (err) {
      console.error('Error fetching admin stats:', err);
      setAdminStatsError('Unable to load analytics');
      // Don't show popup error on login - just log and show inline error
    } finally {
      setAdminStatsLoading(false);
    }
  }, [user]);

  const handleSendAnnouncement = async () => {
    if (!announcementTitle.trim() || !announcementMessage.trim() || announcementSending) return;

    setAnnouncementSending(true);
    try {
      const payload = {
        title: announcementTitle,
        message: announcementMessage,
        targetType: announcementTargetType
      };

      if (announcementTargetType === 'class') {
        payload.className = announcementClass;
      }

      const result = await announcementService.createAnnouncement(payload);
      if (!result.success) {
        throw new Error(result.error || 'Failed to create announcement');
      }

      setAnnouncementTitle('');
      setAnnouncementMessage('');
      setAnnouncementClass('');
      setAnnouncementTargetType('school');
      showSuccess('Announcement sent successfully!');

      const refresh = await announcementService.getAnnouncements();
      if (refresh.success) setAnnouncements(refresh.data);
    } catch (err) {
      console.error('Error sending announcement:', err);
      showError(err.message || 'Failed to send announcement');
    } finally {
      setAnnouncementSending(false);
    }
  };

  const approveTeacher = useCallback(async (teacherId) => {
    const result = await userService.approveTeacher(teacherId);
    if (result.success) {
      showSuccess('Teacher approved successfully! ✅');
      // Remove from pending list
      setPendingTeachers(prev => prev.filter(teacher => teacher._id !== teacherId));
      // Refresh teachers list
      fetchAdminData();
    } else {
      showError(result.error);
    }
  }, [showSuccess, showError, fetchAdminData]);

  const approveRequest = useCallback(async (requestId) => {
    const result = await requestService.approveRequest(requestId);
    if (result.success) {
      showSuccess('Request approved successfully! ✅');
      // Remove from pending list
      setPendingRequests(prev => prev.filter(request => request._id !== requestId));
    } else {
      showError(result.error);
    }
  }, [showSuccess, showError]);

  const rejectRequest = useCallback(async (requestId) => {
    const result = await requestService.rejectRequest(requestId);
    if (result.success) {
      showSuccess('Request rejected');
      // Remove from pending list
      setPendingRequests(prev => prev.filter(request => request._id !== requestId));
    } else {
      showError(result.error);
    }
  }, [showSuccess, showError]);

  const fetchAnalyticsData = useCallback(async () => {
    setAnalyticsLoading(true);
    setAnalyticsError('');
    console.log("TOKEN:", localStorage.getItem("token"));
    try {
      const chartsResult = await analyticsService.getDashboardCharts();
      const topStudentsResult = await analyticsService.getTopStudents();

      if (chartsResult.success) {
        setAnalyticsData(prevData => ({
          ...prevData,
          classComparison: chartsResult.data || []
        }));
      } else {
        setAnalyticsError(chartsResult.error || 'Failed to load dashboard charts');
      }

      if (topStudentsResult.success) {
        setAnalyticsData(prevData => ({
          ...prevData,
          topStudents: topStudentsResult.data || []
        }));
      } else {
        setAnalyticsError(prev => prev || (topStudentsResult.error || 'Failed to load top students'));
      }
    } catch (error) {
      console.error('Error fetching analytics data:', error);
      if (error.response?.status === 401) {
        setAnalyticsError("Unauthorized - please login again");
      } else {
        setAnalyticsError("Failed to load analytics");
      }
      // Keep mock data as fallback if API fails
      setAnalyticsData({
        classComparison: [
          { name: 'Class 8-A', score: 420, students: 25 },
          { name: 'Class 9-A', score: 350, students: 22 },
          { name: 'Class 10-A', score: 520, students: 28 },
          { name: 'Class 8-B', score: 380, students: 24 },
          { name: 'Class 9-B', score: 450, students: 26 }
        ],
        studentPerformance: [
          { name: 'Jan', submissions: 45, approved: 38 },
          { name: 'Feb', submissions: 52, approved: 44 },
          { name: 'Mar', submissions: 48, approved: 41 },
          { name: 'Apr', submissions: 61, approved: 55 },
          { name: 'May', submissions: 58, approved: 49 },
          { name: 'Jun', submissions: 67, approved: 59 }
        ],
        monthlyProgress: [
          { month: 'Jan', ecoPoints: 1250 },
          { month: 'Feb', ecoPoints: 1450 },
          { month: 'Mar', ecoPoints: 1380 },
          { month: 'Apr', ecoPoints: 1620 },
          { month: 'May', ecoPoints: 1580 },
          { month: 'Jun', ecoPoints: 1750 }
        ],
        topStudents: [
          { name: 'Alice Johnson', points: 450, class: '10-A' },
          { name: 'Bob Smith', points: 420, class: '9-A' },
          { name: 'Charlie Brown', points: 380, class: '8-A' },
          { name: 'Diana Wilson', points: 360, class: '10-A' },
          { name: 'Eve Davis', points: 340, class: '9-B' }
        ]
      });
    } finally {
      setAnalyticsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAdminData();
    fetchAnalyticsData();
    fetchPendingTeachers();
    fetchPendingRequests();
    fetchAllSchools();
  }, [fetchAdminData, fetchAnalyticsData, fetchPendingTeachers, fetchPendingRequests, fetchAllSchools]);

  // Fetch admin stats only after user is available
  useEffect(() => {
    if (user) {
      fetchAdminStats();
    }
  }, [user, fetchAdminStats]);

  // Socket listeners for real-time analytics updates
  useEffect(() => {
    const handleAnalyticsUpdate = (data) => {
      console.log('📊 Real-time analytics update:', data);
      // Invalidate frontend cache and refresh analytics data
      analyticsService.invalidateAll();
      fetchAnalyticsData();
    };

    socket.on('analytics-update', handleAnalyticsUpdate);

    return () => {
      socket.off('analytics-update', handleAnalyticsUpdate);
    };
  }, [fetchAnalyticsData]);

  // Reset pagination when data changes
  useEffect(() => {
    setDeletedUsersPage(1);
  }, [deletedUsers]);

  useEffect(() => {
    setClassHistoryPage(1);
  }, [classClearHistory]);

  useEffect(() => {
    setTeachersPage(1);
  }, [teachers]);

  useEffect(() => {
    setActivityLogsPage(1);
  }, [activityLogs]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 dark:from-gray-900 dark:to-gray-800 transition-all duration-300">
      {/* Header */}
      <header className="bg-gray-900 shadow-lg border-b border-gray-700 dark:bg-gray-800 dark:border-gray-600 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 py-6 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <h1 className="text-3xl font-bold text-white dark:text-gray-100">EcoVerse</h1>
            {pendingRequests.length > 0 && (
              <div className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-semibold border border-yellow-200">
                🔔 Pending Requests ({pendingRequests.length})
              </div>
            )}
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={toggleDarkMode}
              className="px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-white transition-all duration-300 hover:scale-105"
            >
              {darkMode ? "☀️ Light" : "🌙 Dark"}
            </button>
            <button
              onClick={handleLogout}
              className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-12 bg-gray-50 dark:bg-gray-900 transition-all duration-300">
        {/* Welcome Section */}
        <div className="bg-gray-800 dark:bg-gray-700 rounded-lg shadow-lg p-8 mb-8 border border-gray-700 dark:border-gray-600 transition-all duration-300">
          <h2 className="text-2xl font-bold text-white dark:text-gray-100 mb-4">
            Welcome, {user?.name}! 🔐
          </h2>
          <p className="text-gray-300 dark:text-gray-300">
            You are logged in as an <span className="font-semibold text-red-400 dark:text-red-300">Administrator</span>
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

        {/* School Information Card */}
        <div className="bg-gray-800 rounded-lg shadow-lg p-8 mb-8 border border-gray-700">
          <h3 className="text-xl font-bold text-white mb-6">School Information</h3>
          {schoolLoading ? (
            <div className="animate-pulse">
              <div className="h-4 bg-gray-700 rounded w-3/4 mb-4"></div>
              <div className="h-4 bg-gray-700 rounded w-1/2"></div>
            </div>
          ) : school ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="border-l-4 border-blue-500 pl-4">
                <p className="text-gray-400 text-sm">School Name</p>
                <p className="text-white font-semibold">{school.name}</p>
              </div>
              <div className="border-l-4 border-blue-500 pl-4">
                <p className="text-gray-400 text-sm">Email Domain</p>
                <p className="text-white font-semibold">{school.emailDomain}</p>
              </div>
              <div className="border-l-4 border-blue-500 pl-4 md:col-span-2">
                <p className="text-gray-400 text-sm">Invite Code</p>
                <div className="flex items-center gap-3">
                  <p className="text-white font-bold text-2xl tracking-wider bg-gray-700 px-4 py-2 rounded-lg border-2 border-blue-500">
                    {school.inviteCode}
                  </p>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(school.inviteCode);
                      showSuccess('Invite code copied to clipboard!');
                    }}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                  >
                    📋 Copy
                  </button>
                </div>
                <p className="text-gray-400 text-sm mt-2">Share this code with new users to join your school</p>
              </div>
            </div>
          ) : (
            <p className="text-gray-400">School information not available</p>
          )}
        </div>

        {/* Super Admin Panel */}
        {user?.isSuperAdmin && (
          <div className="bg-gradient-to-r from-purple-900 to-indigo-900 rounded-lg shadow-lg p-8 mb-8 border border-purple-700">
            <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
              <span className="text-3xl mr-3">👑</span>
              Super Admin Panel
            </h3>
            <p className="text-purple-200 mb-6">Manage all schools across the EcoVerse platform</p>

            {allSchoolsLoading ? (
              <div className="animate-pulse">
                <div className="h-4 bg-purple-700 rounded w-3/4 mb-4"></div>
                <div className="h-4 bg-purple-700 rounded w-1/2"></div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {allSchools.map((school) => (
                  <div key={school._id} className="bg-purple-800 rounded-lg p-6 border border-purple-600">
                    <h4 className="text-xl font-bold text-white mb-3">{school.name}</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-purple-300">Invite Code:</span>
                        <span className="text-white font-mono bg-purple-700 px-2 py-1 rounded text-sm">
                          {school.inviteCode}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-purple-300">Total Users:</span>
                        <span className="text-green-400 font-bold text-lg">{school.totalUsers}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-purple-300">Domain:</span>
                        <span className="text-blue-300">{school.emailDomain}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

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
            {adminStatsLoading ? (
              <div className="animate-pulse h-8 bg-red-500 rounded mt-2"></div>
            ) : adminStatsError ? (
              <p className="text-red-200 text-sm mt-2">Error</p>
            ) : (
              <p className="text-3xl font-bold">{adminStats.totalUsers || 0}</p>
            )}
          </div>
          <div className="bg-gradient-to-br from-orange-600 to-orange-700 rounded-lg shadow-lg p-6 text-white border border-orange-500">
            <p className="text-sm opacity-90">Active Users</p>
            {adminStatsLoading ? (
              <div className="animate-pulse h-8 bg-orange-500 rounded mt-2"></div>
            ) : adminStatsError ? (
              <p className="text-orange-200 text-sm mt-2">Error</p>
            ) : (
              <p className="text-3xl font-bold">{adminStats.activeUsers || 0}</p>
            )}
          </div>
          <div className="bg-gradient-to-br from-yellow-600 to-yellow-700 rounded-lg shadow-lg p-6 text-white border border-yellow-500">
            <p className="text-sm opacity-90">System Health</p>
            {adminStatsLoading ? (
              <div className="animate-pulse h-8 bg-yellow-500 rounded mt-2"></div>
            ) : adminStatsError ? (
              <p className="text-yellow-200 text-sm mt-2">Error</p>
            ) : (
              <p className="text-3xl font-bold">{adminStats.systemHealth || 0}%</p>
            )}
          </div>
          <div className="bg-gradient-to-br from-green-600 to-green-700 rounded-lg shadow-lg p-6 text-white border border-green-500">
            <p className="text-sm opacity-90">Students</p>
            {adminStatsLoading ? (
              <div className="animate-pulse h-8 bg-green-500 rounded mt-2"></div>
            ) : adminStatsError ? (
              <p className="text-green-200 text-sm mt-2">Error</p>
            ) : (
              <p className="text-3xl font-bold">{adminStats.totalStudents || 0}</p>
            )}
          </div>
        </div>

        {/* Advanced Analytics Charts */}
        <div className="mt-12">
          <h2 className="text-3xl font-bold text-white mb-8">📊 Advanced Analytics</h2>

          {analyticsLoading ? (
            <SkeletonChart />
          ) : analyticsError ? (
            <div className="bg-red-900 border border-red-700 text-red-200 px-4 py-3 rounded-lg mb-6">
              <p className="font-semibold">Analytics Error:</p>
              <p>{analyticsError}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Class Comparison Bar Chart */}
              <div className="bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-700">
                <h3 className="text-xl font-bold text-white mb-6">📊 Class Performance Comparison</h3>
                {analyticsData.classComparison.length === 0 ? (
                  <p className="text-gray-500 text-center py-12">No chart data available 📊</p>
                ) : (
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={analyticsData.classComparison}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="name" stroke="#9CA3AF" />
                      <YAxis stroke="#9CA3AF" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#1F2937',
                          border: '1px solid #374151',
                          borderRadius: '8px',
                          color: '#F9FAFB'
                        }}
                      />
                      <Bar dataKey="score" fill="#16a34a" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>

              {/* Monthly Progress Line Chart */}
              <div className="bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-700">
                <h3 className="text-xl font-bold text-white mb-6">📈 Monthly EcoPoints Progress</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={analyticsData.monthlyProgress}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="month" stroke="#9CA3AF" />
                    <YAxis stroke="#9CA3AF" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#1F2937',
                        border: '1px solid #374151',
                        borderRadius: '8px',
                        color: '#F9FAFB'
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="ecoPoints"
                      stroke="#22c55e"
                      strokeWidth={3}
                      dot={{ fill: '#22c55e', strokeWidth: 2, r: 6 }}
                      activeDot={{ r: 8, stroke: '#22c55e', strokeWidth: 2 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Student Performance Area Chart */}
              <div className="bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-700">
                <h3 className="text-xl font-bold text-white mb-6">📋 Student Submission Trends</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={analyticsData.studentPerformance}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="name" stroke="#9CA3AF" />
                    <YAxis stroke="#9CA3AF" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#1F2937',
                        border: '1px solid #374151',
                        borderRadius: '8px',
                        color: '#F9FAFB'
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="submissions"
                      stroke="#3b82f6"
                      strokeWidth={2}
                      name="Total Submissions"
                    />
                    <Line
                      type="monotone"
                      dataKey="approved"
                      stroke="#16a34a"
                      strokeWidth={2}
                      name="Approved Submissions"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Top Students Leaderboard */}
              <div className="bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-700">
                <h3 className="text-xl font-bold text-white mb-6">🏆 Top Performing Students</h3>
                {analyticsData.topStudents.length === 0 ? (
                  <p className="text-gray-500 text-center py-12">No student data available 🏆</p>
                ) : (
                  <div className="space-y-4">
                    {analyticsData.topStudents.map((student, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                            index === 0 ? 'bg-yellow-500 text-black dark:text-black' :
                            index === 1 ? 'bg-gray-400 text-black dark:text-black' :
                            index === 2 ? 'bg-amber-600 text-white dark:text-white' :
                            'bg-gray-600 text-white dark:text-white'
                          }`}>
                            {index + 1}
                          </div>
                          <div>
                            <p className="text-white font-medium">{student.name}</p>
                            <p className="text-gray-400 text-sm">Class {student.class}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-green-400 font-bold text-lg">{student.ecoPoints || student.points}</p>
                          <p className="text-gray-400 text-xs">ecoPoints</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Pending Approvals */}
        <div className="mt-12 bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-700">
          <h3 className="text-2xl font-bold text-white mb-4">⏳ Pending Approvals</h3>

          {pendingTeachersLoading || pendingRequestsLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
              <span className="ml-3 text-gray-300">Loading pending approvals...</span>
            </div>
          ) : pendingTeachers.length === 0 && pendingRequests.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">✅</div>
              <p className="text-gray-300 text-lg">All approvals completed</p>
              <p className="text-gray-500 text-sm">No pending teachers or requests</p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Pending Teachers */}
              {pendingTeachers.length > 0 && (
                <div>
                  <h4 className="text-lg font-semibold text-white mb-3">👨‍🏫 Pending Teachers ({pendingTeachers.length})</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {pendingTeachers.map((teacher) => (
                      <div key={teacher._id} className="bg-gradient-to-br from-yellow-900 to-orange-900 p-6 rounded-lg border border-yellow-600 shadow-lg">
                        <div className="flex items-center mb-4">
                          <div className="w-12 h-12 bg-yellow-600 rounded-full flex items-center justify-center text-white font-bold text-xl mr-4">
                            👨‍🏫
                          </div>
                          <div>
                            <h4 className="text-white font-bold text-lg">{teacher.name}</h4>
                            <p className="text-yellow-200 text-sm">{teacher.email}</p>
                          </div>
                        </div>
                        <div className="mb-4">
                          <p className="text-yellow-100 text-sm">
                            Registered: {new Date(teacher.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <button
                          onClick={() => approveTeacher(teacher._id)}
                          className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300 hover:scale-105 shadow-md"
                        >
                          ✅ Approve Teacher
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Pending Requests */}
              {pendingRequests.length > 0 && (
                <div>
                  <h4 className="text-lg font-semibold text-white mb-3">📋 Pending Requests ({pendingRequests.length})</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {pendingRequests.map((request) => (
                      <div key={request._id} className="bg-gradient-to-br from-blue-900 to-purple-900 p-6 rounded-lg border border-blue-600 shadow-lg">
                        <div className="flex items-center mb-4">
                          <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xl mr-4">
                            {request.role === 'student' ? '👨‍🎓' : '👨‍🏫'}
                          </div>
                          <div>
                            <h4 className="text-white font-bold text-lg">{request.userId.name}</h4>
                            <p className="text-blue-200 text-sm">{request.userId.email}</p>
                            <p className="text-blue-300 text-xs capitalize">{request.role}</p>
                          </div>
                        </div>
                        <div className="mb-4">
                          <p className="text-blue-100 text-sm">
                            Requested: {new Date(request.createdAt).toLocaleDateString()}
                          </p>
                          <p className="text-blue-100 text-sm">
                            School: {request.school.name}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => approveRequest(request._id)}
                            className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300 hover:scale-105 shadow-md"
                          >
                            ✅ Approve
                          </button>
                          <button
                            onClick={() => rejectRequest(request._id)}
                            className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300 hover:scale-105 shadow-md"
                          >
                            ❌ Reject
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Teachers List */}
        <div className="mt-12 bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-700">
          <h3 className="text-2xl font-bold text-white mb-4">👩‍🏫 Teachers</h3>
          {teachers.length > 0 ? (
            <>
              {/* Pagination Info */}
              <div className="text-sm text-gray-400 mb-4">
                Showing {Math.min((teachersPage - 1) * itemsPerPage + 1, teachers.length)} - {Math.min(teachersPage * itemsPerPage, teachers.length)} of {teachers.length} teachers
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {teachersPagination.currentTeachers.map((teacher) => (
                  <div key={teacher._id} className="bg-gray-700 p-4 rounded-lg border border-gray-600">
                    <p className="text-white font-semibold">{teacher.name}</p>
                    <p className="text-gray-300 text-sm">{teacher.email}</p>
                  </div>
                ))}
              </div>

              {/* Teachers Pagination Controls */}
              {teachersPagination.totalPages > 1 && (
                  <div className="flex items-center justify-between mt-6">
                    <button
                      onClick={() => setTeachersPage(teachersPage - 1)}
                      disabled={teachersPage === 1}
                      className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl shadow-md transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Previous
                    </button>

                    <div className="flex gap-2">
                      {Array.from({ length: teachersPagination.totalPages }, (_, i) => (
                        <button
                          key={i}
                          onClick={() => setTeachersPage(i + 1)}
                          className={`px-3 py-2 rounded-xl shadow-md transition ${
                            teachersPage === i + 1
                              ? "bg-green-600 text-white dark:bg-green-500 dark:text-white"
                              : "bg-gray-200 hover:bg-gray-300 text-gray-700 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-300"
                          }`}
                        >
                          {i + 1}
                        </button>
                      ))}
                    </div>

                    <button
                      onClick={() => setTeachersPage(teachersPage + 1)}
                      disabled={teachersPage === teachersPagination.totalPages}
                      className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl shadow-md transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next
                    </button>
                  </div>
                )}
            </>
          ) : (
            <p className="text-gray-400">No teachers found.</p>
          )}
        </div>

        {/* Deleted Students Section */}
        <div className="mt-12">
          <h3 className="text-2xl font-bold text-white mb-6">🗑️ Deleted Students</h3>
          <button
            onClick={() => setShowDeleted(true)}
            className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all duration-300"
          >
            View Deleted Students
          </button>

          {showDeleted && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setShowDeleted(false)}>
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-4xl p-6 relative transition-all duration-300" onClick={(e) => e.stopPropagation()}>
                <button
                  onClick={() => setShowDeleted(false)}
                  className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 text-lg font-bold transition-colors"
                >
                  ✕
                </button>

                <h4 className="text-2xl font-bold text-slate-900 dark:text-gray-100 mb-4">Deleted Students</h4>

                {loading ? (
                  <SkeletonTable rows={5} columns={4} />
                ) : deletedUsers.length > 0 ? (
                  <>
                    {/* Pagination Info */}
                    <div className="text-sm text-slate-600 mb-4">
                      Showing {Math.min((deletedUsersPage - 1) * itemsPerPage + 1, deletedUsers.length)} - {Math.min(deletedUsersPage * itemsPerPage, deletedUsers.length)} of {deletedUsers.length} deleted students
                    </div>

                    <div className="overflow-x-auto max-h-[60vh]">
                      <table className="min-w-full table-auto">
                        <thead>
                          <tr className="bg-slate-100">
                            <th className="px-4 py-2 text-left text-slate-700">Name</th>
                            <th className="px-4 py-2 text-left text-slate-700">Class</th>
                            <th className="px-4 py-2 text-left text-slate-700">Reason</th>
                            <th className="px-4 py-2 text-left text-slate-700">Deleted By</th>
                            <th className="px-4 py-2 text-left text-slate-700">Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {deletedUsersPagination.currentDeletedUsers.map((deletedUser, index) => (
                              <tr key={index} className="border-t hover:bg-slate-50">
                                <td className="px-4 py-2 text-slate-900 font-medium">{deletedUser.name}</td>
                                <td className="px-4 py-2 text-slate-900">{deletedUser.className || 'N/A'}</td>
                                <td className="px-4 py-2 text-slate-900 max-w-xs truncate" title={deletedUser.reason || 'No reason'}>
                                  {deletedUser.reason || 'No reason'}
                                </td>
                                <td className="px-4 py-2 text-slate-900">{deletedUser.deletedBy?.name || 'Unknown'} ({deletedUser.deletedBy?.role || 'N/A'})</td>
                                <td className="px-4 py-2">
                                  <button
                                    onClick={async () => {
                                      try {
                                        const result = await userService.restoreUser(deletedUser._id);
                                        if (result.success) {
                                          await fetchDeletedUsers();
                                          showSuccess('Student restored successfully 🔄');
                                        } else {
                                          showError('Failed to restore student: ' + result.error);
                                        }
                                      } catch (err) {
                                        showError('Error restoring student');
                                      }
                                    }}
                                    className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600 transition"
                                  >
                                    Restore
                                  </button>
                                </td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Deleted Users Pagination Controls */}
                    {deletedUsersPagination.totalPages > 1 && (
                        <div className="flex items-center justify-between mt-6">
                          <button
                            onClick={() => setDeletedUsersPage(deletedUsersPage - 1)}
                            disabled={deletedUsersPage === 1}
                            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl shadow-md transition disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            Previous
                          </button>

                          <div className="flex gap-2">
                            {Array.from({ length: deletedUsersPagination.totalPages }, (_, i) => (
                              <button
                                key={i}
                                onClick={() => setDeletedUsersPage(i + 1)}
                                className={`px-3 py-2 rounded-xl shadow-md transition ${
                                  deletedUsersPage === i + 1
                                    ? "bg-green-600 text-white dark:bg-green-500 dark:text-white"
                                    : "bg-gray-200 hover:bg-gray-300 text-gray-700 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-300"
                                }`}
                              >
                                {i + 1}
                              </button>
                            ))}
                          </div>

                          <button
                            onClick={() => setDeletedUsersPage(deletedUsersPage + 1)}
                            disabled={deletedUsersPage === deletedUsersPagination.totalPages}
                            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl shadow-md transition disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            Next
                          </button>
                        </div>
                      )}
                    )}
                  </>
                ) : (
                  <p className="text-gray-600 text-center py-8">No deleted students yet</p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Class Clear Reason History (Admin only) */}
        <div className="mt-12">
          <h3 className="text-2xl font-bold text-white mb-6">🧾 Teacher Class Clear Reasons</h3>
          <div className="bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-700">
            {classClearHistory.length > 0 ? (
              <>
                {/* Pagination Info */}
                <div className="text-sm text-gray-400 mb-4">
                  Showing {Math.min((classHistoryPage - 1) * itemsPerPage + 1, classClearHistory.length)} - {Math.min(classHistoryPage * itemsPerPage, classClearHistory.length)} of {classClearHistory.length} class clear records
                </div>

                <div className="overflow-x-auto max-h-[60vh]">
                  <table className="min-w-full table-auto">
                    <thead>
                      <tr className="bg-gray-700">
                        <th className="px-4 py-2 text-left text-gray-300">Class</th>
                        <th className="px-4 py-2 text-left text-gray-300">Teacher</th>
                        <th className="px-4 py-2 text-left text-gray-300">Reason</th>
                        <th className="px-4 py-2 text-left text-gray-300">Time</th>
                      </tr>
                    </thead>
                    <tbody>
                      {classHistoryPagination.currentClassHistory.map((entry, index) => (
                        <tr key={index} className="border-t border-gray-700 hover:bg-gray-700">
                          <td className="px-4 py-2 text-white font-medium">{entry.className}</td>
                          <td className="px-4 py-2 text-gray-300">{entry.teacher}</td>
                          <td className="px-4 py-2 text-gray-300 max-w-xs truncate" title={entry.reason}>{entry.reason}</td>
                          <td className="px-4 py-2 text-gray-300">{new Date(entry.timestamp).toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Class History Pagination Controls */}
                {classHistoryPagination.totalPages > 1 && (
                    <div className="flex items-center justify-between mt-6">
                      <button
                        onClick={() => setClassHistoryPage(classHistoryPage - 1)}
                        disabled={classHistoryPage === 1}
                        className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl shadow-md transition disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Previous
                      </button>

                      <div className="flex gap-2">
                        {Array.from({ length: classHistoryPagination.totalPages }, (_, i) => (
                          <button
                            key={i}
                            onClick={() => setClassHistoryPage(i + 1)}
                            className={`px-3 py-2 rounded-xl shadow-md transition ${
                              classHistoryPage === i + 1
                                ? "bg-green-600 text-white"
                                : "bg-gray-600 hover:bg-gray-500 text-gray-300"
                            }`}
                          >
                            {i + 1}
                          </button>
                        ))}
                      </div>

                      <button
                        onClick={() => setClassHistoryPage(classHistoryPage + 1)}
                        disabled={classHistoryPage === classHistoryPagination.totalPages}
                        className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl shadow-md transition disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Next
                      </button>
                    </div>
                  )}
                )}
              </>
            ) : (
              <p className="text-gray-400 text-center py-8">No class clear records yet</p>
            )}
          </div>
        </div>

        {/* Feedback Analytics Section */}
        <div className="mt-12">
          <h3 className="text-2xl font-bold text-white mb-6">📝 Feedback Analytics</h3>
          <div className="bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-700">
            {feedbackLoading ? (
              <SkeletonList items={3} />
            ) : feedbackError ? (
              <p className="text-red-500 text-center py-8">{feedbackError}</p>
            ) : feedback.length > 0 ? (
              <div className="space-y-6">
                {/* Summary Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-blue-900 rounded-lg p-4 border border-blue-700">
                    <p className="text-sm text-blue-300">Total Feedback</p>
                    <p className="text-2xl font-bold text-white">{feedback.length}</p>
                  </div>
                  <div className="bg-green-900 rounded-lg p-4 border border-green-700">
                    <p className="text-sm text-green-300">Average Rating</p>
                    <p className="text-2xl font-bold text-white">
                      {(feedback.reduce((sum, item) => sum + item.rating, 0) / feedback.length).toFixed(1)}
                    </p>
                  </div>
                  <div className="bg-purple-900 rounded-lg p-4 border border-purple-700">
                    <p className="text-sm text-purple-300">Teachers Rated</p>
                    <p className="text-2xl font-bold text-white">
                      {new Set(feedback.map(item => item.teacher?._id)).size}
                    </p>
                  </div>
                </div>

                {/* Teacher Performance */}
                <div>
                  <h4 className="text-lg font-semibold text-white mb-4">Teacher Performance</h4>
                  <div className="overflow-x-auto">
                    <table className="min-w-full table-auto">
                      <thead>
                        <tr className="bg-gray-700">
                          <th className="px-4 py-2 text-left text-gray-300">Teacher</th>
                          <th className="px-4 py-2 text-left text-gray-300">Avg Rating</th>
                          <th className="px-4 py-2 text-left text-gray-300">Feedback Count</th>
                          <th className="px-4 py-2 text-left text-gray-300">Rating Distribution</th>
                        </tr>
                      </thead>
                      <tbody>
                        {Object.entries(
                          feedback.reduce((acc, item) => {
                            const teacherId = item.teacher?._id;
                            const teacherName = item.teacher?.name || 'Unknown';
                            if (!acc[teacherId]) {
                              acc[teacherId] = { name: teacherName, ratings: [], count: 0 };
                            }
                            acc[teacherId].ratings.push(item.rating);
                            acc[teacherId].count++;
                            return acc;
                          }, {})
                        ).map(([teacherId, data]) => {
                          const avgRating = data.ratings.reduce((sum, r) => sum + r, 0) / data.ratings.length;
                          const ratingCounts = data.ratings.reduce((acc, r) => {
                            acc[r] = (acc[r] || 0) + 1;
                            return acc;
                          }, {});
                          return (
                            <tr key={teacherId} className="border-t border-gray-700 hover:bg-gray-700">
                              <td className="px-4 py-2 text-white font-medium">{data.name}</td>
                              <td className="px-4 py-2 text-yellow-400 font-semibold">
                                {avgRating.toFixed(1)} ⭐
                              </td>
                              <td className="px-4 py-2 text-gray-300">{data.count}</td>
                              <td className="px-4 py-2 text-gray-300">
                                {[5,4,3,2,1].map(rating => (
                                  <span key={rating} className="mr-2">
                                    {rating}⭐: {ratingCounts[rating] || 0}
                                  </span>
                                ))}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-gray-400 text-center py-8">No feedback data available yet</p>
            )}
          </div>
        </div>

        {/* Activity Logs Section */}
        <div className="mt-12">
          <h3 className="text-2xl font-bold text-white mb-6">📋 Activity Logs</h3>
          <div className="bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-700">
            {activityLogsLoading ? (
              <SkeletonTable rows={5} columns={5} />
            ) : activityLogsError ? (
              <p className="text-red-500 text-center py-8">{activityLogsError}</p>
            ) : activityLogs.length > 0 ? (
              <>
                {/* Pagination Info */}
                <div className="text-sm text-gray-400 mb-4">
                  Showing {Math.min((activityLogsPage - 1) * itemsPerPage + 1, activityLogs.length)} - {Math.min(activityLogsPage * itemsPerPage, activityLogs.length)} of {activityLogs.length} activity logs
                </div>

                <div className="overflow-x-auto max-h-[60vh]">
                  <table className="min-w-full table-auto">
                    <thead>
                      <tr className="bg-gray-700">
                        <th className="px-4 py-2 text-left text-gray-300">User</th>
                        <th className="px-4 py-2 text-left text-gray-300">Action</th>
                        <th className="px-4 py-2 text-left text-gray-300">Target</th>
                        <th className="px-4 py-2 text-left text-gray-300">Details</th>
                        <th className="px-4 py-2 text-left text-gray-300">Timestamp</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(() => {
                        // Calculate pagination for activity logs
                        const indexOfLast = activityLogsPage * itemsPerPage;
                        const indexOfFirst = indexOfLast - itemsPerPage;
                        const currentActivityLogs = activityLogs.slice(indexOfFirst, indexOfLast);

                        return currentActivityLogs.map((log, index) => (
                          <tr key={log._id || index} className="border-t border-gray-700 hover:bg-gray-700">
                            <td className="px-4 py-2 text-white font-medium">
                              {log.user?.name || 'Unknown'} ({log.user?.role || 'N/A'})
                            </td>
                            <td className="px-4 py-2 text-gray-300">
                              <span className={`px-2 py-1 rounded text-xs font-medium ${
                                log.action === 'DELETE_USER' ? 'bg-red-600 text-white' :
                                log.action === 'RESTORE_USER' ? 'bg-green-600 text-white' :
                                log.action === 'SUBMIT_FEEDBACK' ? 'bg-blue-600 text-white' :
                                log.action === 'SUBMIT_TASK' ? 'bg-purple-600 text-white' :
                                'bg-gray-600 text-white'
                              }`}>
                                {log.action.replace('_', ' ')}
                              </span>
                            </td>
                            <td className="px-4 py-2 text-gray-300">
                              {log.target?.name || log.target?.title || 'N/A'}
                            </td>
                            <td className="px-4 py-2 text-gray-300 max-w-xs truncate" title={log.details || 'No details'}>
                              {log.details || 'No details'}
                            </td>
                            <td className="px-4 py-2 text-gray-300">
                              {new Date(log.timestamp).toLocaleString()}
                            </td>
                          </tr>
                        ));
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Activity Logs Pagination Controls */}
                {activityLogsPagination.totalPages > 1 && (
                    <div className="flex items-center justify-between mt-6">
                      <button
                        onClick={() => setActivityLogsPage(activityLogsPage - 1)}
                        disabled={activityLogsPage === 1}
                        className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl shadow-md transition disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Previous
                      </button>

                      <div className="flex gap-2">
                        {Array.from({ length: activityLogsPagination.totalPages }, (_, i) => (
                          <button
                            key={i}
                            onClick={() => setActivityLogsPage(i + 1)}
                            className={`px-3 py-2 rounded-xl shadow-md transition ${
                              activityLogsPage === i + 1
                                ? "bg-green-600 text-white"
                                : "bg-gray-600 hover:bg-gray-500 text-gray-300"
                            }`}
                          >
                            {i + 1}
                          </button>
                        ))}
                      </div>

                      <button
                        onClick={() => setActivityLogsPage(activityLogsPage + 1)}
                        disabled={activityLogsPage === activityLogsPagination.totalPages}
                        className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl shadow-md transition disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Next
                      </button>
                    </div>
                  )}
                )}
              </>
            ) : (
              <p className="text-gray-400 text-center py-8">No activity logs available yet</p>
            )}
          </div>
        </div>

        {/* Announcements */}
        <div className="mt-8 bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-700">
          <h3 className="text-lg font-semibold text-white mb-4">School Announcements</h3>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300">Title</label>
                <input
                  type="text"
                  value={announcementTitle}
                  onChange={(e) => setAnnouncementTitle(e.target.value)}
                  className="mt-1 block w-full rounded-xl border border-gray-700 bg-gray-900 px-4 py-2 text-white shadow-sm focus:border-green-500 focus:outline-none"
                  placeholder="Announcement title"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300">Message</label>
                <textarea
                  value={announcementMessage}
                  onChange={(e) => setAnnouncementMessage(e.target.value)}
                  className="mt-1 block w-full rounded-xl border border-gray-700 bg-gray-900 px-4 py-2 text-white shadow-sm focus:border-green-500 focus:outline-none"
                  rows={4}
                  placeholder="Write your announcement here"
                />
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-300">Target</label>
                  <select
                    value={announcementTargetType}
                    onChange={(e) => setAnnouncementTargetType(e.target.value)}
                    className="mt-1 block w-full rounded-xl border border-gray-700 bg-gray-900 px-4 py-2 text-white shadow-sm focus:border-green-500 focus:outline-none"
                  >
                    <option value="school">Entire School</option>
                    <option value="class">Specific Class</option>
                  </select>
                </div>
                {announcementTargetType === 'class' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-300">Class</label>
                    <select
                      value={announcementClass}
                      onChange={(e) => setAnnouncementClass(e.target.value)}
                      className="mt-1 block w-full rounded-xl border border-gray-700 bg-gray-900 px-4 py-2 text-white shadow-sm focus:border-green-500 focus:outline-none"
                    >
                      <option value="">Select a class</option>
                      {classOptions.map((classItem) => (
                        <option key={classItem._id} value={classItem.name}>
                          {classItem.name}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
              <button
                onClick={handleSendAnnouncement}
                disabled={announcementSending}
                className="mt-4 inline-flex items-center justify-center rounded-xl bg-green-600 px-5 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {announcementSending ? 'Sending...' : 'Send Announcement'}
              </button>
            </div>
            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-white">Latest Announcements</h4>
              {announcements.length > 0 ? (
                <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                  {announcements.map((announcement) => (
                    <div key={announcement._id} className="rounded-2xl border border-gray-700 bg-gray-900 p-4">
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <h5 className="font-semibold text-white">{announcement.title}</h5>
                          <p className="text-xs text-gray-400">{announcement.targetType === 'class' ? `Class: ${announcement.className}` : 'All students'}</p>
                        </div>
                        <span className="text-xs text-gray-500">{new Date(announcement.createdAt).toLocaleDateString()}</span>
                      </div>
                      <p className="mt-2 text-gray-300">{announcement.message}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400">No announcements have been posted yet.</p>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
