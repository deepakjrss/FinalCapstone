import React, { useState, useEffect } from 'react';
import gameService from '../services/gameService';

const GameQuizModal = ({ gameId, onClose, onSubmitSuccess }) => {
  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [answers, setAnswers] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);

  // Load game on mount
  useEffect(() => {
    const loadGame = async () => {
      setLoading(true);
      setError('');
      try {
        const result = await gameService.getGameById(gameId);
        if (result.success) {
          setGame(result.data);
          setAnswers(new Array(result.data.questions.length).fill(-1));
        } else {
          setError(result.error || 'Failed to load game');
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

    setSubmitting(true);
    try {
      const submitResult = await gameService.submitGameAttempt(gameId, answers);
      if (submitResult.success) {
        setResult(submitResult.data);
        onSubmitSuccess(); // Refresh parent component
      } else {
        setError(submitResult.error || 'Failed to submit game');
      }
    } catch (err) {
      setError('Error submitting game');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-8 max-w-2xl w-full mx-4 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-700 dark:text-gray-300">Loading game...</p>
        </div>
      </div>
    );
  }

  if (result) {
    const passed = result.attempt.passed;
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-8 max-w-md w-full mx-4">
          <div className="text-center">
            <div className="text-6xl mb-4">
              {passed ? '🎉' : '📚'}
            </div>
            <h2 className={`text-2xl font-bold mb-2 ${passed ? 'text-green-600' : 'text-blue-600'}`}>
              {passed ? 'Great Job!' : 'Quiz Completed!'}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              You scored <span className="font-semibold text-lg">{result.attempt.score.toFixed(1)}%</span>
            </p>

            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-6 grid grid-cols-2 gap-4">
              <div>
                <p className="text-gray-600 dark:text-gray-400 text-sm">Correct Answers</p>
                <p className="text-2xl font-bold text-green-600">{result.attempt.correctAnswers}/{result.attempt.totalQuestions}</p>
              </div>
              <div>
                <p className="text-gray-600 dark:text-gray-400 text-sm">Points Earned</p>
                <p className="text-2xl font-bold text-purple-600">+{result.attempt.pointsEarned}</p>
              </div>
            </div>

            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 mb-6">
              <p className="text-sm text-gray-700 dark:text-gray-300">
                <span className="font-semibold">Your Class Forest:</span><br />
                Eco Score: <span className="font-bold">{result.forest.ecoScore}</span> ({result.forest.forestState})
              </p>
            </div>

            <button
              onClick={onClose}
              className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-semibold"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!game) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-8 max-w-md w-full mx-4">
          <p className="text-red-600 dark:text-red-400">{error || 'Game not found'}</p>
          <button
            onClick={onClose}
            className="w-full mt-4 px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500 transition"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  const question = game.questions[currentQuestion];
  const answeredCount = answers.filter(a => a !== -1).length;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold">{game.title}</h2>
              <p className="text-blue-100 text-sm mt-1">Question {currentQuestion + 1} of {game.questions.length}</p>
            </div>
            <button
              onClick={onClose}
              className="text-xl hover:text-blue-200"
            >
              ✕
            </button>
          </div>

          {/* Progress Bar */}
          <div className="mt-4 w-full bg-blue-400 rounded-full h-2">
            <div
              className="bg-white h-2 rounded-full transition-all"
              style={{ width: `${((currentQuestion + 1) / game.questions.length) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {error && (
            <div className="mb-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3 text-red-700 dark:text-red-400 text-sm">
              {error}
            </div>
          )}

          {/* Question Text */}
          <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-6">
            {question.questionText}
          </h3>

          {/* Options */}
          <div className="space-y-3 mb-6">
            {question.options.map((option, index) => (
              <label
                key={index}
                className="flex items-center p-4 border-2 rounded-lg cursor-pointer transition"
                style={{
                  borderColor: answers[currentQuestion] === index ? '#22c55e' : '#e5e7eb',
                  backgroundColor: answers[currentQuestion] === index ? '#f0fdf4' : 'transparent',
                }}
              >
                <input
                  type="radio"
                  name="answer"
                  value={index}
                  checked={answers[currentQuestion] === index}
                  onChange={() => handleAnswerSelect(index)}
                  className="w-4 h-4 text-green-600 cursor-pointer"
                />
                <span className="ml-3 text-gray-800 dark:text-gray-100">{option}</span>
              </label>
            ))}
          </div>

          {/* Explanation if available */}
          {question.explanation && answers[currentQuestion] !== -1 && (
            <div className="mb-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <p className="text-sm text-gray-700 dark:text-gray-300">
                <span className="font-semibold">💡 Explanation: </span>
                {question.explanation}
              </p>
            </div>
          )}

          {/* Navigation and Submit */}
          <div className="flex items-center justify-between">
            <div className="flex gap-3">
              <button
                onClick={handlePrevQuestion}
                disabled={currentQuestion === 0}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 disabled:opacity-50 transition"
              >
                ← Previous
              </button>

              <button
                onClick={handleNextQuestion}
                disabled={currentQuestion === game.questions.length - 1}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 disabled:opacity-50 transition"
              >
                Next →
              </button>
            </div>

            <div className="text-sm text-gray-600">
              Answered: <span className="font-semibold">{answeredCount}/{game.questions.length}</span>
            </div>
          </div>

          {currentQuestion === game.questions.length - 1 && (
            <button
              onClick={handleSubmitGame}
              disabled={submitting || answers.includes(-1)}
              className="w-full mt-4 px-4 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:shadow-md disabled:opacity-50 transition font-semibold"
            >
              {submitting ? 'Submitting...' : 'Submit Quiz'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default GameQuizModal;
