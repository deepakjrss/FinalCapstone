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
import { modernDesignSystem, layoutConstants } from '../theme/modernDesignSystem';

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

      const result = await badgeService.getMyBadges();

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
                  title={`Earned Badges (${badges.length})`}
                  subtitle="Amazing accomplishments! Keep going! 🌟"
                >
                  <ModernGrid columns={3}>
                    {badges.map((badge) => (
                      <ModernCard key={badge._id} interactive>
                        {/* Top Bar */}
                        <div className="h-1 bg-gradient-to-r from-green-400 to-emerald-500 -mx-6 -mt-6 mb-4" />

                        {/* Badge Icon */}
                        <div className="text-6xl mb-4 transform hover:scale-110 transition-transform duration-300">
                          {badge.icon}
                        </div>

                        {/* Badge Info */}
                        <h3 className="text-lg font-bold text-gray-900 mb-2">
                          {badge.name}
                        </h3>

                        <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                          {badge.description}
                        </p>

                        {/* Condition Info */}
                        <div className="mb-4 p-3 bg-green-50 rounded-lg border border-green-200">
                          <p className="text-xs font-semibold text-green-700">
                            Condition: {badge.conditionType === 'ecoPoints' ? '💚 Eco Points' : '🎮 Games Played'}
                          </p>
                          <p className="text-xs text-green-600 mt-1">
                            Threshold: {badge.threshold}
                          </p>
                        </div>

                        {/* Footer */}
                        <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                          <span className="text-sm text-gray-500">
                            📅 {formatDate(badge.earnedAt)}
                          </span>
                          <span className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                            ✓ Earned
                          </span>
                        </div>
                      </ModernCard>
                    ))}
                  </ModernGrid>
                </ModernSection>

                {/* Achievement Stats */}
                <ModernSection title="Achievement Stats">
                  <ModernGrid columns={3} responsive>
                    <ModernStatCard
                      icon="🏅"
                      label="Total Badges"
                      value={badges.length}
                    />
                    <ModernStatCard
                      icon="🌟"
                      label="Progress Status"
                      value={badges.length > 0 ? 'Progressing' : 'Starting'}
                    />
                    <ModernStatCard
                      icon="🎯"
                      label="Keep Growing!"
                      value="On Track"
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
