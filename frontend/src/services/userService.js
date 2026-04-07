import api from '../utils/api';
import { simpleCache, CACHE_KEYS } from '../utils/cache';

const userService = {
  deleteUser: async (userId, reason) => {
    try {
      const response = await api.delete(`/users/${userId}`, {
        data: { reason }
      });
      // Invalidate user-related caches
      simpleCache.invalidatePattern('students_class_');
      simpleCache.invalidate(CACHE_KEYS.DELETED_USERS);
      simpleCache.invalidate(CACHE_KEYS.TEACHERS_LIST);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || error.message };
    }
  },

  getDeletedUsers: async () => {
    try {
      const cached = simpleCache.get(CACHE_KEYS.DELETED_USERS);
      if (cached) {
        return { success: true, data: cached };
      }

      const response = await api.get('/users/deleted');
      simpleCache.set(CACHE_KEYS.DELETED_USERS, response.data);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || error.message };
    }
  },

  getStudentsByClass: async (className) => {
    try {
      const cacheKey = CACHE_KEYS.STUDENTS_BY_CLASS(className);
      const cached = simpleCache.get(cacheKey);
      if (cached) {
        return { success: true, data: cached };
      }

      const response = await api.get(`/students/class/${encodeURIComponent(className)}`);
      simpleCache.set(cacheKey, response.data);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || error.message };
    }
  },

  restoreUser: async (deletedUserId) => {
    try {
      const response = await api.post(`/users/restore/${deletedUserId}`);
      // Invalidate user-related caches
      simpleCache.invalidatePattern('students_class_');
      simpleCache.invalidate(CACHE_KEYS.DELETED_USERS);
      simpleCache.invalidate(CACHE_KEYS.TEACHERS_LIST);
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

      const response = await api.get('/users/teachers');
      simpleCache.set(CACHE_KEYS.TEACHERS_LIST, response.data);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || error.message };
    }
  },

  getActivityLogs: async () => {
    try {
      const response = await api.get('/users/logs');
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || error.message };
    }
  },

  getPendingTeachers: async () => {
    try {
      const response = await api.get('/users/pending-teachers');
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || error.message };
    }
  },

  approveTeacher: async (teacherId) => {
    try {
      const response = await api.put(`/users/approve/${teacherId}`);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || error.message };
    }
  },
  getPendingRequests: async () => {
    try {
      const response = await api.get('/requests/pending');
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || error.message };
    }
  },

  approveRequest: async (requestId) => {
    try {
      const response = await api.put(`/requests/approve/${requestId}`);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || error.message };
    }
  },

  rejectRequest: async (requestId) => {
    try {
      const response = await api.put(`/requests/reject/${requestId}`);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || error.message };
    }
  },
  // Cache invalidation methods
  invalidateUserCaches: () => {
    simpleCache.invalidatePattern('students_class_');
    simpleCache.invalidate(CACHE_KEYS.DELETED_USERS);
    simpleCache.invalidate(CACHE_KEYS.TEACHERS_LIST);
  }
};

export default userService;