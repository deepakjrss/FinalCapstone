import api from '../utils/api';
import { simpleCache, CACHE_KEYS } from '../utils/cache';

const announcementService = {
  getAnnouncements: async () => {
    try {
      const cached = simpleCache.get(CACHE_KEYS.ANNOUNCEMENTS);
      if (cached) {
        return { success: true, data: cached };
      }

      const response = await api.get('/announcements');
      simpleCache.set(CACHE_KEYS.ANNOUNCEMENTS, response.data.data || response.data);
      return { success: true, data: response.data.data || response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || error.message };
    }
  },

  createAnnouncement: async (payload) => {
    try {
      console.log('🔍 ANNOUNCEMENT SERVICE: createAnnouncement called');
      console.log('🔍 ANNOUNCEMENT SERVICE: TOKEN:', localStorage.getItem('token'));
      console.log('🔍 ANNOUNCEMENT SERVICE: payload:', payload);

      const response = await api.post('/announcements', payload);
      console.log('🔍 ANNOUNCEMENT SERVICE: API response:', response);
      simpleCache.invalidate(CACHE_KEYS.ANNOUNCEMENTS);
      return { success: true, data: response.data.data };
    } catch (error) {
      console.log('🔍 ANNOUNCEMENT SERVICE: Error:', error);
      console.log('🔍 ANNOUNCEMENT SERVICE: Error response:', error.response);
      return { success: false, error: error.response?.data?.message || error.message };
    }
  },
  // Cache invalidation methods
  invalidateAll: () => {
    simpleCache.invalidate(CACHE_KEYS.ANNOUNCEMENTS);
  }
};

export default announcementService;
