import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import gameService from '../../services/gameService';
import ModernSidebar from '../../components/ModernSidebar';
import ModernTopNavbar from '../../components/ModernTopNavbar';
import {
  ModernContainer,
  ModernCard,
  ModernButton,
} from '../../components/ModernComponents';

const questions = [
  {
    question: 'Which action saves the most water?',
    options: ['Long shower', 'Short shower', 'Leave tap open', 'Wash car daily'],
    correctAnswer: 'Short shower',
  },
  {
    question: 'Which item belongs in the plastic bin?',
    options: ['Newspaper', 'Glass jar', 'Plastic bottle', 'Banana peel'],
    correctAnswer: 'Plastic bottle',
  },
  {
    question: 'Which is best for the planet?',
    options: ['Use one-use plastics', 'Plant a tree', 'Throw recyclables away', 'Leave lights on'],
    correctAnswer: 'Plant a tree',
  },
  {
    question: 'What should you do with paper waste?',
    options: ['Recycle it', 'Burn it', 'Throw it in the ocean', 'Bury it'],
    correctAnswer: 'Recycle it',
  },
  {
    question: 'Which ride saves energy?',
    options: ['Drive alone', 'Ride a bike', 'Fly a plane', 'Leave car running'],
    correctAnswer: 'Ride a bike',
  },
];

const QuizGame = () => {
  const navigate = useNavigate();
  const { updateEcoPoints } = useAuth();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [timer, setTimer] = useState(10);
  const [score, setScore] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [status, setStatus] = useState('idle');
  const [showResult, setShowResult] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  const currentQuestion = questions[currentIndex];

  useEffect(() => {
    if (showResult) return;
    setTimer(10);
    setSelectedOption(null);
    setStatus('idle');
  }, [currentIndex, showResult]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (showResult || selectedOption) return;
    if (timer <= 0) {
      setStatus('timeout');
      const timeoutId = setTimeout(() => handleNextQuestion(false), 1000);
      return () => clearTimeout(timeoutId);
    }

    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer, selectedOption, showResult]);

  const handleNextQuestion = async (wasCorrect) => {
    const isLast = currentIndex === questions.length - 1;
    const nextScore = wasCorrect ? score + 10 : score;

    if (isLast) {
      finishQuiz(nextScore);
      return;
    }

    setScore(nextScore);
    setCurrentIndex((prev) => prev + 1);
  };

  const finishQuiz = async (finalScore) => {
    setScore(finalScore);
    setShowResult(true);

    if (finalScore > 0) {
      try {
        const response = await gameService.addPoints(finalScore);
        if (response.success && response.data) {
          if (updateEcoPoints) updateEcoPoints(finalScore);
          setSaveMessage('Eco points updated!');
        } else {
          setSaveMessage('Saved locally; server update failed.');
        }
      } catch (error) {
        console.error('Quiz save error:', error);
        setSaveMessage('Saved locally; server update failed.');
      }
    } else {
      setSaveMessage('No points earned this time. Try again!');
    }
  };

  const handleAnswerClick = (option) => {
    if (selectedOption || showResult || status !== 'idle') return;

    const isCorrect = option === currentQuestion.correctAnswer;
    const nextScore = isCorrect ? score + 10 : score;

    setSelectedOption(option);
    setStatus(isCorrect ? 'correct' : 'incorrect');
    setScore(nextScore);

    setTimeout(() => {
      handleNextQuestion(isCorrect);
    }, 1000);
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setTimer(10);
    setScore(0);
    setSelectedOption(null);
    setStatus('idle');
    setShowResult(false);
    setSaveMessage('');
  };

  const renderOptionClass = (option) => {
    if (!selectedOption && status !== 'timeout') {
      return 'bg-white border border-gray-200 hover:border-green-400';
    }

    if (status === 'correct' && option === selectedOption) {
      return 'bg-emerald-100 border border-emerald-400 text-emerald-800';
    }

    if (status === 'incorrect' && option === selectedOption) {
      return 'bg-red-100 border border-red-400 text-red-800';
    }

    if ((status === 'incorrect' || status === 'timeout') && option === currentQuestion.correctAnswer) {
      return 'bg-emerald-100 border border-emerald-400 text-emerald-800';
    }

    return 'bg-white border border-gray-200';
  };

  if (showResult) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-cyan-100 via-white to-green-100">
        <ModernTopNavbar />
        <div className="flex flex-1 pt-16">
          <ModernSidebar />
          <main className="flex-1 overflow-auto pl-64">
            <ModernContainer className="py-8">
              <ModernCard>
                <div className="text-center p-10">
                  <h1 className="text-4xl font-bold text-green-700 mb-4">Great job! 🌍</h1>
                  <p className="text-lg text-gray-700 mb-6">You completed the quiz.</p>
                  <p className="text-6xl font-extrabold text-green-600 mb-4">{score}</p>
                  <p className="text-sm uppercase tracking-wide text-gray-500 mb-6">Total Quiz Score</p>
                  <p className="text-sm text-gray-600 mb-6">{saveMessage}</p>
                  <div className="flex flex-col sm:flex-row justify-center gap-4 mt-6">
                    <ModernButton onClick={handleRestart} className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl">
                      Play Again
                    </ModernButton>
                    <ModernButton onClick={() => navigate('/games')} className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl">
                      Back to Games
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-cyan-100 via-white to-green-100">
      <ModernTopNavbar />
      <div className="flex flex-1 pt-16">
        <ModernSidebar />
        <main className="flex-1 overflow-auto pl-64">
          <ModernContainer className="py-8">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div>
                  <p className="text-sm uppercase tracking-[0.3em] text-green-700 font-semibold">Quiz Game</p>
                  <h1 className="text-4xl font-extrabold text-slate-900">Save the Planet Quiz</h1>
                  <p className="text-gray-600 mt-2">Answer quickly, score points, and earn eco rewards!</p>
                </div>
                <div className="flex flex-wrap gap-3">
                  <div className="rounded-2xl bg-white border border-gray-200 px-4 py-3 shadow-sm">
                    <p className="text-sm text-gray-500">Score</p>
                    <p className="text-2xl font-bold text-green-600">{score}</p>
                  </div>
                  <div className="rounded-2xl bg-white border border-gray-200 px-4 py-3 shadow-sm">
                    <p className="text-sm text-gray-500">Time left</p>
                    <p className="text-2xl font-bold text-orange-600">{timer}s</p>
                  </div>
                </div>
              </div>

              <motion.div
                key={currentQuestion.question}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="bg-white rounded-3xl shadow-2xl border border-gray-200 p-8"
              >
                <div className="mb-6">
                  <p className="text-sm text-gray-500 uppercase tracking-[0.3em]">Question {currentIndex + 1} of {questions.length}</p>
                  <h2 className="mt-4 text-3xl font-bold text-slate-900">{currentQuestion.question}</h2>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  {currentQuestion.options.map((option) => (
                    <motion.button
                      key={option}
                      whileHover={{ scale: selectedOption ? 1 : 1.02 }}
                      whileTap={{ scale: selectedOption ? 1 : 0.98 }}
                      onClick={() => handleAnswerClick(option)}
                      disabled={!!selectedOption}
                      className={`${renderOptionClass(option)} rounded-3xl p-5 text-left transition duration-300 shadow-sm focus:outline-none ${selectedOption ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                    >
                      <span className="text-base font-semibold">{option}</span>
                      {selectedOption === option && status === 'correct' && (
                        <span className="block mt-2 text-sm text-emerald-700">Correct!</span>
                      )}
                      {selectedOption === option && status === 'incorrect' && (
                        <span className="block mt-2 text-sm text-red-700">Wrong answer</span>
                      )}
                    </motion.button>
                  ))}
                </div>

                <div className="mt-6 text-sm text-gray-600">
                  {status === 'timeout' && 'Time is up! The correct answer is highlighted.'}
                  {status === 'incorrect' && 'Oops! The correct answer is highlighted and the next question will start shortly.'}
                  {status === 'correct' && 'Nice! You earned 10 points.'}
                </div>
              </motion.div>
            </div>
          </ModernContainer>
        </main>
      </div>
    </div>
  );
};

export default QuizGame;
