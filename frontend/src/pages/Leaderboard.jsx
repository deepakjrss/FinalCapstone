import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';

export default function Leaderboard() {
  const { token, user } = useAuth();
  const navigate = useNavigate();
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [type, setType] = useState('class'); // 'class' or 'school'

  // Protect route - only students and teachers
  useEffect(() => {
    if (user && !['student', 'teacher'].includes(user.role)) {
      navigate('/');
    }
  }, [user, navigate]);

  // Fetch leaderboard data
  const fetchLeaderboard = useCallback(async (leaderboardType) => {
    try {
      setLoading(true);
      setError(null);

      const response = await api.get(`/leaderboard?type=${leaderboardType}`);

      const data = response.data;
      setLeaderboard(data.leaderboard || []);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to load leaderboard');
      console.error('Error fetching leaderboard:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (token) {
      fetchLeaderboard(type);
    }
  }, [token, type, fetchLeaderboard]);

  // Auto refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (token) {
        fetchLeaderboard(type);
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [token, type, fetchLeaderboard]);

  // Get medal emoji for top 3
  const getMedalEmoji = (rank) => {
    switch (rank) {
      case 1:
        return '🥇';
      case 2:
        return '🥈';
      case 3:
        return '🥉';
      default:
        return null;
    }
  };

  // Get avatar initial
  const getAvatarInitial = (name) => {
    return name ? name.charAt(0).toUpperCase() : '?';
  };

  // Get gradient style for top 3
  const getGradientStyle = (rank) => {
    switch (rank) {
      case 1:
        return 'from-yellow-400 via-yellow-500 to-yellow-600';
      case 2:
        return 'from-gray-300 via-gray-400 to-gray-500';
      case 3:
        return 'from-orange-400 via-orange-500 to-orange-600';
      default:
        return 'from-green-50 to-green-100';
    }
  };

  // Check if current user
  const isCurrentUser = (name) => {
    return user && user.name === name;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 pt-20 pb-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12 text-center"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <span className="text-5xl">🏆</span>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              Leaderboard
            </h1>
            <span className="text-5xl">🏆</span>
          </div>
          <p className="text-gray-600 text-lg mt-2">
            Compete with your peers and climb the ranks! 🌍
          </p>
        </motion.div>

        {/* Toggle Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex justify-center mb-8"
        >
          <div className="bg-white rounded-xl p-1 shadow-lg border border-gray-200">
            <button
              onClick={() => setType('class')}
              className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
                type === 'class'
                  ? 'bg-green-600 text-white shadow-md'
                  : 'text-gray-600 hover:text-green-600'
              }`}
            >
              Class Leaderboard
            </button>
            <button
              onClick={() => setType('school')}
              className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
                type === 'school'
                  ? 'bg-green-600 text-white shadow-md'
                  : 'text-gray-600 hover:text-green-600'
              }`}
            >
              School Leaderboard
            </button>
          </div>
        </motion.div>

        {/* Loading State */}
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-20"
          >
            <div className="relative w-16 h-16 mb-6">
              <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full animate-spin" />
              <div className="absolute inset-2 bg-white rounded-full" />
            </div>
            <p className="text-gray-600 text-lg font-medium">Loading leaderboard...</p>
          </motion.div>
        )}

        {/* Error State */}
        {error && !loading && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-red-50 border-2 border-red-200 rounded-xl p-8 text-center"
          >
            <span className="text-4xl mb-4 block">❌</span>
            <h3 className="text-xl font-bold text-red-800 mb-2">Oops! Something went wrong</h3>
            <p className="text-red-600 mb-6">{error}</p>
            <button
              onClick={() => fetchLeaderboard(type)}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl shadow-md transition"
            >
              Try Again
            </button>
          </motion.div>
        )}

        {/* Empty State */}
        {!loading && !error && leaderboard.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-lg p-12 text-center border border-gray-100"
          >
            <span className="text-5xl mb-4 block">📊</span>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">No leaderboard data available</h3>
            <p className="text-gray-600">
              Students will appear here once they start earning ecoPoints.
            </p>
          </motion.div>
        )}

        {/* Leaderboard Cards */}
        {!loading && !error && leaderboard.length > 0 && (
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-4"
            >
              {leaderboard.map((entry, index) => {
                const medal = getMedalEmoji(entry.rank);
                const gradient = getGradientStyle(entry.rank);
                const isTopThree = entry.rank <= 3;
                const currentUser = isCurrentUser(entry.name);

                return (
                  <motion.div
                    key={`${type}-${entry.name}-${entry.rank}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{
                      duration: 0.5,
                      delay: index * 0.1,
                      type: "spring",
                      stiffness: 100
                    }}
                    whileHover={{ scale: 1.02 }}
                    className={`
                      bg-white rounded-xl shadow-lg border-2 overflow-hidden group
                      transition-all duration-300 cursor-pointer
                      ${currentUser ? 'ring-2 ring-green-500 ring-offset-2' : ''}
                      ${isTopThree ? `bg-gradient-to-r ${gradient} text-white border-yellow-300` : 'border-gray-200 hover:border-green-300'}
                    `}
                  >
                    <div className="p-6 flex items-center justify-between">
                      {/* Left: Rank and Avatar */}
                      <div className="flex items-center gap-4">
                        {/* Rank */}
                        <div className="flex-shrink-0">
                          {entry.rank === 1 && (
                            <span className="text-3xl">👑</span>
                          )}
                          {medal && (
                            <span className="text-3xl">{medal}</span>
                          )}
                          {!medal && !entry.rank === 1 && (
                            <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center font-bold text-gray-600">
                              {entry.rank}
                            </div>
                          )}
                        </div>

                        {/* Avatar */}
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg ${
                          isTopThree ? 'bg-white bg-opacity-20 text-white' : 'bg-green-100 text-green-800'
                        }`}>
                          {getAvatarInitial(entry.name)}
                        </div>

                        {/* Name and Badge */}
                        <div>
                          <h3 className={`text-xl font-bold ${
                            isTopThree ? 'text-white' : 'text-gray-900'
                          } ${currentUser ? 'font-extrabold' : ''}`}>
                            {entry.name}
                            {currentUser && <span className="ml-2 text-sm">(You)</span>}
                          </h3>
                          <div className="flex items-center gap-2">
                            <p className={`text-sm ${isTopThree ? 'text-white text-opacity-80' : 'text-gray-600'}`}>
                              Rank #{entry.rank}
                            </p>
                            {entry.topBadge && (
                              <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                                isTopThree
                                  ? 'bg-white bg-opacity-20 text-white'
                                  : 'bg-green-100 text-green-800'
                              }`}>
                                <span>{entry.topBadge.icon}</span>
                                <span>{entry.topBadge.name}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Right: EcoPoints */}
                      <div className="text-right">
                        <p className={`text-sm font-medium ${
                          isTopThree ? 'text-white text-opacity-80' : 'text-gray-600'
                        } mb-1`}>
                          EcoPoints
                        </p>
                        <p className={`text-3xl font-bold ${
                          isTopThree ? 'text-white' : 'bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent'
                        }`}>
                          {entry.ecoPoints}
                        </p>
                      </div>
                    </div>

                    {/* Top 3 Highlight */}
                    {isTopThree && (
                      <div className="h-1 bg-gradient-to-r from-yellow-300 via-yellow-400 to-yellow-300" />
                    )}
                  </motion.div>
                );
              })}
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
