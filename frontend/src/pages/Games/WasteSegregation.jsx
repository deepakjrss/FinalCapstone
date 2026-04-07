import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import gameService from '../../services/gameService';

const wasteItemsData = [
  { id: 1, name: 'Bottle', type: 'plastic', icon: '🧴' },
  { id: 2, name: 'Newspaper', type: 'paper', icon: '📰' },
  { id: 3, name: 'Banana Peel', type: 'organic', icon: '🍌' },
  { id: 4, name: 'Plastic Bag', type: 'plastic', icon: '🛍️' },
  { id: 5, name: 'Cardboard Box', type: 'paper', icon: '📦' },
  { id: 6, name: 'Apple Core', type: 'organic', icon: '🍎' }
];

const bins = [
  { type: 'plastic', label: 'Plastic', color: 'bg-blue-400', hover: 'hover:scale-105', border: 'border-blue-600' },
  { type: 'paper', label: 'Paper', color: 'bg-yellow-400', hover: 'hover:scale-105', border: 'border-yellow-600' },
  { type: 'organic', label: 'Organic', color: 'bg-green-400', hover: 'hover:scale-105', border: 'border-green-600' }
];

const WasteSegregation = () => {
  const navigate = useNavigate();
  const { user, updateEcoPoints } = useAuth();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [message, setMessage] = useState('Drag the item into the correct bin!');
  const [gameMessage, setGameMessage] = useState('');

  const currentItem = wasteItemsData[currentIndex];

  const isGameOver = currentIndex >= wasteItemsData.length;

  const handleDragStart = (item) => {
    // no-op (drag data is stored implicitly by item type)
  };

  const nextItem = () => {
    setCurrentIndex((prev) => prev + 1);
  };

  const handleDrop = async (binType, droppedType) => {
    if (!currentItem) return;

    let messageText = '';
    let earnedPoints = 0;
    const isCorrect = droppedType === binType;
    if (isCorrect) {
      earnedPoints = 10;
      setScore((prevState) => prevState + earnedPoints);
      messageText = '✅ Correct! +10 eco-points';
      setMessage(messageText);
      setGameMessage('Great job!');

      try {
        const response = await gameService.addPoints(earnedPoints);
        if (response.success && response.data) {
          if (updateEcoPoints) updateEcoPoints(earnedPoints);
          setGameMessage(`Awesome! +${earnedPoints} eco-points added to your profile.`);
        } else {
          setGameMessage('Saved locally; server update failed.');
        }
      } catch (error) {
        console.error('Add points error:', error);
        setGameMessage('✅ Correct, but could not update server points right now.');
      }
    } else {
      messageText = '❌ Wrong bin. Try again!';
      setMessage(messageText);
      setGameMessage('Keep trying!');
    }

    await new Promise((resolve) => setTimeout(resolve, 400));

    if (currentIndex < wasteItemsData.length - 1) {
      nextItem();
    } else {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handleRestart = () => {
    setScore(0);
    setCurrentIndex(0);
    setMessage('Drag the item into the correct bin!');
    setGameMessage('');
  };

  const binShadow = 'shadow-lg hover:shadow-2xl transition-transform duration-200';

  return (
    <div className="min-h-screen bg-gradient-to-b from-cyan-100 via-white to-green-100">
      <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl md:text-5xl font-extrabold text-green-700">♻️ Waste Segregation</h1>
          <button
            onClick={() => navigate('/games')}
            className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 shadow-md"
          >
            Back to Games
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2 rounded-2xl p-6 bg-white shadow-xl border border-green-200">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold">Score: {score}</h2>
              <p className="text-lg font-semibold text-gray-700">Player: {user?.name || 'Guest'}</p>
            </div>
            <p className="text-sm text-gray-600 mb-4">{message}</p>

            {!isGameOver ? (
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentItem.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  className="rounded-xl bg-indigo-50 border-2 border-indigo-200 p-10 text-center shadow-lg"
                >
                  <div
                    draggable
                    onDragStart={(e) => {
                      e.dataTransfer.setData('text/plain', currentItem.type);
                      handleDragStart(currentItem);
                    }}
                    className="cursor-grab select-none"
                  >
                    <div className="text-8xl mb-4">{currentItem.icon}</div>
                    <h3 className="text-3xl font-bold text-indigo-600">{currentItem.name}</h3>
                    <p className="text-sm pt-2 text-gray-500">Drag this item into the right bin.</p>
                  </div>
                </motion.div>
              </AnimatePresence>
            ) : (
              <div className="rounded-xl bg-yellow-100 border-2 border-yellow-300 p-10 text-center shadow-lg">
                <h3 className="text-3xl font-bold text-yellow-700">🎉 Game Over!</h3>
                <p className="mt-2 text-lg text-gray-700">Your total score: <span className="font-black">{score}</span></p>
                <p className="mt-2 text-green-600">Great job saving the planet 🌍</p>
              </div>
            )}

            <div className="mt-4 p-4 rounded-xl bg-white border border-gray-200 text-center shadow-sm">
              <p className="text-sm text-gray-700">{gameMessage}</p>
            </div>

            {isGameOver && (
              <button
                onClick={handleRestart}
                className="mt-4 px-5 py-2 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition"
              >
                Restart Game
              </button>
            )}
          </div>

          <div className="rounded-2xl p-6 bg-white shadow-xl border border-green-200">
            <h3 className="text-2xl font-bold mb-4 text-center">Bins</h3>
            <div className="grid grid-cols-1 gap-4">
              {bins.map((bin) => (
                <motion.div
                  key={bin.type}
                  whileHover={{ scale: 1.05 }}
                  className={`${binShadow} ${bin.color} ${bin.border} border-2 rounded-xl p-6 text-center cursor-pointer`}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();
                    const droppedType = e.dataTransfer.getData('text/plain');
                    handleDrop(bin.type, droppedType);
                  }}
                >
                  <p className="text-xl font-bold text-white">{bin.label}</p>
                  <p className="text-sm text-white mt-2">Drop {bin.type} items here</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        <div className="text-center text-gray-600 font-semibold">Drag item to any bin to play. {currentIndex + 1}/{wasteItemsData.length}</div>
      </div>
    </div>
  );
};

export default WasteSegregation;
