import api from '../utils/api';

// Reward Service
const rewardService = {
  /**
   * Get all available reward shop items
   * @returns {Promise} Object with success flag and reward items array or error
   */
  getRewardItems: async () => {
    try {
      const response = await api.get('/rewards/items');
      return {
        success: true,
        data: response.data.items,
        count: response.data.count,
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || error.message,
      };
    }
  },

  /**
   * Purchase a reward item using ecoPoints
   * @param {string} itemId - The ID of the reward item to purchase
   * @returns {Promise} Object with success flag and purchase data or error
   */
  purchaseReward: async (itemId) => {
    try {
      const response = await api.post('/rewards/purchase', { itemId });
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || error.message,
      };
    }
  },
};

export default rewardService;