import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import { DarkModeProvider } from './context/DarkModeContext';
import { ToastProvider } from './components/ToastNotification';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Register from './pages/Register';
import OTPVerification from './pages/OTPVerification';
import StudentDashboard from './pages/Dashboard/StudentDashboard';
import TeacherDashboard from './pages/Dashboard/TeacherDashboard';
import AdminDashboard from './pages/Dashboard/AdminDashboard';
import GameList from './pages/GameList';
import GamePlay from './pages/GamePlay';
import WasteSegregation from './pages/Games/WasteSegregation';
import QuizGame from './pages/Games/QuizGame';
import Leaderboard from './pages/Leaderboard';
import Achievements from './pages/Achievements';
import AIChat from './pages/AIChat';
import NotFound from './pages/NotFound';
import PendingApproval from './pages/PendingApproval';
import Tasks from './pages/Tasks';
import DailyTasks from './pages/DailyTasks';
import TaskReview from './pages/TaskReview';
import Unauthorized from './pages/Unauthorized';
import Forest from './pages/Forest';
import SuperAdminDashboard from './pages/Dashboard/SuperAdminDashboard';
import RewardShop from './pages/RewardShop';

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

function AppContent() {
  const location = useLocation();

  return (
    <DarkModeProvider>
      <AuthProvider>
        <NotificationProvider>
          <ToastProvider>
            <AnimatePresence mode="wait">
              <Routes location={location} key={location.pathname}>
                {/* Public Routes */}
                <Route path="/" element={
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <LandingPage />
                  </motion.div>
                } />
                <Route path="/login" element={
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Login />
                  </motion.div>
                } />
                <Route path="/register" element={
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Register />
                  </motion.div>
                } />
                <Route path="/otp-verification" element={
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <OTPVerification />
                  </motion.div>
                } />
                <Route path="/pending-approval" element={
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <PendingApproval />
                  </motion.div>
                } />

                {/* Protected Routes */}
                <Route
                  path="/student-dashboard"
                  element={
                    <ProtectedRoute role="student">
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.4 }}
                      >
                        <StudentDashboard />
                      </motion.div>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/games"
                  element={
                    <ProtectedRoute role="student">
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.4 }}
                      >
                        <GameList />
                      </motion.div>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/game-play/:gameId"
                  element={
                    <ProtectedRoute role="student">
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.4 }}
                      >
                        <GamePlay />
                      </motion.div>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/games/waste"
                  element={
                    <ProtectedRoute role="student">
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.4 }}
                      >
                        <WasteSegregation />
                      </motion.div>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/games/quiz"
                  element={
                    <ProtectedRoute role="student">
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.4 }}
                      >
                        <QuizGame />
                      </motion.div>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/leaderboard"
                  element={
                    <ProtectedRoute role={["student", "teacher"]}>
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.4 }}
                      >
                        <Leaderboard />
                      </motion.div>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/achievements"
                  element={
                    <ProtectedRoute role="student">
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.4 }}
                      >
                        <Achievements />
                      </motion.div>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/forest"
                  element={
                    <ProtectedRoute role="student">
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.4 }}
                      >
                        <Forest />
                      </motion.div>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/ai-chat"
                  element={
                    <ProtectedRoute>
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.4 }}
                      >
                        <AIChat />
                      </motion.div>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/tasks"
                  element={
                    <ProtectedRoute role="student">
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.4 }}
                      >
                        <Tasks />
                      </motion.div>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/daily-tasks"
                  element={
                    <ProtectedRoute role="student">
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.4 }}
                      >
                        <DailyTasks />
                      </motion.div>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/teacher-dashboard"
                  element={
                    <ProtectedRoute role="teacher">
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.4 }}
                      >
                        <TeacherDashboard />
                      </motion.div>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/task-review"
                  element={
                    <ProtectedRoute role="teacher">
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.4 }}
                      >
                        <TaskReview />
                      </motion.div>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin-dashboard"
                  element={
                    <ProtectedRoute role="admin">
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.4 }}
                      >
                        <AdminDashboard />
                      </motion.div>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/superadmin-dashboard"
                  element={
                    <ProtectedRoute role="superadmin">
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.4 }}
                      >
                        <SuperAdminDashboard />
                      </motion.div>
                    </ProtectedRoute>
                  }
                />

                {/* Error Routes */}
                <Route path="/unauthorized" element={
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Unauthorized />
                  </motion.div>
                } />
                <Route path="/404" element={
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <NotFound />
                  </motion.div>
                } />

                {/* Catch all - 404 */}
                <Route path="*" element={<Navigate to="/404" replace />} />
              </Routes>
            </AnimatePresence>
          </ToastProvider>
        </NotificationProvider>
      </AuthProvider>
    </DarkModeProvider>
  );
}

export default App;
