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

// Forest Service
const forestService = {
  /**
   * Get forest data by class name
   * @param {string} className - The class name (e.g., "Class8A")
   * @returns {Promise} Forest data with ecoScore, forestState, etc.
   */
  getForestByClass: async (className) => {
    try {
      const response = await apiClient.get(`/forest/${className}`);
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
      const response = await apiClient.get('/forest');
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
      const response = await apiClient.put('/forest/update', {
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
      const response = await apiClient.get('/forest/stats/summary');
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
