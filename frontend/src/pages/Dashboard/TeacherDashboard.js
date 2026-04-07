import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useDarkMode } from '../../context/DarkModeContext';
import { useToast } from '../../components/ToastNotification';
import analyticsService from '../../services/analyticsService';
import userService from '../../services/userService';
import taskService from '../../services/taskService';
import feedbackService from '../../services/feedbackService';
import chatService from '../../services/chatService';
import requestService from '../../services/requestService';
import announcementService from '../../services/announcementService';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { SkeletonStatCard, SkeletonTable, SkeletonList } from '../../components/Skeletons';

const TeacherDashboard = () => {
  const { user, logout } = useAuth();
  const { darkMode, toggleDarkMode } = useDarkMode();
  const { showSuccess, showError } = useToast();
  const navigate = useNavigate();

  const [overview, setOverview] = useState(null);
  const [topStudents, setTopStudents] = useState([]);
  const [engagement, setEngagement] = useState({ lowParticipation: [], activeStudents: [] });
  const [students, setStudents] = useState([]);
  const [games, setGames] = useState([]);
  const [classes, setClasses] = useState([]);
  const [classPerformance, setClassPerformance] = useState([]);
  const [ecoScoreTrend, setEcoScoreTrend] = useState([]);
  const [trendMode, setTrendMode] = useState('daily'); // 'daily' or 'weekly'
  const [announcements, setAnnouncements] = useState([]);
  const [announcementTitle, setAnnouncementTitle] = useState('');
  const [announcementMessage, setAnnouncementMessage] = useState('');
  const [announcementSending, setAnnouncementSending] = useState(false);
  const [deletedUsers, setDeletedUsers] = useState([]);
  const [showDeleted, setShowDeleted] = useState(false);
  const [activeSection, setActiveSection] = useState(null);
  const [selectedClass, setSelectedClass] = useState(null);
  const [classStudents, setClassStudents] = useState([]);
  const [classStudentsLoading, setClassStudentsLoading] = useState(false);
  const [classStudentsError, setClassStudentsError] = useState('');
  const [feedback, setFeedback] = useState([]);
  const [feedbackLoading, setFeedbackLoading] = useState(false);
  const [feedbackError, setFeedbackError] = useState('');
  const [clearReasonInput, setClearReasonInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteModal, setDeleteModal] = useState({ show: false, student: null });
  const [deleteReason, setDeleteReason] = useState('');
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Pending requests state
  const [pendingRequests, setPendingRequests] = useState([]);
  const [pendingRequestsLoading, setPendingRequestsLoading] = useState(false);

  // AI Task Generation state
  const [aiPrompt, setAiPrompt] = useState('');
  const [generatedTasks, setGeneratedTasks] = useState([]);
  const [aiGenerating, setAiGenerating] = useState(false);
  const [aiError, setAiError] = useState('');

  // Pagination state for class students
  const [currentPage, setCurrentPage] = useState(1);
  const studentsPerPage = 10;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleGenerateTasks = async () => {
    if (!aiPrompt.trim() || aiGenerating) return; // Prevent multiple calls

    setAiGenerating(true);
    setAiError('');
    setGeneratedTasks([]);

    try {
      // Use the existing chat service to generate tasks
      const prompt = `Generate 3-5 eco-friendly tasks for students based on this request: "${aiPrompt}". 
      Format each task with:
      - Title (brief, engaging)
      - Description (2-3 sentences explaining the task)
      - Points (eco points to award: 10-50 based on difficulty)
      - Category (e.g., recycling, energy, water, community)

      Make tasks realistic, measurable, and educational. Return as a structured list.`;

      const result = await chatService.sendMessage(prompt);

      if (result.success && result.data?.reply) {
        // Parse the AI response and format it as tasks
        const aiResponse = result.data.reply;
        // Simple parsing - in a real app you'd want more sophisticated parsing
        const tasks = parseGeneratedTasks(aiResponse);
        setGeneratedTasks(tasks);
      } else {
        setAiError('Failed to generate tasks. Please try again.');
      }
    } catch (err) {
      setAiError('AI service unavailable. Please try again later.');
      console.error('AI Task Generation Error:', err);
    } finally {
      setAiGenerating(false);
    }
  };

  const parseGeneratedTasks = (aiResponse) => {
    // Simple parsing logic - split by task markers and extract info
    const tasks = [];
    const lines = aiResponse.split('\n').filter(line => line.trim());

    let currentTask = null;
    for (const line of lines) {
      if (line.toLowerCase().includes('task') && line.includes(':')) {
        if (currentTask) tasks.push(currentTask);
        currentTask = { title: '', description: '', points: 20, category: 'General' };
      } else if (currentTask) {
        if (line.toLowerCase().includes('title:') || line.toLowerCase().includes('name:')) {
          currentTask.title = line.split(':')[1]?.trim() || line;
        } else if (line.toLowerCase().includes('description:') || line.toLowerCase().includes('details:')) {
          currentTask.description = line.split(':')[1]?.trim() || line;
        } else if (line.toLowerCase().includes('points:') || line.toLowerCase().includes('eco points:')) {
          const pointsMatch = line.match(/\d+/);
          currentTask.points = pointsMatch ? parseInt(pointsMatch[0]) : 20;
        } else if (line.toLowerCase().includes('category:')) {
          currentTask.category = line.split(':')[1]?.trim() || 'General';
        } else if (!currentTask.description && line.length > 10) {
          currentTask.description = line;
        }
      }
    }
    if (currentTask) tasks.push(currentTask);

    return tasks.length > 0 ? tasks : [{
      title: 'Sample Eco Task',
      description: aiResponse.substring(0, 200) + '...',
      points: 25,
      category: 'General'
    }];
  };

  const handleAddGeneratedTask = async (task) => {
    try {
      // Use the existing task service to create the task
      const taskData = {
        title: task.title,
        description: task.description,
        points: task.points,
        className: selectedClass || user.className // Use selected class or teacher's class
      };

      const response = await taskService.createTask(taskData);
      if (response.success) {
        showSuccess(`Task "${task.title}" created successfully! 📝`);

        // Invalidate analytics cache since data has changed
        analyticsService.invalidateAnalytics();

        await fetchDashboardData();
      } else {
        showError(response.error || 'Failed to add task.');
      }
    } catch (err) {
      console.error('Error adding task:', err);
      showError('Failed to add task. Please try again.');
    }
  };

  const handleSendAnnouncement = async () => {
    if (!announcementTitle.trim() || !announcementMessage.trim() || announcementSending) return;

    setAnnouncementSending(true);
    try {
      const result = await announcementService.createAnnouncement({
        title: announcementTitle,
        message: announcementMessage,
        targetType: 'class'
      });

      if (!result.success) {
        throw new Error(result.error || 'Failed to send announcement');
      }

      setAnnouncementTitle('');
      setAnnouncementMessage('');
      showSuccess('Announcement sent to your class successfully!');

      const refresh = await announcementService.getAnnouncements();
      if (refresh.success) setAnnouncements(refresh.data);
    } catch (err) {
      console.error('Error sending announcement:', err);
      showError(err.message || 'Failed to send announcement');
    } finally {
      setAnnouncementSending(false);
    }
  };

  const handleDeleteStudent = async (studentId) => {
    if (!studentId) return;

    setDeleteLoading(true);
    try {
      const result = await userService.deleteUser(studentId, deleteReason || 'Deleted by teacher');

      if (result.success) {
        // Invalidate user-related caches
        userService.invalidateUserCaches();
        analyticsService.invalidateAnalytics();

        await fetchDeletedUsers();
        setDeleteModal({ show: false, student: null });
        setDeleteReason('');
        showSuccess('Student moved to deleted list 🗑️');
      } else {
        showError('Failed to delete student: ' + (result.error || 'Unknown error'));
      }
    } catch (err) {
      console.error('Error deleting student:', err);
      showError('Error deleting student.');
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleRestoreUser = async (deletedUserId) => {
    try {
      const result = await userService.restoreUser(deletedUserId);
      if (result.success) {
        // Invalidate user-related caches
        userService.invalidateUserCaches();
        analyticsService.invalidateAnalytics();

        await fetchStudents();
        await fetchDeletedUsers();
        showSuccess('Student restored successfully 🔄');
      } else {
        showError('Failed to restore student: ' + result.error);
      }
    } catch (err) {
      showError('Error restoring student.');
    }
  };

  const fetchDashboardData = async () => {
    setLoading(true);
    setError('');
    console.log("TOKEN:", localStorage.getItem("token"));

    // Clear all analytics caches on page load to ensure fresh data
    analyticsService.invalidateAll();
    announcementService.invalidateAll();

    try {
      console.log('🔍 Fetching dashboard data...');
      const [overviewRes, topRes, engagementRes, studentsRes, gamesRes, classesRes, classPerfRes, ecoTrendRes, announcementsRes, deletedRes] = await Promise.all([
        analyticsService.getOverview(),
        analyticsService.getTopStudents(),
        analyticsService.getEngagement(),
        analyticsService.getStudents(),
        analyticsService.getGames(),
        analyticsService.getClasses(),
        analyticsService.getClassPerformance(),
        analyticsService.getEcoScoreTrend(),
        announcementService.getAnnouncements(),
        userService.getDeletedUsers()
      ]);

      console.log('🔍 API Results:', { overviewRes, topRes, engagementRes, studentsRes, gamesRes, classesRes, classPerfRes, ecoTrendRes, deletedRes });

      if (!overviewRes.success || !topRes.success || !engagementRes.success || !studentsRes.success || !gamesRes.success || !classesRes.success || !classPerfRes.success || !ecoTrendRes.success || !announcementsRes.success || !deletedRes.success) {
        const messages = [overviewRes, topRes, engagementRes, studentsRes, gamesRes, classesRes, classPerfRes, ecoTrendRes, announcementsRes, deletedRes]
          .filter((r) => r && !r.success)
          .map((r) => r.error || 'Unknown error');
        throw new Error(messages.join(' | '));
      }

      setOverview(overviewRes.data);
      setTopStudents(topRes.data);
      setEngagement(engagementRes.data);
      setStudents(studentsRes.data);
      setGames(gamesRes.data);
      setClasses(classesRes.data);
      setClassPerformance(classPerfRes.data);
      setEcoScoreTrend(ecoTrendRes.data);
      setAnnouncements(announcementsRes.data);
      setDeletedUsers(deletedRes.data);
    } catch (err) {
      console.error('❌ Dashboard error:', err);
      setError(err.message || 'Unable to load analytics');
    } finally {
      setLoading(false);
    }
  };

  const fetchStudents = async () => {
    const res = await analyticsService.getStudents();
    if (res.success) setStudents(res.data);
  };

  const fetchDeletedUsers = async () => {
    const res = await userService.getDeletedUsers();
    if (res.success) setDeletedUsers(res.data);
  };

  const fetchPendingRequests = async () => {
    setPendingRequestsLoading(true);
    const result = await requestService.getPendingRequests();
    if (result.success) {
      setPendingRequests(result.data);
    } else {
      showError(result.error);
    }
    setPendingRequestsLoading(false);
  };

  const approveRequest = async (requestId) => {
    const result = await requestService.approveRequest(requestId);
    if (result.success) {
      showSuccess('Student approved successfully! ✅');
      // Remove from pending list
      setPendingRequests(prev => prev.filter(request => request._id !== requestId));
      // Refresh students list
      fetchStudents();
    } else {
      showError(result.error);
    }
  };

  const rejectRequest = async (requestId) => {
    const result = await requestService.rejectRequest(requestId);
    if (result.success) {
      showSuccess('Request rejected');
      // Remove from pending list
      setPendingRequests(prev => prev.filter(request => request._id !== requestId));
    } else {
      showError(result.error);
    }
  };

  useEffect(() => {
    fetchDashboardData();
    fetchPendingRequests();
  }, []);

  // Separate feedback refresh to avoid scroll jump
  useEffect(() => {
    const interval = setInterval(async () => {
      const scrollY = window.scrollY;
      const result = await feedbackService.getTeacherFeedback();
      if (result.success) setFeedback(result.data);
      window.scrollTo(0, scrollY);
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  // Debounced AI task generation
  useEffect(() => {
    if (!aiPrompt.trim()) return;

    const timer = setTimeout(() => {
      // Auto-generate tasks when user stops typing for 2 seconds
      if (aiPrompt.length > 10 && !aiGenerating) {
        handleGenerateTasks();
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [aiPrompt]);

  const getForestStateBadge = (state) => {
    const badges = {
      healthy: { bg: 'bg-green-100', text: 'text-green-700', border: 'border-green-300' },
      growing: { bg: 'bg-yellow-100', text: 'text-yellow-700', border: 'border-yellow-300' },
      polluted: { bg: 'bg-red-100', text: 'text-red-700', border: 'border-red-300' },
    };
    const style = badges[state] || badges.polluted;
    return style;
  };

  const handleClassClick = async (cls) => {
    if (!cls || classStudentsLoading) return; // Prevent multiple calls

    setSelectedClass(cls);
    setCurrentPage(1); // Reset to first page when selecting a new class
    setClearReasonInput('');
    setClassStudents([]);
    setClassStudentsError('');
    setClassStudentsLoading(true);

    const studentsRes = await userService.getStudentsByClass(cls);
    if (studentsRes.success) {
      setClassStudents(studentsRes.data);
    } else {
      setClassStudentsError(studentsRes.error || 'Failed to load students for this class');
    }

    setClassStudentsLoading(false);
  };

  const handleClearSelection = () => {
    if (!clearReasonInput.trim()) {
      showError('Please provide a reason for clearing the selected class section');
      return;
    }

    const entry = {
      className: selectedClass,
      reason: clearReasonInput.trim(),
      teacher: user?.name || 'Unknown',
      timestamp: new Date().toISOString(),
    };

    const existing = JSON.parse(localStorage.getItem('classClearHistory') || '[]');
    localStorage.setItem('classClearHistory', JSON.stringify([entry, ...existing]));

    // Clear selection
    setSelectedClass(null);
    setClassStudents([]);
    setClearReasonInput('');
    setClassStudentsError('');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center px-4 transition-all duration-300">
        <div className="text-center p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-slate-200 dark:border-gray-700 transition-all duration-300">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 dark:border-emerald-500 mx-auto mb-4" />
          <p className="text-xl font-bold text-slate-800 dark:text-gray-100">Loading your analytics...</p>
          <p className="text-sm text-slate-500 dark:text-gray-400 mt-2">Gathering your class insights</p>
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
            <h1 className="text-4xl font-bold text-slate-900 dark:text-gray-100">EcoVerse</h1>
            {pendingRequests.length > 0 && (
              <div className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-semibold border border-yellow-200">
                🔔 Pending Requests ({pendingRequests.length})
              </div>
            )}
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={toggleDarkMode}
              className="px-4 py-2 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-700 transition-all duration-300 hover:scale-105"
            >
              {darkMode ? "☀️ Light" : "🌙 Dark"}
            </button>
            <button
              onClick={handleLogout}
              className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all duration-300 font-medium"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8 space-y-8 bg-gray-50 dark:bg-gray-900 transition-all duration-300">
        {/* Welcome Section */}
        <section className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-slate-200 dark:border-gray-700 p-8 transition-all duration-300 hover:shadow-lg">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-gray-100 mb-2">Welcome back, {user?.name} 👩‍🏫</h2>
          <p className="text-slate-600 dark:text-gray-300">Here's your comprehensive class performance and student engagement snapshot.</p>
        </section>

        {/* Pending Requests Section */}
        <section className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-slate-200 dark:border-gray-700 p-8 transition-all duration-300 hover:shadow-lg">
          <h3 className="text-2xl font-bold text-slate-900 dark:text-gray-100 mb-6">⏳ Pending Student Approvals</h3>

          {pendingRequestsLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
              <span className="ml-3 text-slate-600 dark:text-gray-300">Loading pending requests...</span>
            </div>
          ) : pendingRequests.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">✅</div>
              <p className="text-slate-600 dark:text-gray-300 text-lg">No pending student approvals</p>
              <p className="text-slate-500 dark:text-gray-500 text-sm">All students have been approved</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pendingRequests.map((request) => (
                <div key={request._id} className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-6 rounded-xl border border-blue-200 dark:border-blue-800 shadow-sm">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-xl mr-4">
                      👨‍🎓
                    </div>
                    <div>
                      <h4 className="text-slate-900 dark:text-gray-100 font-bold text-lg">{request.userId.name}</h4>
                      <p className="text-blue-600 dark:text-blue-400 text-sm">{request.userId.email}</p>
                      <p className="text-blue-500 dark:text-blue-300 text-xs capitalize">{request.role}</p>
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="text-slate-600 dark:text-gray-300 text-sm">
                      Requested: {new Date(request.createdAt).toLocaleDateString()}
                    </p>
                    <p className="text-slate-600 dark:text-gray-300 text-sm">
                      School: {request.school.name}
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => approveRequest(request._id)}
                      className="flex-1 bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300 hover:scale-105 shadow-sm"
                    >
                      ✅ Approve
                    </button>
                    <button
                      onClick={() => rejectRequest(request._id)}
                      className="flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300 hover:scale-105 shadow-sm"
                    >
                      ❌ Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {error && (
          <section className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 rounded-2xl p-6 transition-all duration-300">
            <p className="font-semibold">Unable to load analytics:</p>
            <p className="text-sm mt-1">{error}</p>
          </section>
        )}

        {/* Overview Stats Section */}
        <section>
          <h3 className="text-2xl font-bold text-slate-900 dark:text-gray-100 mb-6">Overview</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {loading ? (
              // Show skeleton cards while loading
              Array.from({ length: 4 }, (_, index) => (
                <SkeletonStatCard key={index} />
              ))
            ) : (
              // Show actual stats when loaded
              [
                {
                  title: 'Total Students',
                  value: overview?.totalStudents ?? 0,
                  icon: '👥',
                  bgGradient: 'from-emerald-500 to-emerald-600',
                  key: 'students',
                },
                {
                  title: 'Total Games Played',
                  value: overview?.totalGamesPlayed ?? 0,
                  icon: '🎮',
                  bgGradient: 'from-blue-500 to-blue-600',
                  key: 'games',
                },
                {
                  title: 'Avg EcoPoints',
                  value: (overview?.avgEcoPoints ?? 0).toFixed(1),
                  icon: '🌱',
                  bgGradient: 'from-amber-500 to-amber-600',
                  key: 'eco',
                },
                {
                  title: 'Classes Tracked',
                  value: overview?.classEcoScore?.length ?? 0,
                  icon: '🏫',
                  bgGradient: 'from-teal-500 to-teal-600',
                  key: 'classes',
                },
              ].map((stat) => (
                <article
                  key={stat.title}
                  className={`bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-slate-200 dark:border-gray-700 p-6 hover:shadow-lg hover:scale-105 hover:-translate-y-1 transition-all duration-300 cursor-pointer ${activeSection === stat.key ? 'ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-900/20 dark:ring-blue-400' : ''}`}
                  onClick={() => setActiveSection(stat.key)}
                >
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-4xl" role="img" aria-label={stat.title}>
                      {stat.icon}
                    </span>
                    <div className={`h-3 w-20 rounded-full bg-gradient-to-r ${stat.bgGradient}`} />
                  </div>
                  <p className="text-sm font-medium text-slate-600 dark:text-gray-400 mb-2">{stat.title}</p>
                  <p className="text-4xl font-bold text-slate-900 dark:text-gray-100">{stat.value}</p>
                </article>
              ))
            )}
          </div>
        </section>

        {/* AI Task Generation Section */}
        <section className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-slate-200 dark:border-gray-700 p-8 mt-8 transition-all duration-300 hover:shadow-lg">
          <div className="flex items-center gap-3 mb-6">
            <div className="text-3xl">🤖</div>
            <div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-gray-100">AI Task Generator</h3>
              <p className="text-slate-600 dark:text-gray-300">Generate personalized eco-tasks for your students</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-2">
                Describe the type of tasks you want to generate:
              </label>
              <textarea
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                placeholder="e.g., 'Create tasks about water conservation for middle school students' or 'Generate recycling activities for elementary kids'"
                className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                rows={3}
              />
            </div>

            <button
              onClick={handleGenerateTasks}
              disabled={aiGenerating || !aiPrompt.trim()}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              {aiGenerating ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Generating Tasks...
                </div>
              ) : (
                'Generate Tasks with AI'
              )}
            </button>

            {aiError && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {aiError}
              </div>
            )}

            {generatedTasks.length > 0 && (
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-slate-900 dark:text-gray-100">Generated Tasks:</h4>
                <div className="grid gap-4">
                  {generatedTasks.map((task, index) => (
                    <div key={index} className="border border-slate-200 rounded-lg p-4 bg-slate-50">
                      <div className="flex justify-between items-start mb-2">
                        <h5 className="font-semibold text-slate-900 dark:text-gray-100">{task.title}</h5>
                        <div className="flex gap-2">
                          <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm">
                            {task.points} points
                          </span>
                          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                            {task.category}
                          </span>
                        </div>
                      </div>
                      <p className="text-slate-700 mb-3">{task.description}</p>
                      <button
                        onClick={() => handleAddGeneratedTask(task)}
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded text-sm font-medium transition-colors"
                      >
                        Add to Tasks
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Detail View Section */}
        {activeSection && (
          <section className="transition-all duration-500 ease-in-out">
            <h3 className="text-2xl font-bold text-slate-900 dark:text-gray-100 mb-6">Details</h3>
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-slate-200 dark:border-gray-700 p-6 transition-all duration-300">
              {activeSection === 'students' && (
                <>
                  <h4 className="text-xl font-bold mb-4 text-slate-900 dark:text-gray-100">All Students</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {students.filter(s => s !== null).map(student => (
                      <div key={student?._id} className="p-4 border border-slate-200 dark:border-gray-600 rounded-lg hover:bg-slate-50 dark:hover:bg-gray-700 transition-colors relative bg-gray-50 dark:bg-gray-700">
                        <p className="font-semibold text-slate-900 dark:text-gray-100">{student?.name || 'Deleted User'}</p>
                        <p className="text-slate-600 dark:text-gray-300">Class: {student?.className || 'N/A'}</p>
                        <p className="text-emerald-600 dark:text-emerald-400 font-medium">EcoPoints: {student?.ecoPoints ?? 0}</p>
                        <button
                          onClick={() => setDeleteModal({ show: true, student })}
                          className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-xs hover:bg-red-600 transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    ))}
                  </div>
                </>
              )}
              {activeSection === 'games' && (
                <>
                  <h4 className="text-xl font-bold mb-4">Game Attempts</h4>
                  <div className="overflow-x-auto">
                    <table className="min-w-full table-auto">
                      <thead>
                        <tr className="bg-slate-50">
                          <th className="px-4 py-2 text-left text-slate-700">Student</th>
                          <th className="px-4 py-2 text-left text-slate-700">Game</th>
                          <th className="px-4 py-2 text-left text-slate-700">Score</th>
                        </tr>
                      </thead>
                      <tbody>
                        {games.filter(g => g !== null).map((game, index) => (
                          <tr key={index} className="border-t hover:bg-slate-50">
                            <td className="px-4 py-2 text-slate-900 dark:text-gray-100">{game?.studentName || 'Deleted User'}</td>
                            <td className="px-4 py-2 text-slate-900 dark:text-gray-100">{game?.gameName || 'N/A'}</td>
                            <td className="px-4 py-2 text-emerald-600 font-medium">{game?.score ?? 0}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
              )}
              {activeSection === 'eco' && (
                <>
                  <h4 className="text-xl font-bold mb-4">EcoPoints Breakdown</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {students.filter(s => s !== null).map(student => (
                      <div key={student?._id || student?.name} className="p-4 border rounded-lg hover:bg-slate-50 dark:hover:bg-gray-700 transition-colors border-slate-200 dark:border-gray-600">
                        <p className="font-semibold text-slate-900 dark:text-gray-100">{student?.name || 'Deleted User'}</p>
                        <p className="text-slate-600 dark:text-gray-400">Class: {student?.className || 'N/A'}</p>
                        <p className="text-emerald-600 font-medium">EcoPoints: {student?.ecoPoints ?? 0}</p>
                        <div className="w-full bg-slate-200 rounded-full h-2 mt-2">
                          <div
                            className="h-2 rounded-full bg-gradient-to-r from-emerald-400 to-emerald-600"
                            style={{ width: `${Math.min(((student?.ecoPoints ?? 0) / 500) * 100, 100)}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
              {activeSection === 'classes' && (
                <>
                  <h4 className="text-xl font-bold mb-4">Class-wise EcoScore</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {classes.filter(cls => cls !== null).map(cls => {
                      const badgeStyle = getForestStateBadge(cls?.forestState || 'none');
                      return (
                        <article
                          key={cls?._id || cls?.className}
                          className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-slate-200 dark:border-gray-600 p-6 hover:shadow-md transition-all duration-300"
                        >
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <h5 className="text-xl font-bold text-slate-900 dark:text-gray-100">{cls?.className || 'Class'}</h5>
                              <p className="text-3xl font-bold text-emerald-600 mt-2">{cls?.ecoScore ?? 0}</p>
                            </div>
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-semibold ${badgeStyle.bg} ${badgeStyle.text} border ${badgeStyle.border}`}
                            >
                              {(cls?.forestState || 'none').charAt(0).toUpperCase() + (cls?.forestState || 'none').slice(1)}
                            </span>
                          </div>
                          <div className="w-full bg-slate-200 rounded-full h-2">
                            <div
                              className="h-2 rounded-full bg-gradient-to-r from-emerald-400 to-emerald-600"
                              style={{ width: `${Math.min(((cls?.ecoScore ?? 0) / 500) * 100, 100)}%` }}
                            />
                          </div>
                        </article>
                      );
                    })}
                  </div>
                </>
              )}
            </div>
          </section>
        )}

        {selectedClass && (
          <section className="mt-8">
            <h3 className="text-2xl font-bold text-slate-900 dark:text-gray-100 mb-4">Students in {selectedClass}</h3>

            <div className="mb-4 p-4 bg-white dark:bg-gray-800 rounded-lg border border-slate-200 dark:border-gray-600 transition-all duration-300">
              <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-2">Reason for clearing this class section (required for teacher)</label>
              <div className="flex gap-2 items-center">
                <input
                  type="text"
                  value={clearReasonInput}
                  onChange={(e) => setClearReasonInput(e.target.value)}
                  placeholder="Enter a reason..."
                  className="flex-1 px-3 py-2 border border-slate-300 dark:border-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-gray-700 text-slate-900 dark:text-gray-100 transition-all duration-300"
                />
                <button
                  onClick={handleClearSelection}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 dark:hover:bg-red-800 transition disabled:opacity-60"
                  disabled={!clearReasonInput.trim()}
                >
                  Clear Selection
                </button>
              </div>
            </div>

            {classStudentsLoading ? (
              <SkeletonTable rows={5} columns={2} />
            ) : classStudentsError ? (
              <p className="text-red-500">{classStudentsError}</p>
            ) : classStudents.length ? (
              <>
                <div className="bg-white dark:bg-gray-800 rounded-2xl border border-slate-200 dark:border-gray-600 p-4">
                  {/* Pagination Info */}
                  <div className="mb-4 text-sm text-slate-600">
                    Showing {Math.min((currentPage - 1) * studentsPerPage + 1, classStudents.length)} - {Math.min(currentPage * studentsPerPage, classStudents.length)} of {classStudents.length} students
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {(() => {
                      // Calculate pagination
                      const indexOfLast = currentPage * studentsPerPage;
                      const indexOfFirst = indexOfLast - studentsPerPage;
                      const currentStudents = classStudents.slice(indexOfFirst, indexOfLast);

                      return currentStudents.map((student, index) => (
                        <div key={`${student.name}-${index}`} className="p-4 border rounded-lg hover:bg-slate-50 transition-colors">
                          <p className="font-semibold text-slate-900 dark:text-gray-100">{student.name}</p>
                          <p className="text-slate-600">EcoPoints: {student.ecoPoints ?? 0}</p>
                        </div>
                      ));
                    })()}
                  </div>
                </div>

                {/* Pagination Controls */}
                {(() => {
                  const totalPages = Math.ceil(classStudents.length / studentsPerPage);
                  if (totalPages <= 1) return null;

                  return (
                    <div className="flex items-center justify-between mt-4">
                      <button
                        onClick={() => setCurrentPage(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl shadow-md transition disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Previous
                      </button>

                      <div className="flex gap-2">
                        {Array.from({ length: totalPages }, (_, i) => (
                          <button
                            key={i}
                            onClick={() => setCurrentPage(i + 1)}
                            className={`px-3 py-2 rounded-xl shadow-md transition ${
                              currentPage === i + 1
                                ? "bg-green-600 text-white"
                                : "bg-gray-200 hover:bg-gray-300 text-gray-700"
                            }`}
                          >
                            {i + 1}
                          </button>
                        ))}
                      </div>

                      <button
                        onClick={() => setCurrentPage(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl shadow-md transition disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Next
                      </button>
                    </div>
                  );
                })()}
              </>
            ) : (
              <p className="text-slate-600">No students found for this class.</p>
            )}
          </section>
        )}

        {/* Class Performance Analytics - Advanced */}
        <section>
          <h3 className="text-2xl font-bold text-slate-900 dark:text-gray-100 mb-6">🏫 Class Performance Analytics</h3>
          <article className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-slate-200 dark:border-gray-600 p-6 transition-all duration-300">
            {classPerformance && classPerformance.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {classPerformance.map((cls, index) => {
                  // Determine performance level color
                  let performanceColor, performanceBg, performanceText, performanceIcon;
                  
                  if (cls.performanceLevel === 'high') {
                    performanceColor = 'from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/30';
                    performanceBg = 'bg-green-100 dark:bg-green-800/50';
                    performanceText = 'text-green-700 dark:text-green-300';
                    performanceIcon = '🔥';
                  } else if (cls.performanceLevel === 'medium') {
                    performanceColor = 'from-yellow-50 to-yellow-100 dark:from-yellow-900/30 dark:to-yellow-800/30';
                    performanceBg = 'bg-yellow-100 dark:bg-yellow-800/50';
                    performanceText = 'text-yellow-700 dark:text-yellow-300';
                    performanceIcon = '⚡';
                  } else {
                    performanceColor = 'from-red-50 to-red-100 dark:from-red-900/30 dark:to-red-800/30';
                    performanceBg = 'bg-red-100 dark:bg-red-800/50';
                    performanceText = 'text-red-700 dark:text-red-300';
                    performanceIcon = '📍';
                  }

                  return (
                    <div 
                      key={index} 
                      className={`bg-gradient-to-br ${performanceColor} p-6 rounded-xl border border-slate-200 dark:border-gray-700 shadow-sm hover:shadow-lg hover:scale-105 transition-all duration-300 cursor-pointer`}
                    >
                      {/* Header */}
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h4 className="text-lg font-bold text-slate-900 dark:text-gray-100">{cls.className}</h4>
                          <p className="text-xs text-slate-600 dark:text-gray-400 mt-1">Class Overview</p>
                        </div>
                        <div className={`text-2xl ${performanceBg} px-3 py-2 rounded-lg font-bold ${performanceText}`}>
                          {performanceIcon}
                        </div>
                      </div>

                      {/* Stats Grid */}
                      <div className="space-y-3 mb-4">
                        {/* Students */}
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-slate-600 dark:text-gray-400">👥 Students</span>
                          <span className="font-bold text-slate-900 dark:text-gray-100">{cls.studentCount || 0}</span>
                        </div>

                        {/* Average Score */}
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-slate-600 dark:text-gray-400">📊 Avg Score</span>
                          <span className="font-bold text-slate-900 dark:text-gray-100">{cls.averageEcoPoints?.toFixed(0) || 0}</span>
                        </div>

                        {/* Games Played */}
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-slate-600 dark:text-gray-400">🎮 Games</span>
                          <span className="font-bold text-slate-900 dark:text-gray-100">{cls.totalGamesPlayed || 0}</span>
                        </div>

                        {/* Top Student */}
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-slate-600 dark:text-gray-400">⭐ Top Student</span>
                          <span className="font-bold text-slate-900 dark:text-gray-100 truncate">{cls.topStudent || 'N/A'}</span>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div className="mt-4 pt-4 border-t border-slate-300 dark:border-gray-600">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-semibold text-slate-600 dark:text-gray-400">Performance Progress</span>
                          <span className={`text-xs font-bold ${performanceText}`}>{cls.performanceLevel?.toUpperCase()}</span>
                        </div>
                        <div className="w-full bg-slate-300 dark:bg-gray-600 rounded-full h-2.5 overflow-hidden">
                          <div
                            className={`h-2.5 rounded-full transition-all duration-500 ${
                              cls.performanceLevel === 'high' 
                                ? 'bg-gradient-to-r from-green-400 to-green-600'
                                : cls.performanceLevel === 'medium'
                                ? 'bg-gradient-to-r from-yellow-400 to-yellow-600'
                                : 'bg-gradient-to-r from-red-400 to-red-600'
                            }`}
                            style={{ width: `${Math.min(((cls.averageEcoPoints || 0) / 250) * 100, 100)}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-slate-500 text-center py-16">No class performance data available</p>
            )}
          </article>
        </section>

        {/* Eco Score Trend Section - Advanced */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-slate-900 dark:text-gray-100">📈 Eco Score Trend</h3>
            
            {/* Growth Badge */}
            {ecoScoreTrend?.weekly && (
              <div className={`px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2 ${
                ecoScoreTrend.weekly.growth > 0 
                  ? 'bg-green-100 text-green-700 border border-green-300' 
                  : ecoScoreTrend.weekly.growth < 0 
                  ? 'bg-red-100 text-red-700 border border-red-300' 
                  : 'bg-gray-100 text-gray-700 border border-gray-300'
              }`}>
                {ecoScoreTrend.weekly.growth > 0 ? '📈' : ecoScoreTrend.weekly.growth < 0 ? '📉' : '➡️'} 
                {Math.abs(ecoScoreTrend.weekly.growth)}%
              </div>
            )}
          </div>

          <article className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-slate-200 dark:border-gray-600 p-6 transition-all duration-300">
            {/* Mode Toggle */}
            <div className="flex gap-3 mb-6 bg-gray-100 dark:bg-gray-700 p-1 rounded-lg inline-flex">
              <button
                onClick={() => setTrendMode('daily')}
                className={`px-6 py-2 rounded-lg font-semibold transition-all duration-300 ${
                  trendMode === 'daily'
                    ? 'bg-blue-600 text-white shadow-md scale-105'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900'
                }`}
              >
                📅 Daily (7 days)
              </button>
              <button
                onClick={() => setTrendMode('weekly')}
                className={`px-6 py-2 rounded-lg font-semibold transition-all duration-300 ${
                  trendMode === 'weekly'
                    ? 'bg-blue-600 text-white shadow-md scale-105'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900'
                }`}
              >
                📊 Weekly
              </button>
            </div>

            {/* Chart */}
            {ecoScoreTrend && ecoScoreTrend.daily?.length > 0 ? (
              <>
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart 
                    data={trendMode === 'daily' ? ecoScoreTrend.daily : [
                      { date: 'This Week', score: ecoScoreTrend.weekly.thisWeek },
                      { date: 'Last Week', score: ecoScoreTrend.weekly.lastWeek }
                    ]}
                    margin={{ top: 20, right: 30, left: 0, bottom: 20 }}
                  >
                    <defs>
                      <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={1} />
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="date" stroke="#64748b" />
                    <YAxis stroke="#64748b" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#ffffff',
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                      }}
                      formatter={(value) => [value, trendMode === 'daily' ? 'Daily Score' : 'Weekly Total']}
                      labelFormatter={(label) => `${label}`}
                    />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="score" 
                      stroke="#3b82f6" 
                      dot={{ fill: '#3b82f6', r: 5 }}
                      activeDot={{ r: 7 }}
                      strokeWidth={3}
                      isAnimationActive={true}
                      name={trendMode === 'daily' ? 'Daily Score' : 'Weekly Total'}
                    />
                  </LineChart>
                </ResponsiveContainer>

                {/* Weekly Summary */}
                {ecoScoreTrend.weekly && (
                  <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-slate-200 dark:border-gray-700">
                    <div className="text-center">
                      <p className="text-sm text-slate-600 dark:text-gray-400 mb-1">This Week</p>
                      <p className="text-2xl font-bold text-blue-600">{ecoScoreTrend.weekly.thisWeek}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-slate-600 dark:text-gray-400 mb-1">Last Week</p>
                      <p className="text-2xl font-bold text-slate-900 dark:text-gray-100">{ecoScoreTrend.weekly.lastWeek}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-slate-600 dark:text-gray-400 mb-1">Trend</p>
                      <p className={`text-2xl font-bold ${
                        ecoScoreTrend.weekly.growth > 0 
                          ? 'text-green-600' 
                          : ecoScoreTrend.weekly.growth < 0 
                          ? 'text-red-600' 
                          : 'text-gray-600'
                      }`}>
                        {ecoScoreTrend.weekly.growth > 0 ? '+' : ''}{ecoScoreTrend.weekly.growth}%
                      </p>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <p className="text-slate-500 text-center py-16">📊 No trend data available yet</p>
            )}
          </article>
        </section>

        {/* Announcements for Teacher */}
        <section className="mt-10">
          <h3 className="text-2xl font-bold text-slate-900 dark:text-gray-100 mb-6">📣 Class Announcements</h3>
          <article className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-slate-200 dark:border-gray-600 p-6 transition-all duration-300">
            <div className="grid grid-cols-1 xl:grid-cols-[1fr_380px] gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-2">Announcement Title</label>
                  <input
                    type="text"
                    value={announcementTitle}
                    onChange={(e) => setAnnouncementTitle(e.target.value)}
                    className="w-full rounded-2xl border border-slate-300 dark:border-gray-700 bg-slate-50 dark:bg-gray-900 p-3 text-slate-900 dark:text-gray-100 focus:border-blue-500 focus:outline-none"
                    placeholder="Enter a short headline"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-2">Message</label>
                  <textarea
                    value={announcementMessage}
                    onChange={(e) => setAnnouncementMessage(e.target.value)}
                    rows={5}
                    className="w-full rounded-2xl border border-slate-300 dark:border-gray-700 bg-slate-50 dark:bg-gray-900 p-3 text-slate-900 dark:text-gray-100 focus:border-blue-500 focus:outline-none"
                    placeholder="Write your class announcement here"
                  />
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <p className="text-sm text-slate-500 dark:text-gray-400">This announcement will be delivered to your class only.</p>
                  <button
                    type="button"
                    onClick={handleSendAnnouncement}
                    disabled={announcementSending || !announcementTitle.trim() || !announcementMessage.trim()}
                    className="px-5 py-3 bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-2xl font-semibold transition"
                  >
                    {announcementSending ? 'Sending…' : 'Send Announcement'}
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-slate-50 dark:bg-gray-900 rounded-2xl p-5 border border-slate-200 dark:border-gray-700">
                  <h4 className="text-lg font-semibold text-slate-900 dark:text-gray-100 mb-4">Recent Announcements</h4>
                  {announcements?.length > 0 ? (
                    <div className="space-y-3">
                      {announcements.slice(0, 4).map((announcement) => (
                        <div key={announcement._id} className="rounded-2xl border border-slate-200 dark:border-gray-700 p-4 bg-white dark:bg-gray-800 shadow-sm">
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <p className="text-sm font-semibold text-slate-900 dark:text-gray-100">{announcement.title}</p>
                              <p className="text-xs text-slate-500 dark:text-gray-400 mt-1">{announcement.targetType === 'school' ? 'School-wide' : 'Class announcement'}</p>
                            </div>
                            <span className="text-xs text-slate-400">{new Date(announcement.createdAt).toLocaleDateString()}</span>
                          </div>
                          <p className="mt-3 text-sm text-slate-600 dark:text-gray-300">{announcement.message}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-10 text-slate-500 dark:text-gray-400">
                      No announcements yet. Send the first message to your class.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </article>
        </section>

        {/* Top Students + Engagement */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Students */}
          <article className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-slate-200 dark:border-gray-600 p-6 transition-all duration-300">
            <h3 className="text-xl font-bold text-slate-900 dark:text-gray-100 mb-6">🏆 Top Students</h3>
            <div className="space-y-3">
              {topStudents?.filter(s => s !== null).length > 0 ? (
                topStudents.filter(s => s !== null).map((student, index) => {
                  const validStudents = topStudents.filter(s => s !== null);
                  const topValue = Math.max(...validStudents.map((s) => s?.ecoPoints ?? 0), 1);
                  return (
                    <div
                      key={student?._id || student?.name + index}
                      className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200 hover:shadow-md transition-all duration-300"
                    >
                      <div className="flex justify-between items-center mb-2">
                        <div className="flex items-center gap-3">
                          <span className="text-lg font-bold text-blue-600 w-8 h-8 rounded-full bg-blue-200 flex items-center justify-center">
                            {index + 1}
                          </span>
                          <p className="font-semibold text-slate-900">{student?.name || 'Deleted User'}</p>
                        </div>
                        <span className="text-sm font-bold text-blue-700 bg-blue-200 px-3 py-1 rounded-full">
                          {student?.ecoPoints ?? 0} pts
                        </span>
                      </div>
                      <div className="w-full h-2 bg-blue-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-blue-400 to-blue-600 rounded-full transition-all duration-500"
                          style={{ width: `${((student?.ecoPoints ?? 0) / topValue) * 100}%` }}
                        />
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="text-slate-500 text-center py-6">No student data available</p>
              )}
            </div>
          </article>

          {/* Student Engagement */}
          <article className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-slate-200 dark:border-gray-600 p-6 transition-all duration-300">
            <h3 className="text-xl font-bold text-slate-900 dark:text-gray-100 mb-6">📊 Student Engagement</h3>

            <div className="space-y-6">
              {/* Low Participation */}
              <div>
                <h4 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-red-500" />
                  Low Participation (<span className="text-red-600">50</span> pts)
                </h4>
                {engagement.lowParticipation?.filter(s => s !== null).length > 0 ? (
                  <div className="space-y-2">
                    {engagement.lowParticipation.filter(s => s !== null).slice(0, 5).map((student) => (
                      <div
                        key={student?._id || student?.name}
                        className="flex justify-between items-center bg-red-50 px-4 py-2 rounded-lg border border-red-200 hover:shadow-sm transition-all"
                      >
                        <span className="text-slate-700">{student?.name || 'Deleted User'}</span>
                        <span className="font-bold text-red-600">{student?.ecoPoints ?? 0}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-slate-500 text-sm">No low participation students.</p>
                )}
              </div>

              {/* Active Students */}
              <div>
                <h4 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-green-500" />
                  Active Students ({'>'}200 pts)
                </h4>
                {engagement.activeStudents?.filter(s => s !== null).length > 0 ? (
                  <div className="space-y-2">
                    {engagement.activeStudents.filter(s => s !== null).slice(0, 5).map((student) => (
                      <div
                        key={student?._id || student?.name}
                        className="flex justify-between items-center bg-green-50 px-4 py-2 rounded-lg border border-green-200 hover:shadow-sm transition-all"
                      >
                        <span className="text-slate-700">{student?.name || 'Deleted User'}</span>
                        <span className="font-bold text-green-600">{student?.ecoPoints ?? 0}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-slate-500 text-sm">No active students at this threshold.</p>
                )}
              </div>
            </div>
          </article>
        </section>

        {/* Deleted Students Launcher */}
        <section className="mb-6">
          <button
            onClick={() => setShowDeleted(true)}
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
          >
            View Deleted Students 🗑️
          </button>
        </section>

        {/* Feedback Section */}
        <section>
          <h3 className="text-2xl font-bold text-slate-900 dark:text-gray-100 mb-6">📝 Student Feedback</h3>
          <article className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-slate-200 dark:border-gray-600 p-6 transition-all duration-300">
            {feedbackLoading ? (
              <SkeletonList items={3} />
            ) : feedbackError ? (
              <p className="text-red-500 text-center py-8">{feedbackError}</p>
            ) : feedback.length > 0 ? (
              <div className="space-y-4">
                {/* Average Rating */}
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-lg font-semibold text-slate-900 dark:text-gray-100">Average Rating</h4>
                      <p className="text-sm text-slate-600 dark:text-gray-400">Based on {feedback.length} feedback{feedback.length !== 1 ? 's' : ''}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold text-blue-600">
                        {feedback.reduce((sum, item) => sum + item.rating, 0) / feedback.length}
                      </div>
                      <div className="flex text-yellow-400 text-lg">
                        {'⭐'.repeat(Math.round(feedback.reduce((sum, item) => sum + item.rating, 0) / feedback.length))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Individual Feedback */}
                <div className="space-y-3">
                  <h4 className="text-lg font-semibold text-slate-900 dark:text-gray-100">Recent Feedback</h4>
                  {feedback.map((item, index) => (
                    <div key={index} className="bg-slate-50 dark:bg-gray-700 rounded-lg p-4 border border-slate-200 dark:border-gray-600">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-slate-900 dark:text-gray-100">{item.student?.name || 'Anonymous'}</span>
                          <span className="text-sm text-slate-500 dark:text-gray-400">•</span>
                          <span className="text-sm text-slate-500 dark:text-gray-400">
                            {new Date(item.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="text-yellow-400 text-lg">
                            {'⭐'.repeat(item.rating)}
                          </span>
                          <span className="text-sm font-medium text-slate-700 dark:text-gray-300 ml-1">
                            {item.rating}/5
                          </span>
                        </div>
                      </div>
                      {item.comment && (
                        <p className="text-slate-700 dark:text-gray-300 text-sm leading-relaxed">{item.comment}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-slate-500 dark:text-gray-400 text-lg">No feedback received yet</p>
                <p className="text-slate-400 dark:text-gray-500 text-sm mt-2">Feedback from your students will appear here</p>
              </div>
            )}
          </article>
        </section>

        {/* Footer Spacing */}
        <div className="h-8" />
      </main>

      {/* Deleted Students Modal */}
      {showDeleted && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl w-[800px] max-h-[80vh] overflow-y-auto relative border border-slate-200 dark:border-gray-600 transition-all duration-300">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-slate-900 dark:text-gray-100">Deleted Students 🗑️</h2>
              <button onClick={() => setShowDeleted(false)} className="text-xl font-bold text-slate-900 dark:text-gray-100 hover:text-red-600 dark:hover:text-red-400 transition">❌</button>
            </div>

            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 dark:border-gray-600">
                  <th className="text-left pb-2 text-slate-900 dark:text-gray-100">Name</th>
                  <th className="text-left pb-2 text-slate-900 dark:text-gray-100">Class</th>
                  <th className="text-left pb-2 text-slate-900 dark:text-gray-100">Reason</th>
                  <th className="text-left pb-2 text-slate-900 dark:text-gray-100">Deleted By</th>
                  <th className="text-left pb-2 text-slate-900 dark:text-gray-100">Action</th>
                </tr>
              </thead>
              <tbody>
                {deletedUsers.map((u) => (
                  <tr key={u._id} className="border-t border-slate-200 dark:border-gray-600 hover:bg-slate-50 dark:hover:bg-gray-700 transition">
                    <td className="py-2 text-slate-900 dark:text-gray-100">{u.name}</td>
                    <td className="py-2 text-slate-900 dark:text-gray-100">{u.className}</td>
                    <td className="py-2 text-slate-900 dark:text-gray-100">{u.reason || 'N/A'}</td>
                    <td className="py-2 text-slate-900 dark:text-gray-100">{u.deletedBy?.name || 'Unknown'} ({u.deletedBy?.role || 'N/A'})</td>
                    <td className="py-2">
                      <button
                        onClick={() => handleRestoreUser(u._id)}
                        className="bg-green-500 hover:bg-green-600 dark:hover:bg-green-700 text-white px-2 py-1 rounded transition"
                      >
                        Restore
                      </button>
                    </td>
                  </tr>
                ))}
                {deletedUsers.length === 0 && (
                  <tr>
                    <td colSpan={4} className="py-4 text-center text-slate-500">No deleted students yet</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Delete Student Modal */}
      {deleteModal.show && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-md w-full mx-4 border border-slate-200 dark:border-gray-600 transition-all duration-300">
            <h3 className="text-xl font-bold text-slate-900 dark:text-gray-100 mb-4">Delete Student</h3>
            <p className="text-slate-600 dark:text-gray-400 mb-4">
              Are you sure you want to delete <strong className="text-slate-900 dark:text-gray-100">{deleteModal.student?.name || 'User Removed'}</strong>?
            </p>
            <div className="mb-4">
              <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-2">
                Reason for deletion (required)
              </label>
              <textarea
                value={deleteReason}
                onChange={(e) => setDeleteReason(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows="3"
                placeholder="Enter the reason for deleting this student..."
                required
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteModal({ show: false, student: null })}
                className="flex-1 px-4 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition-colors"
                disabled={deleteLoading}
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteStudent}
                className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50"
                disabled={deleteLoading || !deleteReason.trim()}
              >
                {deleteLoading ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherDashboard;
