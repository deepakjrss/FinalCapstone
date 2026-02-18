const Forest = require('../models/Forest');

/**
 * Get class vs class leaderboard
 * GET /api/leaderboard
 * Access: Student, Teacher (protected)
 * 
 * Returns ranked list of classes sorted by ecoScore
 */
exports.getLeaderboard = async (req, res) => {
  try {
    // Fetch all forests sorted by ecoScore in descending order
    const forests = await Forest.find()
      .sort({ ecoScore: -1 })
      .lean(); // Use lean() for better performance

    if (!forests || forests.length === 0) {
      return res.status(200).json({
        success: true,
        leaderboard: [],
        message: 'No forest data available yet'
      });
    }

    // Add rank number dynamically
    const leaderboard = forests.map((forest, index) => ({
      rank: index + 1,
      className: forest.className,
      ecoScore: forest.ecoScore,
      forestState: forest.forestState,
      lastUpdated: forest.lastUpdated
    }));

    res.status(200).json({
      success: true,
      leaderboard,
      totalClasses: leaderboard.length,
      topClass: leaderboard[0] || null,
      message: 'Leaderboard retrieved successfully'
    });
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve leaderboard',
      error: error.message
    });
  }
};

/**
 * Get leaderboard by forest state
 * GET /api/leaderboard/state/:state
 * Access: Student, Teacher (protected)
 * 
 * Filter and return classes by forestState (polluted, growing, healthy)
 */
exports.getLeaderboardByState = async (req, res) => {
  try {
    const { state } = req.params;

    // Validate state parameter
    const validStates = ['polluted', 'growing', 'healthy'];
    if (!validStates.includes(state.toLowerCase())) {
      return res.status(400).json({
        success: false,
        message: `Invalid forest state. Valid states are: ${validStates.join(', ')}`
      });
    }

    // Fetch forests filtered by state, sorted by ecoScore
    const forests = await Forest.find({ forestState: state.toLowerCase() })
      .sort({ ecoScore: -1 })
      .lean();

    if (!forests || forests.length === 0) {
      return res.status(200).json({
        success: true,
        leaderboard: [],
        state: state.toLowerCase(),
        message: `No classes with '${state}' forest state found`
      });
    }

    // Add rank number
    const leaderboard = forests.map((forest, index) => ({
      rank: index + 1,
      className: forest.className,
      ecoScore: forest.ecoScore,
      forestState: forest.forestState,
      lastUpdated: forest.lastUpdated
    }));

    res.status(200).json({
      success: true,
      leaderboard,
      state: state.toLowerCase(),
      count: leaderboard.length,
      message: `Leaderboard retrieved for '${state}' forest state`
    });
  } catch (error) {
    console.error('Error fetching leaderboard by state:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve leaderboard',
      error: error.message
    });
  }
};

/**
 * Get top N classes
 * GET /api/leaderboard/top/:limit
 * Access: Student, Teacher (protected)
 * 
 * Returns top N classes by ecoScore
 */
exports.getTopClasses = async (req, res) => {
  try {
    const { limit } = req.params;

    // Validate limit parameter
    const limitNum = parseInt(limit);
    if (isNaN(limitNum) || limitNum < 1 || limitNum > 100) {
      return res.status(400).json({
        success: false,
        message: 'Limit must be a number between 1 and 100'
      });
    }

    // Fetch top N forests
    const forests = await Forest.find()
      .sort({ ecoScore: -1 })
      .limit(limitNum)
      .lean();

    if (!forests || forests.length === 0) {
      return res.status(200).json({
        success: true,
        leaderboard: [],
        limit: limitNum,
        message: 'No forest data available'
      });
    }

    // Add rank number
    const leaderboard = forests.map((forest, index) => ({
      rank: index + 1,
      className: forest.className,
      ecoScore: forest.ecoScore,
      forestState: forest.forestState,
      lastUpdated: forest.lastUpdated
    }));

    res.status(200).json({
      success: true,
      leaderboard,
      limit: limitNum,
      count: leaderboard.length,
      message: `Top ${limitNum} classes retrieved successfully`
    });
  } catch (error) {
    console.error('Error fetching top classes:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve top classes',
      error: error.message
    });
  }
};

/**
 * Get class rank
 * GET /api/leaderboard/rank/:className
 * Access: Student, Teacher (protected)
 * 
 * Get a specific class's rank and position
 */
exports.getClassRank = async (req, res) => {
  try {
    const { className } = req.params;

    if (!className || className.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Class name is required'
      });
    }

    // Fetch forest for the specific class
    const forest = await Forest.findOne({
      className: className.toUpperCase()
    }).lean();

    if (!forest) {
      return res.status(404).json({
        success: false,
        message: `No forest data found for class ${className}`
      });
    }

    // Get all forests to find rank
    const allForests = await Forest.find()
      .sort({ ecoScore: -1 })
      .lean();

    // Find rank
    const rankIndex = allForests.findIndex(
      (f) => f.className === forest.className
    );

    const rank = rankIndex !== -1 ? rankIndex + 1 : null;

    res.status(200).json({
      success: true,
      class: {
        rank,
        className: forest.className,
        ecoScore: forest.ecoScore,
        forestState: forest.forestState,
        lastUpdated: forest.lastUpdated
      },
      totalClasses: allForests.length,
      message: `Rank retrieved for class ${className}`
    });
  } catch (error) {
    console.error('Error fetching class rank:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve class rank',
      error: error.message
    });
  }
};
