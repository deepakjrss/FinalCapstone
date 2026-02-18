import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

// Create axios instance with base config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Badge Service
const badgeService = {
  /**
   * Get all earned badges for the current student
   * @returns {Promise} Object with success flag and badges array or error
   */
  getMyBadges: async () => {
    try {
      const response = await apiClient.get('/badges/my');
      return {
        success: true,
        data: response.data.badges,
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
   * Get badge progress for the current student
   * @returns {Promise} Object with success flag and progress data or error
   */
  getBadgeProgress: async () => {
    try {
      const response = await apiClient.get('/badges/progress');
      return {
        success: true,
        data: response.data.progress,
        earnedCount: response.data.earnedCount,
        totalBadges: response.data.totalBadges,
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || error.message,
      };
    }
  },

  /**
   * Get all badges (admin only)
   * @returns {Promise} Object with success flag and badges array or error
   */
  getAllBadges: async () => {
    try {
      const response = await apiClient.get('/badges/admin/all');
      return {
        success: true,
        data: response.data.badges,
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
   * Create a new badge (admin only)
   * @param {Object} badgeData - Badge data (name, description, icon, conditionType, threshold)
   * @returns {Promise} Object with success flag and created badge or error
   */
  createBadge: async (badgeData) => {
    try {
      const response = await apiClient.post('/badges/admin/create', badgeData);
      return {
        success: true,
        data: response.data.badge,
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || error.message,
      };
    }
  },
};

export default badgeService;
