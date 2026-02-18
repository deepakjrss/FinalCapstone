import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Leaderboard() {
  const { token, user } = useAuth();
  const navigate = useNavigate();
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Protect route - only students and teachers
  useEffect(() => {
    if (user && !['student', 'teacher'].includes(user.role)) {
      navigate('/');
    }
  }, [user, navigate]);

  // Fetch leaderboard data
  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        setLoading(true);
        setError(null);

        console.log('Fetching leaderboard with token:', token ? 'Present' : 'Missing');

        const response = await fetch(
          'http://localhost:5000/api/leaderboard',
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        );

        console.log('Response status:', response.status);

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          const errorMsg = errorData.message || `Server error (${response.status})`;
          throw new Error(errorMsg);
        }

        const data = await response.json();
        console.log('Leaderboard data received:', data);
        setLeaderboard(data.leaderboard || []);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching leaderboard:', err);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchLeaderboard();
    }
  }, [token]);

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

  // Get forest state color and styling
  const getForestStateStyle = (state) => {
    switch (state) {
      case 'healthy':
        return {
          bg: 'bg-green-100',
          text: 'text-green-800',
          badge: 'bg-green-200',
          emoji: '🌳'
        };
      case 'growing':
        return {
          bg: 'bg-emerald-100',
          text: 'text-emerald-800',
          badge: 'bg-emerald-200',
          emoji: '🌱'
        };
      case 'polluted':
        return {
          bg: 'bg-gray-100',
          text: 'text-gray-800',
          badge: 'bg-gray-200',
          emoji: '🌍'
        };
      default:
        return {
          bg: 'bg-gray-100',
          text: 'text-gray-800',
          badge: 'bg-gray-200',
          emoji: '🌍'
        };
    }
  };

  // Get medal color styling for top 3
  const getMedalStyle = (rank) => {
    switch (rank) {
      case 1:
        return 'bg-gradient-to-br from-yellow-300 to-yellow-500 text-yellow-900';
      case 2:
        return 'bg-gradient-to-br from-gray-300 to-gray-400 text-gray-900';
      case 3:
        return 'bg-gradient-to-br from-orange-300 to-orange-500 text-orange-900';
      default:
        return 'bg-gradient-to-br from-green-50 to-green-100 text-green-800';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 pt-20 pb-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="mb-12 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <span className="text-5xl">🏆</span>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              Class Leaderboard
            </h1>
            <span className="text-5xl">🏆</span>
          </div>
          <p className="text-gray-600 text-lg mt-2">
            See how your class is performing in the eco-challenge! 🌍
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="relative w-16 h-16 mb-6">
              <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full animate-spin" />
              <div className="absolute inset-2 bg-white rounded-full" />
            </div>
            <p className="text-gray-600 text-lg font-medium">Loading leaderboard...</p>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="bg-red-50 border-2 border-red-200 rounded-xl p-8 text-center">
            <span className="text-4xl mb-4 block">❌</span>
            <h3 className="text-xl font-bold text-red-800 mb-2">Oops! Something went wrong</h3>
            <p className="text-red-600 mb-6">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all duration-300 font-semibold"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && leaderboard.length === 0 && (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center border border-gray-100">
            <span className="text-5xl mb-4 block">📊</span>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">No Classes Yet</h3>
            <p className="text-gray-600">
              Classes will appear here once they complete eco-activities.
            </p>
          </div>
        )}

        {/* Leaderboard Cards */}
        {!loading && !error && leaderboard.length > 0 && (
          <div className="space-y-4">
            {leaderboard.map((entry, index) => {
              const stateStyle = getForestStateStyle(entry.forestState);
              const medal = getMedalEmoji(entry.rank);
              const medalStyle = getMedalStyle(entry.rank);
              const isTopThree = entry.rank <= 3;

              return (
                <div
                  key={entry.className}
                  className={`
                    transform transition-all duration-300 hover:scale-102 hover:shadow-xl
                    rounded-xl border-2 overflow-hidden cursor-pointer group
                    ${
                      isTopThree
                        ? `${medalStyle} border-yellow-200 shadow-lg`
                        : 'bg-white border-gray-200 shadow-md hover:border-green-300'
                    }
                  `}
                >
                  {/* Card Content */}
                  <div className="p-6 flex items-center justify-between">
                    {/* Left: Rank and Class Info */}
                    <div className="flex items-center gap-6 flex-1">
                      {/* Rank Circle */}
                      <div
                        className={`
                          flex-shrink-0 w-14 h-14 rounded-full flex items-center justify-center
                          font-bold text-lg transition-transform duration-300 group-hover:scale-110
                          ${medalStyle} ${isTopThree ? 'shadow-lg' : 'bg-gray-100 text-gray-800'}
                        `}
                      >
                        {medal || entry.rank}
                      </div>

                      {/* Class Info */}
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-900 via-current transition-colors">
                          {entry.className}
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">
                          {entry.rank === 1 && '🎯 Eco Champions!'}
                          {entry.rank === 2 && '🌟 Strong Performers'}
                          {entry.rank === 3 && '⭐ Rising Stars'}
                          {entry.rank > 3 && `#${entry.rank} in rankings`}
                        </p>
                      </div>
                    </div>

                    {/* Center: Eco Score */}
                    <div className="flex-shrink-0 mx-6 text-center">
                      <p className="text-sm font-medium text-gray-600 mb-1">Eco Score</p>
                      <p className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                        {entry.ecoScore}
                      </p>
                    </div>

                    {/* Right: Forest State Badge */}
                    <div className="flex-shrink-0">
                      <div
                        className={`
                          px-4 py-2 rounded-full font-semibold flex items-center gap-2
                          transition-all duration-300 group-hover:scale-105
                          ${stateStyle.bg} ${stateStyle.text}
                        `}
                      >
                        <span className="text-lg">{stateStyle.emoji}</span>
                        <span className="capitalize text-sm">{entry.forestState}</span>
                      </div>
                    </div>
                  </div>

                  {/* Top 3 Highlight */}
                  {isTopThree && (
                    <div className="h-1 bg-gradient-to-r from-yellow-300 via-yellow-400 to-yellow-300" />
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Stats Footer */}
        {!loading && !error && leaderboard.length > 0 && (
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Total Classes */}
            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200 text-center hover:shadow-lg transition-shadow">
              <p className="text-gray-600 text-sm font-medium mb-2">Total Classes</p>
              <p className="text-4xl font-bold text-green-600">{leaderboard.length}</p>
            </div>

            {/* Top Class */}
            <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl shadow-md p-6 border-2 border-yellow-200 text-center">
              <p className="text-gray-600 text-sm font-medium mb-2">🥇 Top Class</p>
              <p className="text-2xl font-bold text-yellow-800">{leaderboard[0]?.className}</p>
              <p className="text-sm text-yellow-700 mt-1">{leaderboard[0]?.ecoScore} points</p>
            </div>

            {/* Healthy Forests */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-100 rounded-xl shadow-md p-6 border-2 border-green-200 text-center">
              <p className="text-gray-600 text-sm font-medium mb-2">🌳 Healthy Forests</p>
              <p className="text-4xl font-bold text-green-600">
                {leaderboard.filter((e) => e.forestState === 'healthy').length}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
