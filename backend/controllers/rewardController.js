const User = require('../models/User');
const RewardItem = require('../models/RewardItem');
const { logActivity } = require('../services/activityService');

/**
 * Get all active reward shop items
 * GET /api/rewards/items
 */
exports.getRewardItems = async (req, res) => {
  try {
    const items = await RewardItem.find({ isActive: true }).sort({ cost: 1 });

    res.status(200).json({
      success: true,
      count: items.length,
      items,
      message: 'Reward shop items retrieved successfully'
    });
  } catch (error) {
    console.error('Error fetching reward items:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve reward shop items',
      error: error.message
    });
  }
};

/**
 * Purchase a reward item using ecoPoints
 * POST /api/rewards/purchase
 */
exports.purchaseReward = async (req, res) => {
  try {
    const userId = req.user._id;
    const { itemId } = req.body;

    if (!itemId) {
      return res.status(400).json({
        success: false,
        message: 'Reward item ID is required'
      });
    }

    const item = await RewardItem.findById(itemId);
    if (!item || !item.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Reward item not found'
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    if ((user.unlockedItems || []).includes(item._id)) {
      return res.status(400).json({
        success: false,
        message: 'You already own this reward item'
      });
    }

    if ((user.ecoPoints || 0) < item.cost) {
      return res.status(400).json({
        success: false,
        message: 'Not enough ecoPoints to purchase this item'
      });
    }

    user.ecoPoints -= item.cost;
    user.unlockedItems = [...new Set([...(user.unlockedItems || []), item._id])];
    await user.save();

    await logActivity(req.user, `Purchased reward item: ${item.name}`, item.name);

    res.status(200).json({
      success: true,
      item: {
        _id: item._id,
        name: item.name,
        description: item.description,
        icon: item.icon,
        cost: item.cost,
        type: item.type
      },
      ecoPoints: user.ecoPoints,
      message: `Successfully purchased ${item.name}`
    });
  } catch (error) {
    console.error('Error purchasing reward item:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to complete purchase',
      error: error.message
    });
  }
};
