import api from '../utils/api';

const schoolService = {
  // Get current user's school
  getMySchool: async () => {
    try {
      const response = await api.get('/school/my');
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch school data'
      };
    }
  },

  // Create a new school
  createSchool: async (schoolData) => {
    try {
      const response = await api.post('/school/create', schoolData);
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to create school'
      };
    }
  },

  // Get all schools (Super Admin only)
  getAllSchools: async () => {
    try {
      const response = await api.get('/school/schools');
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch schools'
      };
    }
  }
};

export default schoolService;