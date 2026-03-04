import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

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

// Game Service
const gameService = {
  /**
   * Get all available games
   * @returns {Promise} List of available games
   */
  getAvailableGames: async () => {
    try {
      const response = await apiClient.get('/games');
      return {
        success: true,
        data: response.data.games,
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || error.message,
      };
    }
  },

  /**
   * Get single game details with questions
   * @param {string} gameId - The game ID
   * @returns {Promise} Game details
   */
  getGameById: async (gameId) => {
    try {
      const response = await apiClient.get(`/games/${gameId}`);
      return {
        success: true,
        data: response.data.game,
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || error.message,
      };
    }
  },

  /**
   * Submit game attempt with answers
   * @param {string} gameId - The game ID
   * @param {array} answers - Array of selected answer indices
   * @returns {Promise} Attempt result and points earned
   */
  submitGameAttempt: async (gameId, answers) => {
    try {
      const response = await apiClient.post('/games/submit', {
        gameId,
        answers,
      });
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

  /**
   * Get student's game statistics
   * @returns {Promise} Game stats
   */
  getGameStats: async () => {
    try {
      const response = await apiClient.get('/games/stats/progress');
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

  /**
   * Get student's attempt history
   * @param {string} gameId - Optional: filter by specific game
   * @returns {Promise} List of attempts
   */
  getAttemptHistory: async (gameId = null) => {
    try {
      let url = '/games/attempts/history';
      if (gameId) {
        url += `?gameId=${gameId}`;
      }
      const response = await apiClient.get(url);
      return {
        success: true,
        data: response.data.attempts,
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || error.message,
      };
    }
  },
};

export default gameService;
