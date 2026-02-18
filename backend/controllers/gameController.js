const Game = require('../models/Game');
const Attempt = require('../models/Attempt');
const User = require('../models/User');
const Forest = require('../models/Forest');
const { checkAndAwardBadges } = require('./badgeController');

/**
 * Get all available games
 * GET /api/games
 * Access: Student only (protected)
 */
exports.getAvailableGames = async (req, res) => {
  try {
    const games = await Game.find({ isActive: true })
      .select('-questions') // Don't send answers yet
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: games.length,
      games,
      message: 'Available games retrieved successfully'
    });
  } catch (error) {
    console.error('Error fetching games:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve games',
      error: error.message
    });
  }
};

/**
 * Get single game by ID
 * GET /api/games/:id
 * Access: Student only (protected)
 */
exports.getGameById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'Game ID is required'
      });
    }

    const game = await Game.findById(id);

    if (!game) {
      return res.status(404).json({
        success: false,
        message: 'Game not found'
      });
    }

    if (!game.isActive) {
      return res.status(403).json({
        success: false,
        message: 'This game is not available'
      });
    }

    // Obfuscate correct answers by removing them
    const gameData = game.toObject();
    gameData.questions = gameData.questions.map(q => ({
      questionText: q.questionText,
      options: q.options,
      explanation: q.explanation
      // Don't send correctAnswer
    }));

    res.status(200).json({
      success: true,
      game: gameData,
      message: 'Game retrieved successfully'
    });
  } catch (error) {
    console.error('Error fetching game:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve game',
      error: error.message
    });
  }
};

/**
 * Submit game attempt and calculate score
 * POST /api/games/submit
 * Body: { gameId, answers: [0, 2, 1, ...] }
 * Access: Student only (protected)
 */
exports.submitGameAttempt = async (req, res) => {
  try {
    const { gameId, answers } = req.body;

    // Validation
    if (!gameId) {
      return res.status(400).json({
        success: false,
        message: 'Game ID is required'
      });
    }

    if (!Array.isArray(answers)) {
      return res.status(400).json({
        success: false,
        message: 'Answers must be an array'
      });
    }

    // Get game and validate
    const game = await Game.findById(gameId);

    if (!game) {
      return res.status(404).json({
        success: false,
        message: 'Game not found'
      });
    }

    if (!game.isActive) {
      return res.status(403).json({
        success: false,
        message: 'This game is not available'
      });
    }

    // Validate answers array length matches questions
    if (answers.length !== game.questions.length) {
      return res.status(400).json({
        success: false,
        message: `Expected ${game.questions.length} answers but received ${answers.length}`
      });
    }

    // Validate each answer is a valid index
    for (let i = 0; i < answers.length; i++) {
      if (typeof answers[i] !== 'number' || answers[i] < 0) {
        return res.status(400).json({
          success: false,
          message: `Invalid answer at position ${i}`
        });
      }
    }

    // Calculate score
    let correctCount = 0;
    for (let i = 0; i < answers.length; i++) {
      if (answers[i] === game.questions[i].correctAnswer) {
        correctCount++;
      }
    }

    const scorePercentage = (correctCount / game.questions.length) * 100;
    const pointsEarned = Math.round((scorePercentage / 100) * game.maxPoints);
    const passed = scorePercentage >= game.minPassScore;

    // Get student
    const student = await User.findById(req.user._id);

    if (!student) {
      return res.status(401).json({
        success: false,
        message: 'Student not found'
      });
    }

    if (student.role !== 'student') {
      return res.status(403).json({
        success: false,
        message: 'Only students can submit game attempts'
      });
    }

    // Create attempt
    const attempt = new Attempt({
      student: student._id,
      game: game._id,
      answers,
      score: scorePercentage,
      pointsEarned,
      passed,
      completedAt: new Date()
    });

    await attempt.save();

    // Update student's ecoPoints
    student.ecoPoints = (student.ecoPoints || 0) + pointsEarned;
    // Increment games played count
    student.gamesPlayed = (student.gamesPlayed || 0) + 1;
    await student.save();

    // Check and award badges
    const newlyEarnedBadges = await checkAndAwardBadges(student._id);

    // Update forest for student's class
    let forest = await Forest.getOrCreate(student.className);
    forest.ecoScore += pointsEarned;
    await forest.save(); // Pre-save hook will update forestState

    // Populate attempt data for response
    await attempt.populate('game', 'title maxPoints minPassScore');

    res.status(201).json({
      success: true,
      attempt: {
        _id: attempt._id,
        game: attempt.game,
        score: attempt.score,
        pointsEarned: attempt.pointsEarned,
        passed: attempt.passed,
        correctAnswers: correctCount,
        totalQuestions: game.questions.length,
        completedAt: attempt.completedAt
      },
      studentStats: {
        ecoPoints: student.ecoPoints,
        gamesPlayed: student.gamesPlayed,
        className: student.className
      },
      forest: {
        className: forest.className,
        ecoScore: forest.ecoScore,
        forestState: forest.forestState,
        lastUpdated: forest.lastUpdated
      },
      badges: newlyEarnedBadges,
      message: `Game completed! You scored ${scorePercentage.toFixed(1)}% and earned ${pointsEarned} eco-points.${newlyEarnedBadges.length > 0 ? ` 🎉 You earned ${newlyEarnedBadges.length} new badge(s)!` : ''}`
    });
  } catch (error) {
    console.error('Error submitting game attempt:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit game attempt',
      error: error.message
    });
  }
};

/**
 * Get student's game stats
 * GET /api/games/stats/progress
 * Access: Student only (protected)
 */
exports.getStudentGameStats = async (req, res) => {
  try {
    const studentId = req.user._id;

    const stats = await Attempt.getStudentStats(studentId);

    res.status(200).json({
      success: true,
      stats,
      message: 'Student game statistics retrieved successfully'
    });
  } catch (error) {
    console.error('Error fetching student stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve statistics',
      error: error.message
    });
  }
};

/**
 * Get student's attempt history
 * GET /api/games/attempts/history
 * Access: Student only (protected)
 */
exports.getStudentAttempts = async (req, res) => {
  try {
    const studentId = req.user._id;
    const { gameId } = req.query;

    let filter = { student: studentId };
    if (gameId) {
      filter.game = gameId;
    }

    const attempts = await Attempt.find(filter)
      .populate('game', 'title category difficulty maxPoints')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: attempts.length,
      attempts,
      message: 'Student attempts retrieved successfully'
    });
  } catch (error) {
    console.error('Error fetching attempts:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve attempts',
      error: error.message
    });
  }
};
