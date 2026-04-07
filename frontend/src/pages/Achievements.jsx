import React, { useState, useEffect } from 'react';
import ModernSidebar from '../components/ModernSidebar';
import ModernTopNavbar from '../components/ModernTopNavbar';
import badgeService from '../services/badgeService';
import {
  ModernContainer,
  ModernGrid,
  ModernCard,
  ModernSection,
  ModernStatCard,
} from '../components/ModernComponents';
// removed unused modernDesignSystem and layoutConstants imports
const Achievements = () => {
  const [badges, setBadges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchBadges();
  }, []);

  const fetchBadges = async () => {
    try {
      setLoading(true);
      setError(null);

      const result = await badgeService.getBadgeProgress();

      if (result.success) {
        setBadges(result.data);
      } else {
        setError(result.error);
      }
    } catch (err) {
      console.error('Error fetching badges:', err);
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Top Navbar */}
      <ModernTopNavbar />

      {/* Main Layout */}
      <div className="flex flex-1 pt-16">
        {/* Sidebar */}
        <ModernSidebar />

        {/* Main Content */}
        <main className="flex-1 overflow-auto pl-64">
          <ModernContainer className="py-8 space-y-8">
            {/* Header */}
            <ModernSection
              title="🏆 Your Achievements"
              subtitle="Celebrate your eco-journey! Badges earned through games and eco-points."
            />

            {/* Loading State */}
            {loading && (
              <ModernCard>
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-300 border-t-green-600" />
                  <p className="ml-4 text-gray-600">Loading your achievements...</p>
                </div>
              </ModernCard>
            )}

            {/* Error State */}
            {error && !loading && (
              <ModernCard>
                <div className="bg-red-50 border border-red-300 rounded-lg p-6 text-red-700">
                  <p className="font-semibold">⚠️ {error}</p>
                  <button
                    onClick={fetchBadges}
                    className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Try Again
                  </button>
                </div>
              </ModernCard>
            )}

            {/* Empty State */}
            {!loading && !error && badges.length === 0 && (
              <ModernCard>
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">🌱</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No Achievements Yet</h3>
                  <p className="text-gray-600 mb-6">Start playing games and earning eco-points to unlock badges!</p>
                  <div className="inline-block bg-green-50 border border-green-200 rounded-lg p-4 text-left">
                    <p className="text-sm font-semibold text-green-900 mb-2">💡 How to earn badges:</p>
                    <ul className="text-sm text-gray-700 space-y-1">
                      <li>🎮 Play and complete games</li>
                      <li>💚 Earn eco-points from your performance</li>
                      <li>📈 Accumulate points to unlock achievements</li>
                    </ul>
                  </div>
                </div>
              </ModernCard>
            )}

            {/* Badges Grid */}
            {!loading && !error && badges.length > 0 && (
              <>
                <ModernSection
                  title={`Your Achievements (${badges.filter(b => b.earned).length}/${badges.length})`}
                  subtitle="Track your progress and unlock amazing badges!"
                >
                  <ModernGrid columns={3}>
                    {badges.map((badge) => {
                      const unlocked = badge.unlocked || badge.earned;
                      const statusLabel = badge.status || (unlocked ? 'Completed' : 'In Progress');
                      return (
                        <ModernCard
                          key={badge.badge._id}
                          interactive={!unlocked}
                          className={`transition-all duration-500 ${
                            unlocked
                              ? 'bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 border-green-300 shadow-lg hover:shadow-xl ring-2 ring-green-200 transform hover:scale-105 animate-pulse'
                              : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                          }`}>

                        {/* Top Bar - Different colors for earned/locked */}
                        <div className={`h-1 -mx-6 -mt-6 mb-4 rounded-t-lg ${
                          unlocked
                            ? 'bg-gradient-to-r from-green-400 via-emerald-500 to-teal-600 shadow-md'
                            : 'bg-gradient-to-r from-gray-300 to-gray-400'
                        }`} />

                        {/* Badge Icon - Enhanced styling for unlocked badges */}
                        <div className={`text-6xl mb-4 transform transition-all duration-500 ${
                          unlocked
                            ? 'hover:scale-110 drop-shadow-lg animate-bounce text-green-600 filter brightness-110'
                            : 'grayscale opacity-50'
                        }`}>
                          {badge.badge.icon}
                        </div>

                        {/* Badge Info */}
                        <h3 className={`text-lg font-bold mb-2 ${
                          unlocked ? 'text-green-800' : 'text-gray-500'
                        }`}>
                          {badge.badge.name}
                        </h3>

                        <p className={`text-sm mb-4 leading-relaxed ${
                          unlocked ? 'text-green-700' : 'text-gray-400'
                        }`}>
                          {badge.badge.description}
                        </p>

                        {/* Progress Bar for Locked Badges ONLY */}
                        {!unlocked && (
                          <div className="mb-4">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-xs font-semibold text-gray-500">
                                Progress: {Math.round(badge.progress)}%
                              </span>
                              <span className="text-xs text-gray-400">
                                {badge.badge.conditionType === 'ecoPoints' ? '💚 Eco Points' :
                                 badge.badge.conditionType === 'gamesPlayed' ? '🎮 Games' :
                                 badge.badge.conditionType === 'streak' ? '🔥 Streak' : 'Target'}
                              </span>
                            </div>
                            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                              <div
                                className="h-full bg-gradient-to-r from-blue-400 to-blue-600 transition-all duration-500 ease-out"
                                style={{ width: `${badge.progress}%` }}
                              />
                            </div>
                          </div>
                        )}

                        {/* Status Display */}
                        <div className={`mb-4 p-3 rounded-lg border ${
                          unlocked
                            ? 'bg-green-50 border-green-200 shadow-sm'
                            : 'bg-gray-50 border-gray-200'
                        }`}>
                          <div className="flex items-center justify-between">
                            <p className={`text-xs font-semibold ${
                              unlocked ? 'text-green-700' : 'text-gray-600'
                            }`}>
                              {badge.badge.conditionType === 'ecoPoints' && `💚 ${badge.badge.threshold} eco-points`}
                              {badge.badge.conditionType === 'gamesPlayed' && `🎮 ${badge.badge.threshold} games`}
                              {badge.badge.conditionType === 'streak' && `🔥 ${badge.badge.threshold}-day streak`}
                            </p>
                            <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                              unlocked
                                ? 'bg-green-500 text-white'
                                : 'bg-blue-500 text-white'
                            }`}>
                              {statusLabel}
                            </span>
                          </div>
                        </div>

                        {/* Footer */}
                        <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                          {unlocked ? (
                            <>
                              <span className="text-sm text-green-600 font-medium">
                                📅 {badge.earnedAt ? formatDate(badge.earnedAt) : 'Unlocked'}
                              </span>
                              <span className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-md">
                                ✅ Completed
                              </span>
                            </>
                          ) : (
                            <>
                              <span className="text-sm text-gray-400">
                                🔒 Locked
                              </span>
                              <span className="bg-gradient-to-r from-gray-400 to-gray-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                                ⏳ In Progress
                              </span>
                            </>
                          )}
                        </div>
                      </ModernCard>
                    )})}
                  </ModernGrid>
                </ModernSection>

                {/* Achievement Stats */}
                <ModernSection title="Achievement Stats">
                  <ModernGrid columns={3} responsive>
                    <ModernStatCard
                      icon="🏅"
                      label="Badges Earned"
                      value={badges.filter(b => b.earned).length}
                    />
                    <ModernStatCard
                      icon="🎯"
                      label="Total Badges"
                      value={badges.length}
                    />
                    <ModernStatCard
                      icon="📈"
                      label="Completion Rate"
                      value={`${Math.round((badges.filter(b => b.earned).length / badges.length) * 100)}%`}
                    />
                  </ModernGrid>
                </ModernSection>
              </>
            )}
          </ModernContainer>
        </main>
      </div>
    </div>
  );
};

export default Achievements;
