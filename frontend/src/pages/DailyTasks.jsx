import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ModernSidebar from '../components/ModernSidebar';
import ModernTopNavbar from '../components/ModernTopNavbar';
import {
  ModernContainer,
  ModernCard,
  ModernButton,
  ModernSection,
} from '../components/ModernComponents';
import taskService from '../services/taskService';
import { useAuth } from '../context/AuthContext';

const DailyTasks = () => {
  const { user, refreshUser } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [completingTask, setCompletingTask] = useState(null);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    loadTodaysTasks();
  }, []);

  const loadTodaysTasks = async () => {
    try {
      setLoading(true);
      setError('');
      const result = await taskService.getTodaysTasks();
      if (result.success) {
        setTasks(result.tasks || []);
      } else {
        setError(result.error || 'Failed to load tasks');
      }
    } catch (err) {
      setError('Error loading tasks');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteTask = async (taskId, taskTitle, points) => {
    try {
      setCompletingTask(taskId);
      const result = await taskService.completeTask(taskId);

      if (result.success) {
        // Show confetti animation
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 2000);

        // Update task as completed
        setTasks(tasks.map(t =>
          t._id === taskId ? { ...t, completed: true } : t
        ));

        // Refresh user to update eco points and streak
        if (refreshUser) {
          await refreshUser();
        }

        // Show success notification
        alert(`✅ Great job! +${points} eco points earned!\n🔥 Streak: ${result.newStreak} days`);
      } else {
        alert(result.message || 'Failed to complete task');
      }
    } catch (err) {
      console.error('Error completing task:', err);
      alert('Error completing task. Please try again.');
    } finally {
      setCompletingTask(null);
    }
  };

  const completedCount = tasks.filter(t => t.completed).length;
  const progressPercentage = tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex flex-col">
      {/* Top Navbar */}
      <ModernTopNavbar />

      {/* Main Layout */}
      <div className="flex flex-1 pt-16">
        {/* Sidebar */}
        <ModernSidebar />

        {/* Main Content */}
        <main className="flex-1 overflow-auto pl-64">
          <ModernContainer className="py-8 space-y-8">
            {/* Header Section */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <ModernSection
                title="🌿 Daily Eco Tasks"
                subtitle="Complete tasks to earn eco-points and build a green habit!"
              />
            </motion.div>

            {/* Streak & Stats */}
            {user && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="grid grid-cols-2 gap-4 md:grid-cols-4"
              >
                <div className="bg-white rounded-lg p-4 shadow-md border-l-4 border-green-500">
                  <p className="text-sm text-gray-600 font-medium">Eco Points</p>
                  <p className="text-3xl font-bold text-green-600 mt-2">{user.ecoPoints}</p>
                </div>
                <div className="bg-white rounded-lg p-4 shadow-md border-l-4 border-red-500">
                  <p className="text-sm text-gray-600 font-medium">🔥 Streak</p>
                  <p className="text-3xl font-bold text-red-600 mt-2">{user.streak || 0}</p>
                </div>
                <div className="bg-white rounded-lg p-4 shadow-md border-l-4 border-blue-500">
                  <p className="text-sm text-gray-600 font-medium">Today Complete</p>
                  <p className="text-3xl font-bold text-blue-600 mt-2">{completedCount}/{tasks.length}</p>
                </div>
                <div className="bg-white rounded-lg p-4 shadow-md border-l-4 border-purple-500">
                  <p className="text-sm text-gray-600 font-medium">Progress</p>
                  <p className="text-3xl font-bold text-purple-600 mt-2">{progressPercentage}%</p>
                </div>
              </motion.div>
            )}

            {/* Progress Bar */}
            {tasks.length > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="w-full bg-gray-200 rounded-full h-4 overflow-hidden"
              >
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercentage}%` }}
                  transition={{ duration: 1, ease: 'easeOut' }}
                  className="bg-gradient-to-r from-green-400 to-emerald-600 h-full rounded-full"
                />
              </motion.div>
            )}

            {/* Loading State */}
            {loading && (
              <div className="flex items-center justify-center py-16">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-300 border-t-green-600" />
                <p className="ml-4 text-lg text-gray-600">Loading today's tasks...</p>
              </div>
            )}

            {/* Error State */}
            {error && !loading && (
              <div className="bg-red-50 border border-red-300 rounded-xl p-6 text-red-700">
                <p className="font-semibold">⚠️ Error Loading Tasks</p>
                <p className="text-sm mt-2">{error}</p>
                <ModernButton
                  variant="danger"
                  size="sm"
                  onClick={loadTodaysTasks}
                  className="mt-4"
                >
                  Try Again
                </ModernButton>
              </div>
            )}

            {/* Empty State */}
            {!loading && !error && tasks.length === 0 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <ModernCard>
                  <div className="text-center py-16">
                    <p className="text-5xl mb-4">🎉</p>
                    <p className="text-xl font-semibold text-gray-900">No Tasks Available Today</p>
                    <p className="text-gray-600 mt-2">Check back later for new eco tasks!</p>
                  </div>
                </ModernCard>
              </motion.div>
            )}

            {/* Tasks Grid */}
            {!loading && !error && tasks.length > 0 && (
              <motion.div
                layout
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {tasks.map((task, index) => (
                  <motion.div
                    key={task._id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.4 }}
                    whileHover={{ scale: 1.05 }}
                  >
                    <ModernCard className={`h-full flex flex-col ${task.completed ? 'opacity-75' : ''}`}>
                      {/* Card Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className={`text-xl font-bold ${task.completed ? 'text-gray-600 line-through' : 'text-gray-900'}`}>
                            {task.title}
                          </h3>
                          <p className="text-sm text-gray-600 mt-2">{task.description}</p>
                        </div>
                        {task.completed && (
                          <motion.span
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="text-3xl ml-2"
                          >
                            ✅
                          </motion.span>
                        )}
                      </div>

                      {/* Points Badge */}
                      <div className="mb-4">
                        <span className="inline-block px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold">
                          🌱 +{task.points} Eco Points
                        </span>
                      </div>

                      {/* Teacher Info */}
                      {task.createdBy && (
                        <p className="text-xs text-gray-500 mb-4">
                          By {task.createdBy.name}
                        </p>
                      )}

                      {/* Complete Button */}
                      <motion.div
                        className="mt-auto"
                        whileHover={!task.completed ? { scale: 1.02 } : {}}
                        whileTap={!task.completed ? { scale: 0.98 } : {}}
                      >
                        <ModernButton
                          variant={task.completed ? 'secondary' : 'primary'}
                          onClick={() => handleCompleteTask(task._id, task.title, task.points)}
                          disabled={task.completed || completingTask === task._id}
                          className="w-full"
                        >
                          {task.completed ? (
                            '✅ Completed'
                          ) : completingTask === task._id ? (
                            <span className="flex items-center justify-center">
                              <span className="animate-spin mr-2">⏳</span>
                              Completing...
                            </span>
                          ) : (
                            'Mark Complete →'
                          )}
                        </ModernButton>
                      </motion.div>
                    </ModernCard>
                  </motion.div>
                ))}
              </motion.div>
            )}

            {/* Confetti Effect */}
            {showConfetti && <Confetti />}
          </ModernContainer>
        </main>
      </div>
    </div>
  );
};

// Simple Confetti Component
const Confetti = () => {
  const confetti = Array.from({ length: 30 }, (_, i) => ({
    id: i,
    duration: 2 + Math.random() * 1,
    delay: Math.random() * 0.3,
    left: Math.random() * 100,
    rotation: Math.random() * 360,
  }));

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {confetti.map(item => (
        <motion.div
          key={item.id}
          initial={{
            opacity: 1,
            top: -10,
            left: `${item.left}%`,
            rotate: 0,
          }}
          animate={{
            opacity: 0,
            top: '100vh',
            rotate: item.rotation,
          }}
          transition={{
            duration: item.duration,
            delay: item.delay,
            ease: 'easeOut',
          }}
          className="fixed w-2 h-2 bg-yellow-400 rounded-full"
        />
      ))}
    </div>
  );
};

export default DailyTasks;
