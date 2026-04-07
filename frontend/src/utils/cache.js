import { useRef } from 'react';

// Simple frontend cache utility (non-React hook version for services)
class SimpleCache {
  constructor() {
    this.cache = {};
  }

  get(key) {
    const item = this.cache[key];
    if (item && item.expiry > Date.now()) {
      console.log('🔄 Frontend Cache HIT:', key);
      return item.data;
    }
    if (item) {
      // Expired, remove it
      delete this.cache[key];
    }
    console.log('❌ Frontend Cache MISS:', key);
    return null;
  }

  set(key, data, ttlMinutes = 5) {
    const expiry = Date.now() + (ttlMinutes * 60 * 1000);
    this.cache[key] = { data, expiry };
    console.log('💾 Frontend Cache SET:', key, `(TTL: ${ttlMinutes}min)`);
  }

  invalidate(key) {
    if (this.cache[key]) {
      delete this.cache[key];
      console.log('🗑️ Frontend Cache DEL:', key);
    }
  }

  invalidatePattern(pattern) {
    const keys = Object.keys(this.cache);
    keys.forEach(key => {
      if (key.includes(pattern)) {
        delete this.cache[key];
        console.log('🗑️ Frontend Cache DEL (pattern):', key);
      }
    });
  }

  invalidateAll() {
    this.cache = {};
    console.log('🧹 Frontend Cache FLUSH ALL');
  }
}

// Singleton instance for services
const simpleCache = new SimpleCache();

// React hook version for components
export const useCache = () => {
  const cacheRef = useRef({});

  const get = (key) => {
    const item = cacheRef.current[key];
    if (item && item.expiry > Date.now()) {
      console.log('🔄 Frontend Cache HIT:', key);
      return item.data;
    }
    if (item) {
      // Expired, remove it
      delete cacheRef.current[key];
    }
    console.log('❌ Frontend Cache MISS:', key);
    return null;
  };

  const set = (key, data, ttlMinutes = 5) => {
    const expiry = Date.now() + (ttlMinutes * 60 * 1000);
    cacheRef.current[key] = { data, expiry };
    console.log('💾 Frontend Cache SET:', key, `(TTL: ${ttlMinutes}min)`);
  };

  const invalidate = (key) => {
    if (cacheRef.current[key]) {
      delete cacheRef.current[key];
      console.log('🗑️ Frontend Cache DEL:', key);
    }
  };

  const invalidateAll = () => {
    cacheRef.current = {};
    console.log('🧹 Frontend Cache FLUSH ALL');
  };

  const invalidatePattern = (pattern) => {
    const keys = Object.keys(cacheRef.current);
    keys.forEach(key => {
      if (key.includes(pattern)) {
        delete cacheRef.current[key];
        console.log('🗑️ Frontend Cache DEL (pattern):', key);
      }
    });
  };

  return { get, set, invalidate, invalidateAll, invalidatePattern };
};

// Export both versions
export { simpleCache };

// Cache keys constants
export const CACHE_KEYS = {
  DASHBOARD_OVERVIEW: 'dashboard_overview',
  DASHBOARD_TOP_STUDENTS: 'dashboard_top_students',
  DASHBOARD_ENGAGEMENT: 'dashboard_engagement',
  DASHBOARD_STUDENTS: 'dashboard_students',
  DASHBOARD_GAMES: 'dashboard_games',
  DASHBOARD_CLASSES: 'dashboard_classes',
  DASHBOARD_CHARTS: 'dashboard_charts',
  DASHBOARD_CLASS_PERFORMANCE: 'dashboard_class_performance',
  DASHBOARD_ECO_TREND: 'dashboard_eco_trend',
  STUDENTS_BY_CLASS: (className) => `students_class_${className}`,
  TEACHERS_LIST: 'teachers_list',
  DELETED_USERS: 'deleted_users',
  NOTIFICATIONS: 'notifications',
  NOTIFICATIONS_STATS: 'notifications_stats',
  ANNOUNCEMENTS: 'announcements',
  FOREST_DATA: (className) => `forest_${className}`,
  GAMES_LIST: 'games_list'
};