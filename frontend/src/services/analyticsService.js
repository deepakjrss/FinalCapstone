import api from '../utils/api';
import { simpleCache, CACHE_KEYS } from '../utils/cache';

const analyticsService = {
  getOverview: async () => {
    try {
      console.log('🔍 ANALYTICS SERVICE: getOverview called');
      console.log('🔍 ANALYTICS SERVICE: TOKEN:', localStorage.getItem('token'));

      const cached = simpleCache.get(CACHE_KEYS.DASHBOARD_OVERVIEW);
      if (cached) {
        return { success: true, data: cached };
      }

      const response = await api.get('/analytics/overview');
      console.log('🔍 ANALYTICS SERVICE: API response:', response);
      simpleCache.set(CACHE_KEYS.DASHBOARD_OVERVIEW, response.data);
      return { success: true, data: response.data };
    } catch (error) {
      console.log('🔍 ANALYTICS SERVICE: Error:', error);
      console.log('🔍 ANALYTICS SERVICE: Error response:', error.response);
      return { success: false, error: error.response?.data?.message || error.message };
    }
  },

  getTopStudents: async () => {
    try {
      const cached = simpleCache.get(CACHE_KEYS.DASHBOARD_TOP_STUDENTS);
      if (cached) {
        return { success: true, data: cached };
      }

      const response = await api.get('/analytics/top-students');
      simpleCache.set(CACHE_KEYS.DASHBOARD_TOP_STUDENTS, response.data);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || error.message };
    }
  },

  getEngagement: async () => {
    try {
      const cached = simpleCache.get(CACHE_KEYS.DASHBOARD_ENGAGEMENT);
      if (cached) {
        return { success: true, data: cached };
      }

      const response = await api.get('/analytics/engagement');
      simpleCache.set(CACHE_KEYS.DASHBOARD_ENGAGEMENT, response.data);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || error.message };
    }
  },

  getDashboardCharts: async () => {
    try {
      const cached = simpleCache.get(CACHE_KEYS.DASHBOARD_CHARTS);
      if (cached) {
        return { success: true, data: cached };
      }

      const response = await api.get('/analytics/dashboard-charts');
      simpleCache.set(CACHE_KEYS.DASHBOARD_CHARTS, response.data);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || error.message };
    }
  },

  getStudents: async () => {
    try {
      const cached = simpleCache.get(CACHE_KEYS.DASHBOARD_STUDENTS);
      if (cached) {
        return { success: true, data: cached };
      }

      const response = await api.get('/analytics/students');
      simpleCache.set(CACHE_KEYS.DASHBOARD_STUDENTS, response.data);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || error.message };
    }
  },

  getGames: async () => {
    try {
      const cached = simpleCache.get(CACHE_KEYS.DASHBOARD_GAMES);
      if (cached) {
        return { success: true, data: cached };
      }

      const response = await api.get('/analytics/games');
      simpleCache.set(CACHE_KEYS.DASHBOARD_GAMES, response.data);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || error.message };
    }
  },

  getClasses: async () => {
    try {
      const cached = simpleCache.get(CACHE_KEYS.DASHBOARD_CLASSES);
      if (cached) {
        return { success: true, data: cached };
      }

      const response = await api.get('/analytics/classes');
      simpleCache.set(CACHE_KEYS.DASHBOARD_CLASSES, response.data);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || error.message };
    }
  },

  getClassPerformance: async () => {
    try {
      const cached = simpleCache.get(CACHE_KEYS.DASHBOARD_CLASS_PERFORMANCE);
      if (cached) {
        return { success: true, data: cached };
      }

      const response = await api.get('/analytics/class-performance');
      simpleCache.set(CACHE_KEYS.DASHBOARD_CLASS_PERFORMANCE, response.data);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || error.message };
    }
  },

  getEcoScoreTrend: async () => {
    try {
      const cached = simpleCache.get(CACHE_KEYS.DASHBOARD_ECO_TREND);
      if (cached) {
        return { success: true, data: cached };
      }

      const response = await api.get('/analytics/eco-score-trend');
      simpleCache.set(CACHE_KEYS.DASHBOARD_ECO_TREND, response.data);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || error.message };
    }
  },

  // Cache invalidation methods
  invalidateAll: () => {
    simpleCache.invalidateAll();
  },

  invalidateAnalytics: () => {
    simpleCache.invalidatePattern('dashboard_');
  }
};

export default analyticsService;
