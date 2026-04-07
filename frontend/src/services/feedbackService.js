import api from '../utils/api';
import { simpleCache, CACHE_KEYS } from '../utils/cache';

const feedbackService = {
  submitFeedback: async (teacherId, rating, comment) => {
    try {
      const response = await api.post('/feedback', {
        teacherId,
        rating,
        comment
      });
      // Invalidate feedback caches
      simpleCache.invalidate('teacher_feedback');
      simpleCache.invalidate('all_feedback');
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || error.message };
    }
  },

  getTeacherFeedback: async () => {
    try {
      const cached = simpleCache.get('teacher_feedback');
      if (cached) {
        return { success: true, data: cached };
      }

      const response = await api.get('/feedback/teacher');
      simpleCache.set('teacher_feedback', response.data);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || error.message };
    }
  },

  getAllFeedback: async () => {
    try {
      const cached = simpleCache.get('all_feedback');
      if (cached) {
        return { success: true, data: cached };
      }

      const response = await api.get('/feedback/admin');
      simpleCache.set('all_feedback', response.data);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || error.message };
    }
  },

  getTeachers: async () => {
    try {
      const cached = simpleCache.get(CACHE_KEYS.TEACHERS_LIST);
      if (cached) {
        return { success: true, data: cached };
      }

      const response = await api.get('/analytics/teachers');
      simpleCache.set(CACHE_KEYS.TEACHERS_LIST, response.data);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || error.message };
    }
  }
};

export default feedbackService;