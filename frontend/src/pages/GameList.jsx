import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ModernSidebar from '../components/ModernSidebar';
import ModernTopNavbar from '../components/ModernTopNavbar';
import GameCard from '../components/GameCard';
import gameService from '../services/gameService';
import { sharedGames } from '../data/gamesData';
import {
  ModernContainer,
  ModernGrid,
  ModernCard,
  ModernButton,
  ModernSection,
} from '../components/ModernComponents';

const GameList = () => {
  const navigate = useNavigate();
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('All');

  // Fetch games from API
  useEffect(() => {
    const loadGames = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await gameService.getAvailableGames();
        console.log('📊 GameList API Response:', result);
        
        if (result.success && Array.isArray(result.data) && result.data.length > 0) {
          console.log(`✅ Loaded ${result.data.length} games`);
          setGames(result.data);
        } else {
          console.warn('⚠️ Failed to load games from API, falling back to shared games list:', result.error);
          setGames(sharedGames);
        }
      } catch (err) {
        console.error('❌ Error loading games:', err);
        setGames(sharedGames);
      } finally {
        setLoading(false);
      }
    };

    loadGames();
  }, []);

  // Filter games by difficulty
  const filteredGames = filter === 'All' 
    ? games 
    : games.filter(game => {
        const gameDifficulty = (game.difficulty || 'easy').toLowerCase();
        return gameDifficulty === filter.toLowerCase();
      });

  const categories = ['All', 'Easy', 'Medium', 'Hard'];

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
            <div>
              <ModernSection
                title="🎮 Eco-Games"
                subtitle="Test your knowledge and earn eco-points!"
              />
            </div>

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
              <ModernCard>
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-300 border-t-green-600" />
                  <p className="ml-4 text-gray-600 text-lg">Loading games...</p>
                </div>
              </ModernCard>
            )}

            {/* Error State */}
            {error && !loading && (
              <ModernCard>
                <div className="bg-red-50 border border-red-300 rounded-lg p-6 text-red-700">
                  <p className="font-semibold text-lg">⚠️ {error}</p>
                  <ModernButton
                    variant="primary"
                    onClick={() => window.location.reload()}
                    className="mt-4"
                  >
                    Try Again
                  </ModernButton>
                </div>
              </ModernCard>
            )}

            {/* Empty State */}
            {!loading && !error && filteredGames.length === 0 && (
              <ModernCard>
                <div className="text-center py-12">
                  <div className="text-5xl mb-4">🎮</div>
                  <p className="text-xl font-semibold text-gray-900">No games found</p>
                  <p className="text-gray-600 mt-2">Try selecting a different difficulty level</p>
                </div>
              </ModernCard>
            )}

            {/* Games Grid */}
            {!loading && !error && filteredGames.length > 0 && (
              <ModernGrid columns={3} gap={6}>
                {filteredGames.map((game) => (
                  <GameCard
                    key={game._id || game.id}
                    game={game}
                    onPlay={(gameId) => {
                      navigate(`/games/${gameId}`);
                    }}
                  />
                ))}
              </ModernGrid>
            )}

            {/* Stats Section */}
            {!loading && !error && games.length > 0 && (
              <ModernSection title="📊 Game Stats">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <ModernCard>
                    <div className="text-center">
                      <p className="text-3xl font-bold text-green-600">{games.length}</p>
                      <p className="text-gray-600 text-sm mt-2">Total Games Available</p>
                    </div>
                  </ModernCard>
                  <ModernCard>
                    <div className="text-center">
                      <p className="text-3xl font-bold text-blue-600">
                        {games.reduce((sum, g) => sum + (g.questions?.length || 0), 0)}
                      </p>
                      <p className="text-gray-600 text-sm mt-2">Total Questions</p>
                    </div>
                  </ModernCard>
                  <ModernCard>
                    <div className="text-center">
                      <p className="text-3xl font-bold text-purple-600">
                        {games.reduce((sum, g) => sum + (g.maxPoints || 0), 0)}
                      </p>
                      <p className="text-gray-600 text-sm mt-2">Total Points Available</p>
                    </div>
                  </ModernCard>
                </div>
              </ModernSection>
            )}
          </ModernContainer>
        </main>
      </div>
    </div>
  );
};

export default GameList;
