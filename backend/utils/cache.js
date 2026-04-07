const NodeCache = require('node-cache');

// Create cache instance with 5 minute TTL (Time To Live)
const cache = new NodeCache({
  stdTTL: 300, // 5 minutes
  checkperiod: 60, // Check for expired keys every 60 seconds
  useClones: false // Don't clone objects for better performance
});

// Cache keys constants
const CACHE_KEYS = {
  ANALYTICS_OVERVIEW: 'analytics_overview',
  ANALYTICS_TOP_STUDENTS: 'analytics_top_students',
  ANALYTICS_ENGAGEMENT: 'analytics_engagement',
  ANALYTICS_STUDENTS: 'analytics_students',
  ANALYTICS_GAMES: 'analytics_games',
  ANALYTICS_CLASSES: 'analytics_classes',
  ANALYTICS_DASHBOARD_CHARTS: 'analytics_dashboard_charts',
  ANALYTICS_CLASS_PERFORMANCE: 'analytics_class_performance',
  ANALYTICS_ECO_TREND: 'analytics_eco_trend',
  USERS_DELETED: 'users_deleted',
  USERS_TEACHERS: 'users_teachers',
  NOTIFICATIONS_STATS: 'notifications_stats',
  FOREST_BY_CLASS: (className) => `forest_class_${className}`,
  STUDENTS_BY_CLASS: (className) => `students_class_${className}`
};

// Cache utility functions
const cacheUtils = {
  // Get data from cache
  get: (key) => {
    try {
      const data = cache.get(key);
      if (data) {
        console.log(`🔄 Cache HIT: ${key}`);
        return data;
      }
      console.log(`❌ Cache MISS: ${key}`);
      return null;
    } catch (error) {
      console.error('Cache get error:', error);
      return null;
    }
  },

  // Set data in cache
  set: (key, data, ttl = null) => {
    try {
      const success = cache.set(key, data, ttl);
      if (success) {
        console.log(`💾 Cache SET: ${key} (TTL: ${ttl || 'default'})`);
      }
      return success;
    } catch (error) {
      console.error('Cache set error:', error);
      return false;
    }
  },

  // Delete specific cache key
  del: (key) => {
    try {
      const deleted = cache.del(key);
      if (deleted) {
        console.log(`🗑️ Cache DEL: ${key}`);
      }
      return deleted;
    } catch (error) {
      console.error('Cache del error:', error);
      return false;
    }
  },

  // Clear all cache
  flushAll: () => {
    try {
      cache.flushAll();
      console.log('🧹 Cache FLUSH ALL');
      return true;
    } catch (error) {
      console.error('Cache flush error:', error);
      return false;
    }
  },

  // Get cache stats
  getStats: () => {
    try {
      return cache.getStats();
    } catch (error) {
      console.error('Cache stats error:', error);
      return null;
    }
  },

  // Invalidate analytics cache (called when data changes)
  invalidateAnalytics: () => {
    const keys = [
      CACHE_KEYS.ANALYTICS_OVERVIEW,
      CACHE_KEYS.ANALYTICS_TOP_STUDENTS,
      CACHE_KEYS.ANALYTICS_ENGAGEMENT,
      CACHE_KEYS.ANALYTICS_STUDENTS,
      CACHE_KEYS.ANALYTICS_GAMES,
      CACHE_KEYS.ANALYTICS_CLASSES,
      CACHE_KEYS.ANALYTICS_DASHBOARD_CHARTS
    ];
    keys.forEach(key => cacheUtils.del(key));
    console.log('🔄 Analytics cache invalidated');
  },

  // Invalidate user-related cache
  invalidateUsers: () => {
    const keys = [
      CACHE_KEYS.USERS_DELETED,
      CACHE_KEYS.USERS_TEACHERS,
      CACHE_KEYS.ANALYTICS_STUDENTS
    ];
    keys.forEach(key => cacheUtils.del(key));
    console.log('🔄 User cache invalidated');
  },

  // Invalidate class-specific cache
  invalidateClass: (className) => {
    const keys = [
      CACHE_KEYS.FOREST_BY_CLASS(className),
      CACHE_KEYS.STUDENTS_BY_CLASS(className)
    ];
    keys.forEach(key => cacheUtils.del(key));
    console.log(`🔄 Class cache invalidated: ${className}`);
  }
};

module.exports = {
  cache,
  CACHE_KEYS,
  cacheUtils
};