import React, { Suspense, useEffect, useState } from "react";
import Spline from "@splinetool/react-spline";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";
import api from "../utils/api";
import { useAuth } from "../context/AuthContext";

const MAX_ECO_POINTS = 500;

const getForestLevel = (ecoPoints) => {
  if (ecoPoints < 100) return 1; // Dry
  if (ecoPoints < 300) return 2; // Growing
  return 3; // Healthy
};

const getForestState = (ecoPoints) => {
  if (ecoPoints < 100) return "polluted";
  if (ecoPoints < 300) return "growing";
  return "healthy";
};

const getForestStatusText = (forestState) => {
  if (forestState === "polluted") return "🌫️ Polluted Forest";
  if (forestState === "growing") return "🌱 Growing Forest";
  if (forestState === "healthy") return "🌳 Healthy Forest";
  return "🌿 Forest";
};

const getForestMessage = (forestState) => {
  if (forestState === "polluted") return "Your forest needs help! 🌫️";
  if (forestState === "growing") return "Your forest is improving 🌱";
  if (forestState === "healthy") return "Amazing! Your forest is thriving 🌳";
  return "Keep growing your forest!";
};

const Forest = () => {
  const { user } = useAuth();
  const [ecoPoints, setEcoPoints] = useState(0);
  const [previousEcoPoints, setPreviousEcoPoints] = useState(0);
  const [forestState, setForestState] = useState(getForestState(0));
  const [forestLevel, setForestLevel] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [clickEffects, setClickEffects] = useState([]);
  const [lastClickTime, setLastClickTime] = useState(0);

  useEffect(() => {
    const loadEcoPoints = async () => {
      try {
        let points = user?.ecoPoints ?? null;

        if (points === null || points === undefined) {
          // fallback to API call
          const response = await api.get("/auth/me");
          points = response?.data?.user?.ecoPoints ?? 0;
        }

        const currentPoints = typeof points === "number" ? points : Number(points) || 0;
        setEcoPoints(currentPoints);
        setPreviousEcoPoints(currentPoints);
        setError(null);
      } catch (err) {
        console.error("Failed to load eco points:", err);
        setError("Unable to load eco points. Please refresh.");
      } finally {
        setLoading(false);
      }
    };

    loadEcoPoints();
  }, [user]);

  useEffect(() => {
    setForestState(getForestState(ecoPoints));
    setForestLevel(getForestLevel(ecoPoints));
  }, [ecoPoints]);

  // Detect level up and show animation
  useEffect(() => {
    const currentLevel = getForestLevel(ecoPoints);
    const previousLevel = getForestLevel(previousEcoPoints);

    if (currentLevel > previousLevel && ecoPoints > previousEcoPoints) {
      // Level up occurred!
      let message = "";
      if (currentLevel === 2) {
        message = "🌱 Your forest is growing!";
      } else if (currentLevel === 3) {
        message = "🌳 Your forest is thriving!";
      }

      if (message) {
        // Trigger confetti
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      }
    }

    setPreviousEcoPoints(ecoPoints);
  }, [ecoPoints, previousEcoPoints]);

  const progressPct = Math.min(Math.max((ecoPoints / MAX_ECO_POINTS) * 100, 0), 100);

  const handleForestClick = async (event) => {
    // Prevent multiple rapid clicks
    if (Date.now() - lastClickTime < 500) return;
    setLastClickTime(Date.now());

    try {
      // Add visual feedback
      const clickEffect = {
        id: Date.now(),
        x: event.clientX,
        y: event.clientY,
        points: Math.floor(Math.random() * 5) + 1
      };

      setClickEffects(prev => [...prev, clickEffect]);

      // Remove effect after animation
      setTimeout(() => {
        setClickEffects(prev => prev.filter(e => e.id !== clickEffect.id));
      }, 1000);

      // Update eco points
      const newPoints = ecoPoints + clickEffect.points;
      setEcoPoints(newPoints);

      // Update user context if available
      if (user && user.updateEcoPoints) {
        user.updateEcoPoints(newPoints);
      }

      // Optional: Save to backend
      try {
        await api.put("/auth/update-eco-points", { ecoPoints: newPoints });
      } catch (err) {
        console.error("Failed to save eco points:", err);
      }
    } catch (err) {
      console.error("Failed to handle forest click:", err);
    }
  };

  return (
    <div className="min-h-screen bg-green-50 dark:bg-gray-900 p-6">
      <h1 className="text-2xl font-bold mb-4 text-center">🌳 Your Eco Forest</h1>

      <div className="h-[500px] w-full rounded-2xl overflow-hidden shadow-lg relative">
        <Suspense
          fallback={
            <div className="h-full w-full bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900 dark:to-green-800 rounded-2xl flex items-center justify-center">
              <div className="text-center">
                <div className="text-4xl mb-2">🌿</div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Loading 3D Forest...</p>
              </div>
            </div>
          }
        >
          <Spline
            scene="https://prod.spline.design/wVkDLdu81OjBUmL1/scene.splinecode"
            onClick={handleForestClick}
            style={{ cursor: 'pointer' }}
          />

          {/* Dynamic Overlay */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="absolute top-4 left-4 right-4 z-10"
          >
            <div className="flex justify-between items-start">
              {/* Eco Points Display */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="backdrop-blur-md bg-white/20 rounded-2xl p-4 border border-white/30 shadow-lg"
              >
                <div className="flex items-center gap-3">
                  <motion.div
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    className="text-2xl"
                  >
                    🌱
                  </motion.div>
                  <div>
                    <div className="text-white font-semibold text-lg">
                      {ecoPoints.toLocaleString()}
                    </div>
                    <div className="text-white/80 text-sm">Eco Points</div>
                  </div>
                </div>
              </motion.div>

              {/* Level Badge */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="backdrop-blur-md bg-white/20 rounded-2xl p-4 border border-white/30 shadow-lg"
              >
                <div className="flex items-center gap-3">
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="text-2xl"
                  >
                    {forestLevel === 1 ? "🌵" : forestLevel === 2 ? "🌿" : "🌳"}
                  </motion.div>
                  <div>
                    <div className="text-white font-semibold text-lg">
                      Level {forestLevel}
                    </div>
                    <div className="text-white/80 text-sm">
                      {forestLevel === 1 ? "Dry" : forestLevel === 2 ? "Growing" : "Healthy"}
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Forest Status */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="absolute bottom-4 left-4 right-4 z-10"
          >
            <div className="backdrop-blur-md bg-white/20 rounded-2xl p-4 border border-white/30 shadow-lg">
              <div className="text-center">
                <motion.div
                  animate={{ opacity: [0.7, 1, 0.7] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="text-white font-semibold text-lg mb-1"
                >
                  {getForestStatusText(forestState)}
                </motion.div>
                <div className="text-white/80 text-sm">
                  {getForestMessage(forestState)}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Floating Animations */}
          <FloatingAnimations forestLevel={forestLevel} />

          {/* Click Effects */}
          {clickEffects.map((effect) => (
            <motion.div
              key={effect.id}
              initial={{
                x: effect.x - 20,
                y: effect.y - 20,
                opacity: 1,
                scale: 0.5
              }}
              animate={{
                y: effect.y - 80,
                opacity: 0,
                scale: 1.2
              }}
              transition={{
                duration: 0.3,
                ease: "easeOut"
              }}
              className="absolute z-30 pointer-events-none"
            >
              <div className="bg-green-500 text-white font-bold px-2 py-1 rounded-full text-sm shadow-lg">
                +{effect.points}
              </div>
            </motion.div>
          ))}
        </Suspense>
      </div>

      <div className="mt-5 max-w-3xl mx-auto"> 
        {loading ? (
          <p className="text-center text-gray-600">Loading eco points...</p>
        ) : error ? (
          <p className="text-center text-red-600">{error}</p>
        ) : (
          <>
            <p className="text-center mt-4 text-lg font-semibold text-green-700">
              {getForestStatusText(forestState)}
            </p>

            <div className="w-full bg-gray-200 rounded-full h-3 mt-3">
              <div
                className="bg-green-500 h-3 rounded-full transition-all duration-500"
                style={{ width: `${progressPct}%` }}
              ></div>
            </div>

            <p className="text-center mt-2 text-sm text-gray-600">
              {getForestMessage(forestState)}
            </p>

            <p className="text-center mt-2 text-sm text-gray-600">
              Eco Points: <strong>{ecoPoints}</strong> / {MAX_ECO_POINTS} ({progressPct.toFixed(0)}%)
            </p>
          </>
        )}
      </div>
    </div>
  );
};

// Floating Animations Component
const FloatingAnimations = ({ forestLevel }) => {
  const [animations, setAnimations] = useState([]);

  useEffect(() => {
    const createAnimation = () => {
      const types = [];
      if (forestLevel >= 1) types.push('leaf');
      if (forestLevel >= 2) types.push('sparkle', 'bird');
      if (forestLevel >= 3) types.push('butterfly');

      const type = types[Math.floor(Math.random() * types.length)];
      const id = Date.now() + Math.random();

      const animation = {
        id,
        type,
        x: Math.random() * 100,
        duration: 8 + Math.random() * 12,
        delay: Math.random() * 5,
        size: 0.8 + Math.random() * 0.4,
      };

      setAnimations(prev => [...prev, animation]);

      // Remove animation after it completes
      setTimeout(() => {
        setAnimations(prev => prev.filter(a => a.id !== id));
      }, (animation.duration + animation.delay) * 1000);
    };

    // Create animations at different intervals based on level
    const interval = setInterval(createAnimation, 3000 - (forestLevel * 500));

    return () => clearInterval(interval);
  }, [forestLevel]);

  const getAnimationElement = (animation) => {
    const { type, x, duration, delay, size } = animation;

    switch (type) {
      case 'leaf':
        return '🍃';
      case 'sparkle':
        return '✨';
      case 'bird':
        return '🐦';
      case 'butterfly':
        return '🦋';
      default:
        return '🌟';
    }
  };

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {animations.map((animation) => (
        <motion.div
          key={animation.id}
          initial={{
            x: `${animation.x}vw`,
            y: '100vh',
            opacity: 0,
            scale: animation.size,
            rotate: 0
          }}
          animate={{
            y: '-10vh',
            opacity: [0, 1, 1, 0],
            rotate: animation.type === 'leaf' ? [0, 180, 360] : [0, 10, -10, 0],
            x: animation.type === 'bird' ? [
              `${animation.x}vw`,
              `${(animation.x + 20) % 100}vw`,
              `${(animation.x + 40) % 100}vw`
            ] : `${animation.x}vw`
          }}
          transition={{
            duration: animation.duration,
            delay: animation.delay,
            ease: "easeOut",
            rotate: {
              duration: animation.type === 'leaf' ? 3 : 1,
              repeat: animation.type === 'sparkle' ? Infinity : 0,
              ease: "linear"
            }
          }}
          className="absolute text-2xl z-5"
          style={{
            fontSize: `${animation.size * 1.5}rem`,
            filter: animation.type === 'sparkle' ? 'drop-shadow(0 0 8px rgba(255,255,255,0.8))' : 'none'
          }}
        >
          {getAnimationElement(animation)}
        </motion.div>
      ))}
    </div>
  );
};

export default Forest;