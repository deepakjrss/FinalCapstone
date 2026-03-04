import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import forestService from '../../services/forestService';
import gameService from '../../services/gameService';
import GameCard from '../../components/GameCard';
import GameQuizModal from '../../components/GameQuizModal';
import ModernSidebar from '../../components/ModernSidebar';
import ModernTopNavbar from '../../components/ModernTopNavbar';
import {
  ModernCard,
  ModernStatCard,
  ModernButton,
  ModernSection,
  ModernGrid,
  ModernContainer,
} from '../../components/ModernComponents';

const StudentDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [forest, setForest] = useState(null);
  const [, setLoading] = useState(true);
  const [, setError] = useState('');
  const [games, setGames] = useState([]);
  const [gamesLoading, setGamesLoading] = useState(false);
  const [selectedGameId, setSelectedGameId] = useState(null);

  // Fetch forest data on component mount
  useEffect(() => {
    const loadForestData = async () => {
      setLoading(true);
      setError('');
      try {
        if (user?.className) {
          const result = await forestService.getForestByClass(user.className);
          if (result.success) {
            setForest(result.data);
          } else {
            setError(result.error || 'Failed to load forest data');
          }
        }
      } catch (err) {
        setError('Error loading forest data');
      } finally {
        setLoading(false);
      }
    };

    loadForestData();
  }, [user?.className]);

  // Fetch games data
  useEffect(() => {
    const loadGames = async () => {
      setGamesLoading(true);
      try {
        const result = await gameService.getAvailableGames();
        if (result.success) {
          setGames(result.data);
        }
      } catch (err) {
        console.error('Error loading games:', err);
      } finally {
        setGamesLoading(false);
      }
    };

    loadGames();
  }, []);

  // Removed unused `getForestVisuals` helper to satisfy linter

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
            {/* Welcome Section */}
            <ModernSection
              title={`Welcome back, ${user?.name}! 👋`}
              subtitle="Track your eco-points, grow your forest, and earn rewards"
            />

            {/* Stats Grid */}
            <ModernGrid columns={4} responsive>
              <ModernStatCard
                icon="💚"
                label="Eco Points"
                value={user?.ecoPoints || 0}
                change="+250 this month"
                changeType="positive"
              />
              <ModernStatCard
                icon="🎮"
                label="Games Played"
                value={games.length > 0 ? games.filter(g => g.attempted).length : 0}
                trend="Keep playing!"
              />
              <ModernStatCard
                icon="🏆"
                label="Badges Earned"
                value={user?.badgesEarned || 0}
                change="Keep going!"
              />
              {forest && (
                <ModernStatCard
                  icon={forest.forestState === 'healthy' ? '🌲' : forest.forestState === 'growing' ? '🌿' : '💨'}
                  label="Forest Status"
                  value={forest.forestState}
                  trend={`${forest.ecoScore}/500 pts`}
                />
              )}
            </ModernGrid>

            {/* Forest Section */}
            {forest && (
              <ModernSection
                title="🌍 Your Class Forest"
                subtitle={`${user?.className} - ${forest.forestState.toUpperCase()}`}
              >
                <ModernCard>
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Forest Visual */}
                    <div className="flex flex-col items-center justify-center">
                      <div className="text-8xl mb-4 animate-bounce">
                        {forest.forestState === 'healthy'
                          ? '🌲'
                          : forest.forestState === 'growing'
                          ? '🌿'
                          : '💨'}
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">
                        {forest.forestState.charAt(0).toUpperCase() + forest.forestState.slice(1)} Forest
                      </h3>
                      <p className="text-center text-gray-600">
                        {forest.forestState === 'healthy' &&
                          '✨ Your forest is thriving. Keep contributing!'}
                        {forest.forestState === 'growing' &&
                          '🌱 Great progress! Almost there!'}
                        {forest.forestState === 'polluted' &&
                          '💔 Your forest needs care. Play more games!'}
                      </p>
                    </div>

                    {/* Forest Stats */}
                    <div className="lg:col-span-2 space-y-4">
                      {/* Eco Score Progress */}
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <p className="font-semibold text-gray-900">Eco Score Progress</p>
                          <p className="text-3xl font-bold text-green-600">{forest.ecoScore}/500</p>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-red-500 via-yellow-500 to-green-600 transition-all duration-500"
                            style={{
                              width: `${Math.min((forest.ecoScore / 500) * 100, 100)}%`,
                            }}
                          />
                        </div>
                      </div>

                      {/* Milestones */}
                      <div className="space-y-2 pt-4 border-t border-gray-200">
                        <p className="font-semibold text-gray-900 mb-3">🎯 Milestones</p>
                        {[
                          { label: 'Polluted Phase', range: '0-100', completed: forest.ecoScore >= 100 },
                          { label: 'Growing Phase', range: '101-300', completed: forest.ecoScore >= 101 },
                          { label: 'Healthy Phase', range: '300+', completed: forest.ecoScore > 300 },
                        ].map((milestone) => (
                          <div
                            key={milestone.label}
                            className={`flex items-center gap-3 text-sm ${
                              milestone.completed ? 'text-gray-900 font-semibold' : 'text-gray-400'
                            }`}
                          >
                            <span>{milestone.completed ? '✅' : '⭕'}</span>
                            <span>{milestone.label}</span>
                            <span className="text-xs text-gray-500">({milestone.range})</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </ModernCard>
              </ModernSection>
            )}

            {/* Games Section */}
            <ModernSection
              title="🎮 Eco-Games"
              subtitle="Play games to earn eco-points and grow your forest"
              headerAction={
                <ModernButton variant="primary" size="sm" onClick={() => navigate('/games')}>
                  View All Games →
                </ModernButton>
              }
            >
              {gamesLoading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-300 border-t-green-600" />
                </div>
              ) : games.length > 0 ? (
                <ModernGrid columns={3} gap={6}>
                  {games.slice(0, 3).map((game) => (
                    <div
                      key={game._id}
                      className="transform transition-all duration-300 hover:scale-105"
                    >
                      <GameCard
                        game={game}
                        onPlay={(gameId) => setSelectedGameId(gameId)}
                      />
                    </div>
                  ))}
                </ModernGrid>
              ) : (
                <ModernCard>
                  <div className="text-center py-8">
                    <p className="text-gray-600 text-lg">No games available yet</p>
                    <p className="text-gray-400 text-sm mt-2">Check back soon!</p>
                  </div>
                </ModernCard>
              )}
            </ModernSection>

            {/* Quick Actions */}
            <ModernSection title="Quick Actions">
              <ModernGrid columns={3} gap={6}>
                <ModernCard interactive onClick={() => navigate('/games')}>
                  <div className="text-center">
                    <div className="text-4xl mb-3">🎮</div>
                    <h3 className="font-semibold text-gray-900">Play Game</h3>
                    <p className="text-sm text-gray-600 mt-1">Earn eco-points</p>
                  </div>
                </ModernCard>
                <ModernCard interactive onClick={() => navigate('/leaderboard')}>
                  <div className="text-center">
                    <div className="text-4xl mb-3">🏆</div>
                    <h3 className="font-semibold text-gray-900">Leaderboard</h3>
                    <p className="text-sm text-gray-600 mt-1">See rankings</p>
                  </div>
                </ModernCard>
                <ModernCard interactive onClick={() => navigate('/achievements')}>
                  <div className="text-center">
                    <div className="text-4xl mb-3">🏅</div>
                    <h3 className="font-semibold text-gray-900">Achievements</h3>
                    <p className="text-sm text-gray-600 mt-1">View badges</p>
                  </div>
                </ModernCard>
              </ModernGrid>
            </ModernSection>
          </ModernContainer>
        </main>
      </div>

      {/* Game Modal */}
      {selectedGameId && (
        <GameQuizModal
          gameId={selectedGameId}
          onClose={() => setSelectedGameId(null)}
          onSubmitSuccess={() => {
            setSelectedGameId(null);
            const reloadForest = async () => {
              if (user?.className) {
                const result = await forestService.getForestByClass(user.className);
                if (result.success) {
                  setForest(result.data);
                }
              }
            };
            reloadForest();
          }}
        />
      )}
    </div>
  );
};

export default StudentDashboard;
