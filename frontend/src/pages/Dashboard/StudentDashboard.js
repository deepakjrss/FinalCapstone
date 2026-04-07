import React, { useState, useEffect, Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../components/ToastNotification';
import { motion } from 'framer-motion';
import forestService from '../../services/forestService';
import gameService from '../../services/gameService';
import feedbackService from '../../services/feedbackService';
import badgeService from '../../services/badgeService';
import GameCard from '../../components/GameCard';
import GameQuizModal from '../../components/GameQuizModal';
import ModernSidebar from '../../components/ModernSidebar';
import ModernTopNavbar from '../../components/ModernTopNavbar';
import { sharedGames } from '../../data/gamesData';
import {
  ModernCard,
  ModernStatCard,
  ModernButton,
  ModernSection,
  ModernGrid,
  ModernContainer,
} from '../../components/ModernComponents';
import { SkeletonGrid } from '../../components/Skeletons';

// Lazy load Spline for performance
const Spline = React.lazy(() => import('@splinetool/react-spline'));

const StudentDashboard = () => {
  const { user } = useAuth();
  const { showSuccess, showError } = useToast();
  const navigate = useNavigate();
  const [forest, setForest] = useState(null);
  const [, setLoading] = useState(true);
  const [, setError] = useState('');
  const [games, setGames] = useState([]);
  const [gamesLoading, setGamesLoading] = useState(false);
  const [selectedGameId, setSelectedGameId] = useState(null);
  const [splineLoaded, setSplineLoaded] = useState(false);
  const [badges, setBadges] = useState([]);
  const [badgesLoading, setBadgesLoading] = useState(false);

  useEffect(() => {
    console.log('Dashboard state:', {
      ecoPoints: user?.ecoPoints,
      badgesCount: badges.length,
      gamesCount: games.length
    });
  }, [user?.ecoPoints, badges.length, games.length]);

  // Feedback state
  const [teachers, setTeachers] = useState([]);
  const [feedbackForm, setFeedbackForm] = useState({
    teacherId: '',
    rating: 0,
    comment: ''
  });
  const [feedbackErrors, setFeedbackErrors] = useState({});
  const [feedbackSubmitting, setFeedbackSubmitting] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState('');

  // Helper function to determine forest state based on ecoPoints
  const getForestStateFromEcoPoints = (ecoPoints) => {
    if (ecoPoints < 100) return 'polluted';
    if (ecoPoints < 300) return 'growing';
    return 'healthy';
  };

  // Helper function to get forest display text
  const getForestDisplayText = (ecoPoints) => {
    const state = getForestStateFromEcoPoints(ecoPoints);
    switch (state) {
      case 'polluted': return '🌫️ Polluted Forest';
      case 'growing': return '🌱 Growing Forest';
      case 'healthy': return '🌳 Healthy Forest';
      default: return '🌿 Forest';
    }
  };

  // Helper function to get forest description
  const getForestDescription = (ecoPoints) => {
    const state = getForestStateFromEcoPoints(ecoPoints);
    switch (state) {
      case 'polluted': return '💔 Your forest needs care. Play more games!';
      case 'growing': return '🌱 Great progress! Almost there!';
      case 'healthy': return '✨ Your forest is thriving. Keep contributing!';
      default: return 'Keep growing your forest!';
    }
  };

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
        console.log('🎮 Games API Response:', result);
        if (result.success && Array.isArray(result.data) && result.data.length > 0) {
          console.log('🎮 Dashboard Games:', result.data);
          setGames(result.data);
        } else {
          console.warn('⚠️ No games returned from API or API failed, using shared games fallback:', result.error);
          setGames(sharedGames);
        }
      } catch (err) {
        console.error('❌ Error loading games:', err);
        setGames(sharedGames);
      } finally {
        setGamesLoading(false);
      }
    };

    loadGames();
  }, []);

  // Fetch badges data
  useEffect(() => {
    const loadBadges = async () => {
      console.log('🎖️ StudentDashboard: Loading badges...');
      setBadgesLoading(true);
      try {
        const result = await badgeService.getBadgeProgress();
        console.log('🎖️ StudentDashboard: Badge API result:', result);
        if (result.success) {
          console.log('🎖️ StudentDashboard: Badges:', result.data);
          setBadges(result.data);
        } else {
          console.warn('🎖️ StudentDashboard: Badge API failed:', result.error);
          setBadges([]);
        }
      } catch (err) {
        console.error('🎖️ StudentDashboard: Error loading badges:', err);
        setBadges([]);
      } finally {
        setBadgesLoading(false);
      }
    };

    loadBadges();
  }, []);

  // Fetch teachers for feedback
  useEffect(() => {
    const loadTeachers = async () => {
      try {
        const result = await feedbackService.getTeachers();
        if (result.success) {
          setTeachers(result.data);
        }
      } catch (err) {
        console.error('Error loading teachers:', err);
      }
    };

    loadTeachers();
  }, []);

  // Handle feedback submission
  const validateFeedback = () => {
    const e = {};
    if (!feedbackForm.teacherId) e.teacherId = 'Please select a teacher.';
    const ratingNumber = Number(feedbackForm.rating);
    if (!ratingNumber || ratingNumber < 1 || ratingNumber > 5) e.rating = 'Provide a valid rating between 1 and 5.';
    return e;
  };

  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();

    setFeedbackErrors({});
    setFeedbackMessage('');

    const errors = validateFeedback();
    if (Object.keys(errors).length > 0) {
      setFeedbackErrors(errors);
      setFeedbackMessage('Please fix feedback form errors.');
      return;
    }

    const teacherId = feedbackForm.teacherId;
    const ratingNumber = Number(feedbackForm.rating);
    const comment = feedbackForm.comment;

    setFeedbackSubmitting(true);
    setFeedbackMessage('');

    try {
      const result = await feedbackService.submitFeedback(teacherId, ratingNumber, comment);
      if (result.success) {
        showSuccess('Thank you for your feedback! 🎉');
        setFeedbackMessage('Thank you for your feedback! 🎉');
        setFeedbackForm({ teacherId: '', rating: 0, comment: '' });
      } else {
        const errMsg = result.error || 'Failed to submit feedback. Please try again.';
        showError(errMsg);
        setFeedbackMessage(errMsg);
      }
    } catch (err) {
      const errMsg = 'Error submitting feedback. Please try again.';
      showError(errMsg);
      setFeedbackMessage(errMsg);
    } finally {
      setFeedbackSubmitting(false);
    }
  };

  // Handle star rating click
  const handleRatingClick = (star) => {
    setFeedbackForm(prev => ({ ...prev, rating: Number(star) }));
    if (feedbackErrors.rating) {
      setFeedbackErrors(prev => ({ ...prev, rating: '' }));
    }
  };

  // Removed unused `getForestVisuals` helper to satisfy linter

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
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
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                whileHover={{ scale: 1.05 }}
              >
                <ModernStatCard
                  icon="💚"
                  label="Eco Points"
                  value={user?.ecoPoints || 0}
                  change="+250 this month"
                  changeType="positive"
                />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                whileHover={{ scale: 1.05 }}
              >
                <ModernStatCard
                  icon="🎮"
                  label="Games Played"
                  value={games.length > 0 ? games.filter(g => g.attempted).length : 0}
                  trend="Keep playing!"
                />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                whileHover={{ scale: 1.05 }}
              >
                <ModernStatCard
                  icon="🏆"
                  label="Badges Earned"
                  value={user?.badgesEarned || 0}
                  change="Keep going!"
                />
              </motion.div>
              {forest && (
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  whileHover={{ scale: 1.05 }}
                >
                  <ModernStatCard
                    icon={forest.forestState === 'healthy' ? '🌲' : forest.forestState === 'growing' ? '🌿' : '💨'}
                    label="Forest Status"
                    value={forest.forestState}
                    trend={`${forest.ecoScore}/500 pts`}
                  />
                </motion.div>
              )}
            </ModernGrid>

            {/* Recent Badges Section */}
            {!badgesLoading && badges.length > 0 && (
              <ModernSection
                title="🏆 Your Recent Achievements"
                subtitle="Show off your latest badges and progress"
              >
                <ModernGrid columns={3}>
                  {badges
                    .filter(badge => badge.earned || badge.progress > 0)
                    .sort((a, b) => {
                      // Sort by earned status first, then by progress
                      if (a.earned && !b.earned) return -1;
                      if (!a.earned && b.earned) return 1;
                      return b.progress - a.progress;
                    })
                    .slice(0, 3)
                    .map((badge) => (
                      <motion.div
                        key={badge.badge._id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3 }}
                        whileHover={{ scale: 1.05 }}
                      >
                        <ModernCard interactive className={`text-center transition-all duration-500 ${
                          badge.earned
                            ? 'bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 border-green-300 shadow-lg hover:shadow-xl ring-2 ring-green-200 transform hover:scale-105'
                            : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                        }`}>
                          {/* Badge Icon */}
                          <div className={`text-5xl mb-3 transition-all duration-500 ${
                            badge.earned
                              ? 'animate-bounce text-green-600 filter brightness-110 drop-shadow-lg'
                              : 'grayscale opacity-60'
                          }`}>
                            {badge.badge.icon}
                          </div>

                          {/* Badge Name */}
                          <h3 className={`text-lg font-bold mb-2 ${badge.earned ? 'text-green-800' : 'text-gray-500'}`}>
                            {badge.badge.name}
                          </h3>

                          {/* Progress Bar for Unlocked */}
                          {!badge.earned && (
                            <div className="mb-3">
                              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                                <div
                                  className="h-full bg-gradient-to-r from-blue-400 to-blue-600 transition-all duration-500"
                                  style={{ width: `${badge.progress}%` }}
                                />
                              </div>
                              <p className="text-xs text-gray-500 mt-1">
                                {Math.round(badge.progress)}% complete
                              </p>
                            </div>
                          )}

                          {/* Status */}
                          <div className={`text-sm font-semibold px-3 py-1 rounded-full ${
                            badge.earned
                              ? 'bg-green-500 text-white shadow-md'
                              : 'bg-blue-500 text-white'
                          }`}>
                            {badge.earned ? '✅ Completed' : '⏳ In Progress'}
                          </div>
                        </ModernCard>
                      </motion.div>
                    ))}
                </ModernGrid>

                {/* View All Badges Button */}
                <div className="text-center mt-6">
                  <ModernButton
                    variant="outline"
                    onClick={() => navigate('/achievements')}
                    className="px-6 py-2"
                  >
                    View All Achievements 🏆
                  </ModernButton>
                </div>
              </ModernSection>
            )}

            {/* Forest Section */}
            {forest && (
              <ModernSection
                title="🌍 Your Class Forest"
                subtitle={`${user?.className} - ${getForestStateFromEcoPoints(user?.ecoPoints || 0).toUpperCase()}`}
              >
                <ModernCard>
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Forest Visual */}
                    <div className="flex flex-col items-center justify-center">
                      <div className="h-[400px] w-full rounded-2xl overflow-hidden shadow-lg mb-4">
                        <Suspense fallback={
                          <div className="h-full w-full bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900 dark:to-green-800 rounded-2xl flex items-center justify-center">
                            <div className="text-center">
                              <div className="text-4xl mb-2">🌿</div>
                              <p className="text-sm text-gray-600 dark:text-gray-400">Loading 3D Forest...</p>
                            </div>
                          </div>
                        }>
                          <Spline
                            scene="https://prod.spline.design/wVkDLdu81OjBUmL1/scene.splinecode"
                            onLoad={() => setSplineLoaded(true)}
                          />
                        </Suspense>
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                        {getForestDisplayText(user?.ecoPoints || 0)}
                      </h3>
                      <p className="text-center text-gray-600 dark:text-gray-400">
                        {getForestDescription(user?.ecoPoints || 0)}
                      </p>
                    </div>

                    {/* Forest Stats */}
                    <div className="lg:col-span-2 space-y-4">
                      {/* Eco Score Progress */}
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <p className="font-semibold text-gray-900 dark:text-gray-100">Eco Score Progress</p>
                          <p className="text-3xl font-bold text-green-600">{user?.ecoPoints || 0}/500</p>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
                          <motion.div
                            className="h-full bg-gradient-to-r from-red-500 via-yellow-500 to-green-600"
                            initial={{ width: 0 }}
                            animate={{ width: `${Math.min(((user?.ecoPoints || 0) / 500) * 100, 100)}%` }}
                            transition={{ duration: 0.3, ease: "easeOut" }}
                          />
                        </div>
                      </div>

                      {/* Milestones */}
                      <div className="space-y-2 pt-4 border-t border-gray-200 dark:border-gray-600">
                        <p className="font-semibold text-gray-900 dark:text-gray-100 mb-3">🎯 Milestones</p>
                        {[
                          { label: 'Polluted Phase', range: '0-100', completed: (user?.ecoPoints || 0) >= 100 },
                          { label: 'Growing Phase', range: '101-300', completed: (user?.ecoPoints || 0) >= 101 },
                          { label: 'Healthy Phase', range: '300+', completed: (user?.ecoPoints || 0) > 300 },
                        ].map((milestone) => (
                          <div
                            key={milestone.label}
                            className={`flex items-center gap-3 text-sm ${
                              milestone.completed ? 'text-gray-900 dark:text-gray-100 font-semibold' : 'text-gray-400 dark:text-gray-500'
                            }`}
                          >
                            <span>{milestone.completed ? '✅' : '⭕'}</span>
                            <span>{milestone.label}</span>
                            <span className="text-xs text-gray-500 dark:text-gray-400">({milestone.range})</span>
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
              title="🎮 Eco-Games Challenge"
              subtitle="Play exciting games and earn eco-points to grow your forest"
              headerAction={
                <ModernButton variant="primary" size="sm" onClick={() => navigate('/games')}>
                  View All Games →
                </ModernButton>
              }
            >
              {gamesLoading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-300 border-t-green-600" />
                  <p className="ml-4 text-gray-600">Loading games...</p>
                </div>
              ) : games && games.length > 0 ? (
                <>
                  <ModernGrid columns={3} gap={6}>
                    {games.slice(0, 3).map((game) => (
                      <motion.div
                        key={game._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                        whileHover={{ scale: 1.02 }}
                      >
                        <GameCard
                          game={game}
                          onPlay={(target) => {
                            setSelectedGameId(target);
                            navigate(game.route || `/games/${target}`);
                          }}
                        />
                      </motion.div>
                    ))}
                  </ModernGrid>
                  
                  {games.length > 3 && (
                    <div className="text-center mt-6">
                      <ModernButton
                        variant="outline"
                        onClick={() => navigate('/games')}
                        className="px-6 py-3"
                      >
                        See All {games.length} Games →
                      </ModernButton>
                    </div>
                  )}
                </>
              ) : (
                <ModernCard>
                  <div className="text-center py-12">
                    <div className="text-5xl mb-4">🎮</div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">No Games Available</h3>
                    <p className="text-gray-600 mb-6">Check back soon! New eco-games are coming.</p>
                    <ModernButton
                      variant="primary"
                      onClick={() => navigate('/games')}
                    >
                      Explore All Games
                    </ModernButton>
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
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100">Play Game</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Earn eco-points</p>
                  </div>
                </ModernCard>
                <ModernCard interactive onClick={() => navigate('/leaderboard')}>
                  <div className="text-center">
                    <div className="text-4xl mb-3">🏆</div>
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100">Leaderboard</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">See rankings</p>
                  </div>
                </ModernCard>
                <ModernCard interactive onClick={() => navigate('/achievements')}>
                  <div className="text-center">
                    <div className="text-4xl mb-3">🏅</div>
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100">Achievements</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">View badges</p>
                  </div>
                </ModernCard>
              </ModernGrid>
            </ModernSection>

            {/* Feedback Section */}
            <ModernSection title="📝 Share Your Feedback" subtitle="Help us improve by rating your teachers">
              <ModernCard>
                <form onSubmit={handleFeedbackSubmit} className="space-y-6">
                  {/* Teacher Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Select Teacher *
                    </label>
                    <select
                      value={feedbackForm.teacherId}
                      onChange={(e) => setFeedbackForm(prev => ({ ...prev, teacherId: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-all duration-300"
                      required
                    >
                      <option value="">Choose a teacher...</option>
                      {teachers.map((teacher) => (
                        <option key={teacher._id} value={teacher._id}>
                          {teacher.name}
                        </option>
                      ))}
                    </select>
                    {feedbackErrors.teacherId && <p className="text-red-500 text-sm mt-1">{feedbackErrors.teacherId}</p>}
                  </div>

                  {/* Star Rating */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Rating *
                    </label>
                    <div className="flex space-x-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => handleRatingClick(star)}
                          className={`text-2xl transition-colors ${
                            star <= feedbackForm.rating
                              ? 'text-yellow-400 hover:text-yellow-500'
                              : 'text-gray-300 dark:text-gray-600 hover:text-yellow-400'
                          }`}
                        >
                          ⭐
                        </button>
                      ))}
                    </div>
                    {feedbackForm.rating > 0 && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        {feedbackForm.rating} star{feedbackForm.rating !== 1 ? 's' : ''}
                      </p>
                    )}
                    {feedbackErrors.rating && <p className="text-red-500 text-sm mt-1">{feedbackErrors.rating}</p>}
                  </div>

                  {/* Comment */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Comment (Optional)
                    </label>
                    <textarea
                      value={feedbackForm.comment}
                      onChange={(e) => setFeedbackForm(prev => ({ ...prev, comment: e.target.value }))}
                      placeholder="Share your thoughts about this teacher..."
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 focus:border-transparent resize-none bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-all duration-300"
                      rows={3}
                    />
                  </div>

                  {/* Submit Button */}
                  <div className="flex justify-end">
                    <ModernButton
                      type="submit"
                      variant="primary"
                      disabled={feedbackSubmitting}
                      className="px-6"
                    >
                      {feedbackSubmitting ? 'Submitting...' : 'Submit Feedback'}
                    </ModernButton>
                  </div>

                  {/* Message */}
                  {feedbackMessage && (
                    <div className={`p-3 rounded-lg text-sm ${
                      feedbackMessage.includes('Thank you')
                        ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800'
                        : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800'
                    }`}>
                      {feedbackMessage}
                    </div>
                  )}
                </form>
              </ModernCard>
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
