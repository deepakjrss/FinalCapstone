import api from '../utils/api';

// Forest Service
const forestService = {
  /**
   * Get forest data by class name
   * @param {string} className - The class name (e.g., "Class8A")
   * @returns {Promise} Forest data with ecoScore, forestState, etc.
   */
  getForestByClass: async (className) => {
    try {
      const response = await api.get(`/forest/${className}`);
      return {
        success: true,
        data: response.data.forest,
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || error.message,
      };
    }
  },

  /**
   * Get all forests (for teachers/admins)
   * @returns {Promise} List of all forests
   */
  getAllForests: async () => {
    try {
      const response = await api.get('/forest');
      return {
        success: true,
        data: response.data.forests,
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || error.message,
      };
    }
  },

  /**
   * Update forest score
   * @param {string} className - The class name
   * @param {number} points - Points to add
   * @returns {Promise} Updated forest data
   */
  updateForestScore: async (className, points) => {
    try {
      const response = await api.put('/forest/update', {
        className,
        points,
      });
      return {
        success: true,
        data: response.data.forest,
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || error.message,
      };
    }
  },

  /**
   * Get forest statistics
   * @returns {Promise} Forest statistics
   */
  getForestStats: async () => {
    try {
      const response = await api.get('/forest/stats/summary');
      return {
        success: true,
        data: response.data.stats,
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || error.message,
      };
    }
  },
};

export default forestService;
