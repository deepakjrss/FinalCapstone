import React from 'react';

const GameCard = ({ game, onPlay }) => {
  const difficultyColors = {
    easy: 'bg-green-100 text-green-800',
    medium: 'bg-yellow-100 text-yellow-800',
    hard: 'bg-red-100 text-red-800',
  };

  const categoryIcons = {
    'renewable-energy': '⚡',
    conservation: '🦁',
    climate: '🌍',
    sustainability: '♻️',
    'waste-management': '🗑️',
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition cursor-pointer border-l-4 border-green-500">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">{game.title}</h3>
          <p className="text-sm text-gray-600 mt-1">{game.description}</p>
        </div>
        <span className="text-2xl">
          {categoryIcons[game.category] || '🎯'}
        </span>
      </div>

      <div className="flex items-center justify-between mt-4">
        <div className="flex gap-3">
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${difficultyColors[game.difficulty]}`}>
            {game.difficulty.charAt(0).toUpperCase() + game.difficulty.slice(1)}
          </span>
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
            {game.questions ? game.questions.length : 0} Q
          </span>
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-800">
            {game.maxPoints} pts
          </span>
        </div>
      </div>

      <button
        onClick={() => onPlay(game._id)}
        className="w-full mt-4 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:shadow-md transition font-semibold"
      >
        Play Game
      </button>
    </div>
  );
};

export default GameCard;
