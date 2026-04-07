import api from '../utils/api';

const requestService = {
  // Get pending requests for approval
  getPendingRequests: async () => {
    try {
      const response = await api.get('/requests/pending');
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || error.message };
    }
  },

  // Approve a request
  approveRequest: async (requestId) => {
    try {
      const response = await api.put(`/requests/approve/${requestId}`);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || error.message };
    }
  },

  // Reject a request
  rejectRequest: async (requestId) => {
    try {
      const response = await api.put(`/requests/reject/${requestId}`);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || error.message };
    }
  }
};

export default requestService;