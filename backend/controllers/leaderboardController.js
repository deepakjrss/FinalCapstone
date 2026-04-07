const Forest = require('../models/Forest');
const User = require('../models/User');
const StudentBadge = require('../models/StudentBadge');
const Badge = require('../models/Badge');

/**
 * Get leaderboard - class vs class or individual student leaderboard
 * GET /api/leaderboard?type=class|school
 * Access: Student, Teacher (protected)
 * 
 * If type=class: Top 10 students in same class by ecoPoints
 * If type=school: Top 10 students in same school by ecoPoints
 * Else: Class vs class leaderboard
 */
exports.getLeaderboard = async (req, res) => {
  try {
    const { type } = req.query;

    if (type === 'class' || type === 'school') {
      // Individual student leaderboard
      let filter = {
        role: 'student',
        status: 'approved'
      };

      if (type === 'class') {
        filter.class = req.user.class;
      } else if (type === 'school') {
        filter.school = req.user.school;
      }

      const users = await User.find(filter)
        .sort({ ecoPoints: -1 })
        .limit(10)
        .select('name ecoPoints _id')
        .lean();

      if (!users || users.length === 0) {
        return res.status(200).json({
          success: true,
          leaderboard: [],
          type,
          message: 'No leaderboard data available'
        });
      }

      // Get top badge for each user
      const leaderboard = await Promise.all(users.map(async (user, index) => {
        const topBadge = await StudentBadge.findOne({ student: user._id })
          .populate('badge', 'name icon')
          .sort({ earnedAt: -1 })
          .lean();

        return {
          rank: index + 1,
          name: user.name,
          ecoPoints: user.ecoPoints,
          topBadge: topBadge ? {
            name: topBadge.badge.name,
            icon: topBadge.badge.icon
          } : null
        };
      }));

      res.status(200).json({
        success: true,
        leaderboard,
        type,
        totalStudents: leaderboard.length,
        message: `${type.charAt(0).toUpperCase() + type.slice(1)} leaderboard retrieved successfully`
      });
    } else {
      // Class vs class leaderboard (existing logic)
      const forests = await Forest.find({ school: req.user.school })
        .sort({ ecoScore: -1 })
        .lean();

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
        message: 'Class leaderboard retrieved successfully'
      });
    }
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
    const forests = await Forest.find({ forestState: state.toLowerCase(), school: req.user.school })
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
    const forests = await Forest.find({ school: req.user.school })
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
    const allForests = await Forest.find({ school: req.user.school })
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
