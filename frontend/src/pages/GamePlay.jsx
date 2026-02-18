import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import gameService from '../services/gameService';
import ModernSidebar from '../components/ModernSidebar';
import ModernTopNavbar from '../components/ModernTopNavbar';
import {
  ModernContainer,
  ModernCard,
  ModernButton,
  ModernGrid,
} from '../components/ModernComponents';
import { modernDesignSystem, layoutConstants } from '../theme/modernDesignSystem';

const GamePlay = () => {
  const navigate = useNavigate();
  const { gameId } = useParams();
  const { user } = useAuth();

  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [error, setError] = useState('');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [result, setResult] = useState(null);
  const [showResult, setShowResult] = useState(false);

  // Load game on mount
  useEffect(() => {
    const loadGame = async () => {
      setLoading(true);
      setError('');
      try {
        const gameResult = await gameService.getGameById(gameId);
        if (gameResult.success) {
          setGame(gameResult.data);
          setAnswers(new Array(gameResult.data.questions.length).fill(-1));
        } else {
          setError(gameResult.error || 'Failed to load game');
        }
      } catch (err) {
        setError('Error loading game');
      } finally {
        setLoading(false);
      }
    };

    loadGame();
  }, [gameId]);

  const handleAnswerSelect = (optionIndex) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = optionIndex;
    setAnswers(newAnswers);
  };

  const handleNextQuestion = () => {
    if (currentQuestion < game.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmitGame = async () => {
    // Validate all questions answered
    if (answers.includes(-1)) {
      setError('Please answer all questions before submitting');
      return;
    }

    setLoadingSubmit(true);
    setError('');
    try {
      const submitResult = await gameService.submitGameAttempt(gameId, answers);
      if (submitResult.success) {
        setResult(submitResult.data);
        setShowResult(true);
      } else {
        setError(submitResult.error || 'Failed to submit game');
      }
    } catch (err) {
      setError('Error submitting game');
    } finally {
      setLoadingSubmit(false);
    }
  };

  const handleBackToDashboard = () => {
    navigate('/student-dashboard');
  };

  // Loading State
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <ModernTopNavbar />
        <div className="flex flex-1 pt-16">
          <ModernSidebar />
          <main className="flex-1 flex items-center justify-center pl-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-300 border-t-green-600 mx-auto mb-4" />
              <p className="text-xl text-gray-700">Loading game...</p>
            </div>
          </main>
        </div>
      </div>
    );
  }

  // Error State - Game Not Found
  if (!game && error) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <ModernTopNavbar />
        <div className="flex flex-1 pt-16">
          <ModernSidebar />
          <main className="flex-1 flex items-center justify-center pl-64">
            <ModernCard>
              <div className="text-center p-8">
                <p className="text-2xl mb-2">❌</p>
                <p className="text-red-600 text-lg font-semibold">{error}</p>
                <ModernButton
                  variant="primary"
                  onClick={handleBackToDashboard}
                  className="mt-6"
                >
                  Back to Dashboard
                </ModernButton>
              </div>
            </ModernCard>
          </main>
        </div>
      </div>
    );
  }

  // Results Screen
  if (showResult && result) {
    const passed = result.attempt.passed;
    const scorePercentage = result.attempt.score.toFixed(1);

    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <ModernTopNavbar />
        <div className="flex flex-1 pt-16">
          <ModernSidebar />
          <main className="flex-1 overflow-auto pl-64">
            <ModernContainer className="py-8 space-y-8">
              {/* Header */}
              <div className="mb-8">
                <h1 className="text-4xl font-bold text-gray-900">Quiz Complete! 🎉</h1>
              </div>

              {/* Result Card */}
              <ModernCard>
                {/* Result Header */}
                <div className={`-mx-6 -mt-6 px-6 pt-8 pb-8 text-white text-center ${
                  passed ? 'bg-gradient-to-r from-green-500 to-emerald-600' : 'bg-gradient-to-r from-blue-500 to-indigo-600'
                }`}>
                  <p className="text-6xl mb-4">{passed ? '🎊' : '📚'}</p>
                  <h2 className="text-3xl font-bold mb-2">
                    {passed ? 'Excellent Work!' : 'Quiz Completed!'}
                  </h2>
                  <p className="text-lg opacity-90">
                    {passed ? 'You passed the quiz!' : 'Keep practicing to improve!'}
                  </p>
                </div>

                {/* Score Details */}
                <div className="p-8 space-y-8">
                  {/* Main Stats */}
                  <ModernGrid columns={4} responsive>
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
                      <p className="text-sm text-gray-700 font-semibold">Score</p>
                      <p className={`text-4xl font-bold mt-3 ${scorePercentage >= result.attempt.game.minPassScore ? 'text-green-600' : 'text-orange-600'}`}>
                        {scorePercentage}%
                      </p>
                    </div>

                    <div className="bg-purple-50 border border-purple-200 rounded-lg p-6 text-center">
                      <p className="text-sm text-gray-700 font-semibold">Correct</p>
                      <p className="text-4xl font-bold text-purple-600 mt-3">
                        {result.attempt.correctAnswers}/{result.attempt.totalQuestions}
                      </p>
                    </div>

                    <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
                      <p className="text-sm text-gray-700 font-semibold">Eco-Points</p>
                      <p className="text-4xl font-bold text-green-600 mt-3">
                        +{result.attempt.pointsEarned}
                      </p>
                    </div>

                    <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-6 text-center">
                      <p className="text-sm text-gray-700 font-semibold">Pass Score</p>
                      <p className="text-2xl font-bold text-indigo-600 mt-3">
                        {result.attempt.game.minPassScore}%
                      </p>
                    </div>
                  </ModernGrid>

                  {/* Performance Summary */}
                  <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">📊 Performance Summary</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <p className="text-gray-800">Total Questions</p>
                        <p className="font-semibold">{result.attempt.totalQuestions}</p>
                      </div>
                      <div className="flex justify-between items-center">
                        <p className="text-gray-800">Correct Answers</p>
                        <p className="font-semibold text-green-600">{result.attempt.correctAnswers}</p>
                      </div>
                      <div className="flex justify-between items-center">
                        <p className="text-gray-800">Incorrect Answers</p>
                        <p className="font-semibold text-red-600">
                          {result.attempt.totalQuestions - result.attempt.correctAnswers}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Forest Update */}
                  <div className="bg-green-50 border-2 border-green-200 rounded-xl p-6">
                    <h3 className="text-lg font-bold text-green-900 mb-4">🌲 Class Forest Updated</h3>
                    <ModernGrid columns={3} responsive>
                      <div className="bg-white rounded-lg p-4 text-center">
                        <p className="text-sm text-gray-700 font-semibold">Class</p>
                        <p className="text-2xl font-bold text-gray-900 mt-2">{result.forest.className}</p>
                      </div>
                      <div className="bg-white rounded-lg p-4 text-center">
                        <p className="text-sm text-gray-700 font-semibold">Eco Score</p>
                        <p className="text-2xl font-bold text-green-600 mt-2">{result.forest.ecoScore}</p>
                      </div>
                      <div className="bg-white rounded-lg p-4 text-center">
                        <p className="text-sm text-gray-700 font-semibold">State</p>
                        <p className="text-2xl font-bold text-emerald-600 mt-2 capitalize">
                          {result.forest.forestState}
                        </p>
                      </div>
                    </ModernGrid>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col md:flex-row gap-4 pt-4">
                    <ModernButton
                      variant="primary"
                      onClick={handleBackToDashboard}
                      className="flex-1"
                    >
                      Back to Dashboard
                    </ModernButton>
                    <ModernButton
                      variant="secondary"
                      onClick={() => navigate('/games')}
                      className="flex-1"
                    >
                      Play Another Game
                    </ModernButton>
                  </div>
                </div>
              </ModernCard>
            </ModernContainer>
          </main>
        </div>
      </div>
    );
  }

  // Quiz Screen
  if (game && game.questions && game.questions.length > 0) {
    const question = game.questions[currentQuestion];
    const answeredCount = answers.filter(a => a !== -1).length;
    const isLastQuestion = currentQuestion === game.questions.length - 1;
    const allAnswered = !answers.includes(-1);

    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <ModernTopNavbar />
        <div className="flex flex-1 pt-16">
          <ModernSidebar />
          <main className="flex-1 overflow-auto pl-64">
            {/* Header */}
            <header className="bg-green-600 text-white sticky top-0 z-20 shadow-md">
              <div className="p-6 max-w-7xl mx-auto">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h1 className="text-2xl font-bold">{game.title}</h1>
                    <p className="text-green-100 text-sm mt-1">
                      Question {currentQuestion + 1} of {game.questions.length}
                    </p>
                  </div>
                  <ModernButton
                    variant="ghost"
                    onClick={handleBackToDashboard}
                    className="text-white hover:text-gray-100"
                  >
                    ✕ Exit
                  </ModernButton>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-green-700/40 rounded-full h-2">
                  <div
                    className="bg-white h-2 rounded-full transition-all duration-300 shadow"
                    style={{ width: `${((currentQuestion + 1) / game.questions.length) * 100}%` }}
                  />
                </div>
              </div>
            </header>

            {/* Main Content */}
            <div className="p-6 max-w-4xl mx-auto">
              <ModernCard>
                {/* Question Section */}
                <div className="p-8 border-b border-gray-200">
                  <h2 className="text-2xl font-bold text-gray-900 mb-8">
                    {question.questionText}
                  </h2>

                  {/* Options */}
                  <div className="space-y-3">
                    {question.options.map((option, index) => (
                      <label
                        key={index}
                        className="flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all hover:bg-gray-50"
                        style={{
                          borderColor: answers[currentQuestion] === index ? '#16a34a' : '#e5e7eb',
                          backgroundColor: answers[currentQuestion] === index ? '#f0fdf4' : '#ffffff',
                        }}
                      >
                        <input
                          type="radio"
                          name="answer"
                          value={index}
                          checked={answers[currentQuestion] === index}
                          onChange={() => handleAnswerSelect(index)}
                          className="w-5 h-5 text-green-600 cursor-pointer"
                        />
                        <span className="ml-4 text-lg text-gray-800 flex-1">{option}</span>
                        {answers[currentQuestion] === index && (
                          <span className="text-green-600 font-bold text-xl">✓</span>
                        )}
                      </label>
                    ))}
                  </div>

                  {/* Explanation */}
                  {question.explanation && answers[currentQuestion] !== -1 && (
                    <div className="mt-6 p-4 bg-blue-50 border-l-4 border-blue-500 rounded-lg">
                      <p className="text-sm text-gray-800">
                        <span className="font-bold text-blue-700">💡 Explanation:</span> {question.explanation}
                      </p>
                    </div>
                  )}
                </div>

                {/* Footer/Navigation */}
                <div className="bg-gray-50 p-8 border-t border-gray-200">
                  <div className="flex items-center justify-between mb-6">
                    <div className="text-sm font-semibold text-gray-800">
                      Answered: <span className="text-green-600 font-bold">{answeredCount}/{game.questions.length}</span>
                    </div>
                    <div className="text-sm font-semibold text-gray-800">
                      Max Points: <span className="text-purple-600 font-bold">{game.maxPoints}</span>
                    </div>
                  </div>

                  <div className="flex flex-col md:flex-row gap-4">
                    <ModernButton
                      variant="secondary"
                      onClick={handlePrevQuestion}
                      disabled={currentQuestion === 0}
                    >
                      ← Previous
                    </ModernButton>

                    {!isLastQuestion ? (
                      <ModernButton
                        variant="primary"
                        onClick={handleNextQuestion}
                      >
                        Next →
                      </ModernButton>
                    ) : (
                      <ModernButton
                        variant={allAnswered && !loadingSubmit ? 'primary' : 'secondary'}
                        onClick={handleSubmitGame}
                        disabled={!allAnswered || loadingSubmit}
                      >
                        {loadingSubmit ? 'Submitting...' : 'Submit Quiz ✓'}
                      </ModernButton>
                    )}
                  </div>

                  {error && (
                    <div className="mt-4 p-3 bg-red-50 border border-red-300 text-red-700 rounded-lg text-sm">
                      {error}
                    </div>
                  )}
                </div>
              </ModernCard>

              {/* Question Indicator */}
              <div className="mt-8 bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                <p className="text-sm font-semibold text-gray-900 mb-4">Question Progress</p>
                <div className="flex flex-wrap gap-2">
                  {game.questions.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentQuestion(index)}
                      className={`w-10 h-10 rounded-lg font-bold transition duration-300 ${
                        index === currentQuestion
                          ? 'bg-green-600 text-white shadow-md'
                          : answers[index] !== -1
                          ? 'bg-green-100 text-green-700 border-2 border-green-300'
                          : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                      }`}
                    >
                      {index + 1}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return null;
};

export default GamePlay;
