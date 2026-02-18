const Forest = require('../models/Forest');

/**
 * Get forest data by className
 * GET /api/forest/:className
 * Access: Student, Teacher (protected)
 */
exports.getForestByClass = async (req, res) => {
  try {
    const { className } = req.params;

    if (!className || className.trim() === '') {
      return res.status(400).json({ message: 'Class name is required' });
    }

    // Get or create forest if it doesn't exist
    const forest = await Forest.getOrCreate(className);

    res.status(200).json({
      success: true,
      forest,
      message: `Forest data retrieved for ${className}`
    });
  } catch (error) {
    console.error('Error fetching forest:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve forest data',
      error: error.message
    });
  }
};

/**
 * Update forest eco score
 * PUT /api/forest/update
 * Body: { className, points }
 * Access: Teacher only (protected)
 */
exports.updateForestScore = async (req, res) => {
  try {
    const { className, points } = req.body;

    // Validation
    if (!className || className.trim() === '') {
      return res.status(400).json({ message: 'Class name is required' });
    }

    if (typeof points !== 'number' || points < 0) {
      return res.status(400).json({
        message: 'Points must be a non-negative number'
      });
    }

    // Get or create forest
    let forest = await Forest.getOrCreate(className);

    // Add points (this triggers pre-save hook to recalculate forestState)
    forest = await forest.addPoints(points);

    res.status(200).json({
      success: true,
      forest,
      message: `Forest updated: +${points} points added to ${className}`
    });
  } catch (error) {
    console.error('Error updating forest:', error);
    
    // Handle unique constraint errors (e.g., duplicate className)
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: 'Forest already exists for this class'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to update forest data',
      error: error.message
    });
  }
};

/**
 * Get all forests (admin/dashboard view)
 * GET /api/forest
 * Access: Teacher, Admin (protected)
 */
exports.getAllForests = async (req, res) => {
  try {
    const forests = await Forest.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: forests.length,
      forests,
      message: 'All forests retrieved successfully'
    });
  } catch (error) {
    console.error('Error fetching all forests:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve forests',
      error: error.message
    });
  }
};

/**
 * Get forest stats (total ecoScore, state distribution)
 * GET /api/forest/stats/summary
 * Access: Teacher, Admin (protected)
 */
exports.getForestStats = async (req, res) => {
  try {
    const forests = await Forest.find();

    const stats = {
      totalForests: forests.length,
      totalEcoScore: forests.reduce((sum, f) => sum + f.ecoScore, 0),
      averageEcoScore: forests.length > 0 ? (forests.reduce((sum, f) => sum + f.ecoScore, 0) / forests.length).toFixed(2) : 0,
      stateDistribution: {
        polluted: forests.filter(f => f.forestState === 'polluted').length,
        growing: forests.filter(f => f.forestState === 'growing').length,
        healthy: forests.filter(f => f.forestState === 'healthy').length
      }
    };

    res.status(200).json({
      success: true,
      stats,
      message: 'Forest statistics retrieved successfully'
    });
  } catch (error) {
    console.error('Error fetching forest stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve forest statistics',
      error: error.message
    });
  }
};
