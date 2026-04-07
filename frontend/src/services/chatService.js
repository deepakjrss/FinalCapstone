import api from '../utils/api';

const chatService = {
  /**
   * Send a message to the Forest Guardian AI
   * @param {string} message
   */
  sendMessage: async (message) => {
    try {
      const response = await api.post('/chat', { message });
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || error.message,
      };
    }
  },

  /**
   * Check AI health
   */
  checkHealth: async () => {
    try {
      const response = await api.get('/chat/health');
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || error.message,
      };
    }
  },
};

export default chatService;
