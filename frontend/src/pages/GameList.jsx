import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
// removed unused useAuth import
import gameService from '../services/gameService';
import ModernSidebar from '../components/ModernSidebar';
import ModernTopNavbar from '../components/ModernTopNavbar';
import {
  ModernContainer,
  ModernGrid,
  ModernCard,
  ModernButton,
  ModernSection,
} from '../components/ModernComponents';
// removed unused ModernBadge, modernDesignSystem, and layoutConstants imports

const GameList = () => {
  const navigate = useNavigate();
  // user not required in this view
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const loadGames = async () => {
      setLoading(true);
      setError('');
      try {
        const result = await gameService.getAvailableGames();
        if (result.success) {
          setGames(result.data);
        } else {
          setError(result.error || 'Failed to load games');
        }
      } catch (err) {
        setError('Error loading games');
      } finally {
        setLoading(false);
      }
    };

    loadGames();
  }, []);

  // removed unused difficultyColors mapping

  const categoryIcons = {
    'renewable-energy': '⚡',
    conservation: '🦁',
    climate: '🌍',
    sustainability: '♻️',
    'waste-management': '🗑️',
  };

  const categoryLabels = {
    'renewable-energy': 'Renewable Energy',
    conservation: 'Conservation',
    climate: 'Climate',
    sustainability: 'Sustainability',
    'waste-management': 'Waste Management',
  };

  const filteredGames = filter === 'all' 
    ? games 
    : games.filter(game => game.difficulty === filter);

  const categories = ['all', 'easy', 'medium', 'hard'];

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
              title="🎮 Eco-Games"
              subtitle="Test your knowledge and earn eco-points!"
            />

            {/* Filter Section */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Filter by Difficulty</h2>
              <div className="flex flex-wrap gap-3">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setFilter(category)}
                    className={`px-4 py-2 rounded-lg font-semibold transition-all duration-300 ${
                      filter === category
                        ? 'bg-green-600 text-white shadow-md'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300'
                    }`}
                  >
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Loading State */}
            {loading && (
              <div className="flex items-center justify-center py-16">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-300 border-t-green-600" />
                <p className="ml-4 text-lg text-gray-600">Loading games...</p>
              </div>
            )}

            {/* Error State */}
            {error && !loading && (
              <div className="bg-red-50 border border-red-300 rounded-xl p-6 text-red-700">
                <p className="font-semibold">⚠️ Error Loading Games</p>
                <p className="text-sm mt-2">{error}</p>
                <ModernButton
                  variant="danger"
                  size="sm"
                  onClick={() => window.location.reload()}
                  className="mt-4"
                >
                  Try Again
                </ModernButton>
              </div>
            )}

            {/* Empty State */}
            {!loading && !error && filteredGames.length === 0 && (
              <ModernCard>
                <div className="text-center py-12">
                  <p className="text-xl font-semibold text-gray-900">🎯 No games found</p>
                  <p className="text-gray-600 mt-2">Try selecting a different difficulty level</p>
                </div>
              </ModernCard>
            )}

            {/* Games Grid */}
            {!loading && !error && filteredGames.length > 0 && (
              <ModernGrid columns={3} gap={6}>
                {filteredGames.map((game) => (
                  <div
                    key={game._id}
                    className="transform transition-all duration-300 hover:scale-105"
                  >
                    <ModernCard interactive>
                      {/* Card Header */}
                      <div className="mb-4 pb-4 border-b border-gray-200">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="text-xl font-bold text-gray-900">{game.title}</h3>
                            <p className="text-sm text-gray-600 mt-2">{game.description}</p>
                          </div>
                          <span className="text-3xl ml-2">
                            {categoryIcons[game.category] || '🎯'}
                          </span>
                        </div>
                      </div>

                      {/* Stats Grid */}
                      <div className="grid grid-cols-3 gap-3 mb-4">
                        <div className="bg-blue-50 rounded-lg p-3 text-center border border-blue-200">
                          <p className="text-2xl font-bold text-blue-600">
                            {game.questions ? game.questions.length : 0}
                          </p>
                          <p className="text-xs text-gray-700 mt-1 font-medium">Questions</p>
                        </div>
                        <div className="bg-purple-50 rounded-lg p-3 text-center border border-purple-200">
                          <p className="text-2xl font-bold text-purple-600">{game.maxPoints}</p>
                          <p className="text-xs text-gray-700 mt-1 font-medium">Points</p>
                        </div>
                        <div className={`rounded-lg p-3 text-center border-2 ${
                          game.difficulty === 'easy'
                            ? 'bg-green-50 border-green-300 text-green-700'
                            : game.difficulty === 'medium'
                            ? 'bg-yellow-50 border-yellow-300 text-yellow-700'
                            : 'bg-red-50 border-red-300 text-red-700'
                        }`}>
                          <p className="text-xs font-bold uppercase">{game.difficulty}</p>
                        </div>
                      </div>

                      {/* Category & Pass Score */}
                      <div className="bg-gray-50 rounded-lg p-3 mb-4 border border-gray-200">
                        <p className="text-sm text-gray-900">
                          <span className="font-semibold">Category:</span> {categoryLabels[game.category] || game.category}
                        </p>
                        <p className="text-sm text-gray-900 mt-2">
                          <span className="font-semibold">Pass Score:</span> {game.minPassScore}%
                        </p>
                      </div>

                      {/* Play Button */}
                      <ModernButton
                        variant="primary"
                        onClick={() => navigate(`/game-play/${game._id}`)}
                        className="w-full"
                      >
                        Play Game →
                      </ModernButton>
                    </ModernCard>
                  </div>
                ))}
              </ModernGrid>
            )}
          </ModernContainer>
        </main>
      </div>
    </div>
  );
};

export default GameList;
