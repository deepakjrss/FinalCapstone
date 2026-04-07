import api from '../utils/api';

// Game Service
const gameService = {
  /**
   * Get all available games
   * @returns {Promise} List of available games
   */
  getAvailableGames: async () => {
    try {
      const response = await api.get('/games');
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
      const response = await api.get(`/games/${gameId}`);
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
  submitGameAttempt: async (gameId, answers, questions=null) => {
    try {
      const payload = { gameId, answers };
      if (questions) payload.questions = questions;
      const response = await api.post('/games/submit', payload);
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
  
  generateQuiz: async () => {
    try {
      const response = await api.get('/games/generate-quiz');
      return { success: true, data: response.data };
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
      const response = await api.get('/games/stats/progress');
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
      const response = await api.get(url);
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

  addPoints: async (points) => {
    try {
      const response = await api.post('/users/add-points', { points });
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || error.message,
      };
    }
  },
};

export default gameService;
