const Badge = require('../models/Badge');
const StudentBadge = require('../models/StudentBadge');
const User = require('../models/User');

/**
 * Get all badges earned by logged-in student
 * GET /api/badges/my
 * Access: Student only (protected)
 */
exports.getMyBadges = async (req, res) => {
  try {
    const studentId = req.user._id;

    // Get all StudentBadge records for this student, populate badge info
    const studentBadges = await StudentBadge.find({ student: studentId })
      .populate('badge', 'name description icon conditionType threshold')
      .sort({ earnedAt: -1 });

    // Format response with badge details and earned date
    const badges = studentBadges.map(sb => ({
      _id: sb.badge._id,
      name: sb.badge.name,
      description: sb.badge.description,
      icon: sb.badge.icon,
      conditionType: sb.badge.conditionType,
      threshold: sb.badge.threshold,
      earnedAt: sb.earnedAt
    }));

    res.status(200).json({
      success: true,
      count: badges.length,
      badges,
      message: 'Student badges retrieved successfully'
    });
  } catch (error) {
    console.error('Error fetching student badges:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve badges',
      error: error.message
    });
  }
};

/**
 * Internal function to check and award badges
 * Called after game submission or eco points update
 * @param {ObjectId} studentId - Student's user ID
 * @returns {Promise<Array>} - Array of newly earned badges
 */
exports.checkAndAwardBadges = async (studentId) => {
  try {
    // Get student data
    const student = await User.findById(studentId).select('ecoPoints gamesPlayed');
    
    if (!student) {
      console.error('Student not found for badge check:', studentId);
      return [];
    }

    // Get all active badges
    const allBadges = await Badge.find({ isActive: true });

    const newlyEarned = [];

    // Check each badge
    for (const badge of allBadges) {
      // Determine if student qualifies
      let qualifies = false;

      if (badge.conditionType === 'ecoPoints') {
        qualifies = student.ecoPoints >= badge.threshold;
      } else if (badge.conditionType === 'gamesPlayed') {
        qualifies = (student.gamesPlayed || 0) >= badge.threshold;
      }

      // If qualifies, check if already earned
      if (qualifies) {
        const alreadyEarned = await StudentBadge.hasEarned(studentId, badge._id);

        if (!alreadyEarned) {
          // Create new StudentBadge record
          const studentBadge = new StudentBadge({
            student: studentId,
            badge: badge._id,
            earnedAt: new Date()
          });

          await studentBadge.save();
          newlyEarned.push({
            _id: badge._id,
            name: badge.name,
            description: badge.description,
            icon: badge.icon,
            earnedAt: studentBadge.earnedAt
          });
        }
      }
    }

    return newlyEarned;
  } catch (error) {
    console.error('Error checking and awarding badges:', error);
    return [];
  }
};

/**
 * Admin: Get all badges (for management)
 * GET /api/badges/admin/all
 * Access: Admin only (protected)
 */
exports.getAllBadges = async (req, res) => {
  try {
    const badges = await Badge.find()
      .sort({ conditionType: 1, threshold: 1 });

    res.status(200).json({
      success: true,
      count: badges.length,
      badges,
      message: 'All badges retrieved successfully'
    });
  } catch (error) {
    console.error('Error fetching all badges:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve badges',
      error: error.message
    });
  }
};

/**
 * Admin: Create a new badge
 * POST /api/badges/admin/create
 * Access: Admin only (protected)
 */
exports.createBadge = async (req, res) => {
  try {
    const { name, description, icon, conditionType, threshold } = req.body;

    // Validation
    if (!name || !description || !icon || !conditionType || threshold === undefined) {
      return res.status(400).json({
        success: false,
        message: 'All fields (name, description, icon, conditionType, threshold) are required'
      });
    }

    if (!['ecoPoints', 'gamesPlayed'].includes(conditionType)) {
      return res.status(400).json({
        success: false,
        message: 'Condition type must be either "ecoPoints" or "gamesPlayed"'
      });
    }

    if (threshold < 0) {
      return res.status(400).json({
        success: false,
        message: 'Threshold must be a non-negative number'
      });
    }

    // Check for duplicate
    const existing = await Badge.findOne({ name });
    if (existing) {
      return res.status(409).json({
        success: false,
        message: 'Badge with this name already exists'
      });
    }

    const badge = new Badge({
      name,
      description,
      icon,
      conditionType,
      threshold
    });

    await badge.save();

    res.status(201).json({
      success: true,
      badge,
      message: 'Badge created successfully'
    });
  } catch (error) {
    console.error('Error creating badge:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create badge',
      error: error.message
    });
  }
};

/**
 * Get badge count and progress for a student
 * GET /api/badges/progress
 * Access: Student only (protected)
 */
exports.getStudentBadgeProgress = async (req, res) => {
  try {
    const studentId = req.user._id;

    // Get student data
    const student = await User.findById(studentId).select('ecoPoints gamesPlayed');
    
    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    // Get all badges and check progress
    const allBadges = await Badge.find({ isActive: true })
      .sort({ threshold: 1 });

    const badgeProgress = [];

    for (const badge of allBadges) {
      // Check if earned
      const earned = await StudentBadge.findOne({
        student: studentId,
        badge: badge._id
      });

      let qualifies = false;
      let progress = 0;

      if (badge.conditionType === 'ecoPoints') {
        progress = Math.min((student.ecoPoints / badge.threshold) * 100, 100);
        qualifies = student.ecoPoints >= badge.threshold;
      } else if (badge.conditionType === 'gamesPlayed') {
        const gamesPlayed = student.gamesPlayed || 0;
        progress = Math.min((gamesPlayed / badge.threshold) * 100, 100);
        qualifies = gamesPlayed >= badge.threshold;
      }

      badgeProgress.push({
        badge: {
          _id: badge._id,
          name: badge.name,
          description: badge.description,
          icon: badge.icon,
          conditionType: badge.conditionType,
          threshold: badge.threshold
        },
        earned: !!earned,
        earnedAt: earned ? earned.earnedAt : null,
        progress: Math.round(progress),
        qualified: qualifies
      });
    }

    const earnedCount = badgeProgress.filter(bp => bp.earned).length;

    res.status(200).json({
      success: true,
      earnedCount,
      totalBadges: badgeProgress.length,
      progress: badgeProgress,
      message: 'Badge progress retrieved successfully'
    });
  } catch (error) {
    console.error('Error fetching badge progress:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve badge progress',
      error: error.message
    });
  }
};
