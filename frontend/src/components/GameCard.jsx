import React from 'react';
import { motion } from 'framer-motion';

const GameCard = ({ game, onPlay }) => {
  const difficultyColors = {
    easy: 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400 border-l-4 border-green-500',
    medium: 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-400 border-l-4 border-yellow-500',
    hard: 'bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-400 border-l-4 border-red-500',
  };

  const difficultyEmoji = {
    easy: '🟢',
    medium: '🟡',
    hard: '🔴',
  };

  const categoryIcons = {
    'renewable-energy': '⚡',
    'renewable-sources': '⚡',
    conservation: '🦁',
    climate: '🌍',
    sustainability: '♻️',
    'waste-management': '🗑️',
    'waste-segregation': '🗑️',
    default: '🎯'
  };

  const getIcon = () => {
    return categoryIcons[game.category] || categoryIcons.default;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      whileHover={{ scale: 1.05, y: -5 }}
      className={`relative overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer ${difficultyColors[game.difficulty] || difficultyColors.easy} p-6`}
    >
      {/* Animated Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      
      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              {game.title}
            </h3>
            <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-2">
              {game.description || 'Test your eco knowledge!'}
            </p>
          </div>
          <span className="text-4xl ml-4 animate-bounce flex-shrink-0">
            {getIcon()}
          </span>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-2 mb-4 py-3 border-t border-b border-gray-300/30">
          <div className="text-center">
            <p className="text-xs font-semibold text-gray-700 dark:text-gray-300">Questions</p>
            <p className="text-lg font-bold text-gray-900 dark:text-gray-100">
              {game.questions ? game.questions.length : 0}
            </p>
          </div>
          <div className="text-center">
            <p className="text-xs font-semibold text-gray-700 dark:text-gray-300">Max Points</p>
            <p className="text-lg font-bold text-green-600 dark:text-green-400">
              {game.maxPoints || 100}
            </p>
          </div>
          <div className="text-center">
            <p className="text-xs font-semibold text-gray-700 dark:text-gray-300">Difficulty</p>
            <p className="text-xl">
              {difficultyEmoji[game.difficulty] || '🟢'}
            </p>
          </div>
        </div>

        {/* Difficulty Badge */}
        <div className="mb-4">
          <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
            game.difficulty === 'easy' ? 'bg-green-500 text-white' :
            game.difficulty === 'medium' ? 'bg-yellow-500 text-gray-900' :
            'bg-red-500 text-white'
          }`}>
            {game.difficulty ? game.difficulty.charAt(0).toUpperCase() + game.difficulty.slice(1) : 'Easy'} Level
          </span>
        </div>

        {/* Play Button */}
        <motion.button
          onClick={() => onPlay(game.route || game._id)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-full px-4 py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold rounded-lg shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2"
        >
          <span>🎮</span>
          <span>Play Now</span>
        </motion.button>
      </div>
    </motion.div>
  );
};

export default GameCard;
