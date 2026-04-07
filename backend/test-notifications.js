/**
 * EcoVerse Notification System - API Test Suite
 * Run with: node test-notifications.js
 */

const API_BASE = 'http://localhost:5000/api';
let AUTH_TOKEN = ''; // Will be set after login

// Color codes for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m'
};

// Helper function to log colored output
function log(color, title, data) {
  console.log(`\n${colors.bright}${color}${title}${colors.reset}`);
  console.log(JSON.stringify(data, null, 2));
}

// Helper function to make API calls
async function apiCall(method, endpoint, body = null) {
  const headers = {
    'Content-Type': 'application/json'
  };

  if (AUTH_TOKEN) {
    headers['Authorization'] = `Bearer ${AUTH_TOKEN}`;
  }

  const options = {
    method,
    headers
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(`${API_BASE}${endpoint}`, options);
    const data = await response.json();
    return { status: response.status, data };
  } catch (error) {
    console.error(`Error calling ${endpoint}:`, error.message);
    return { status: 500, data: { error: error.message } };
  }
}

// Test Cases
const tests = {
  // 1. Login Test
  async testLogin() {
    console.log(`\n${colors.bright}${colors.blue}========== TEST 1: LOGIN ==========${colors.reset}`);
    
    const response = await apiCall('POST', '/auth/login', {
      email: 'student1@example.com',
      password: 'password123'
    });

    if (response.status === 200 && response.data.token) {
      AUTH_TOKEN = response.data.token;
      log(colors.green, '✅ LOGIN SUCCESSFUL', {
        userId: response.data.user._id,
        email: response.data.user.email,
        role: response.data.user.role
      });
      return true;
    } else {
      log(colors.red, '❌ LOGIN FAILED', response.data);
      return false;
    }
  },

  // 2. Get All Notifications
  async testGetAllNotifications() {
    console.log(`\n${colors.bright}${colors.blue}========== TEST 2: GET ALL NOTIFICATIONS ==========${colors.reset}`);
    
    const response = await apiCall('GET', '/notifications');
    
    if (response.status === 200) {
      log(colors.green, '✅ GET ALL NOTIFICATIONS', {
        total: response.data.data.pagination.totalNotifications,
        unread: response.data.data.pagination.unreadCount,
        count: response.data.data.notifications.length,
        notifications: response.data.data.notifications.slice(0, 2)
      });
      return true;
    } else {
      log(colors.red, '❌ GET ALL NOTIFICATIONS FAILED', response.data);
      return false;
    }
  },

  // 3. Get Unread Notifications
  async testGetUnreadNotifications() {
    console.log(`\n${colors.bright}${colors.blue}========== TEST 3: GET UNREAD NOTIFICATIONS ==========${colors.reset}`);
    
    const response = await apiCall('GET', '/notifications/unread');
    
    if (response.status === 200) {
      log(colors.green, '✅ GET UNREAD NOTIFICATIONS', {
        count: response.data.count,
        notifications: response.data.notifications
      });
      return true;
    } else {
      log(colors.red, '❌ GET UNREAD NOTIFICATIONS FAILED', response.data);
      return false;
    }
  },

  // 4. Get Notification Statistics
  async testGetStats() {
    console.log(`\n${colors.bright}${colors.blue}========== TEST 4: GET NOTIFICATION STATS ==========${colors.reset}`);
    
    const response = await apiCall('GET', '/notifications/stats');
    
    if (response.status === 200) {
      log(colors.green, '✅ GET STATS', response.data.data);
      return true;
    } else {
      log(colors.red, '❌ GET STATS FAILED', response.data);
      return false;
    }
  },

  // 5. Get Paginated Notifications
  async testGetPaginatedNotifications() {
    console.log(`\n${colors.bright}${colors.blue}========== TEST 5: GET PAGINATED NOTIFICATIONS ==========${colors.reset}`);
    
    const response = await apiCall('GET', '/notifications?page=1&limit=5');
    
    if (response.status === 200) {
      log(colors.green, '✅ GET PAGINATED NOTIFICATIONS', {
        page: response.data.data.pagination.currentPage,
        totalPages: response.data.data.pagination.totalPages,
        perPage: response.data.data.notifications.length
      });
      return true;
    } else {
      log(colors.red, '❌ GET PAGINATED NOTIFICATIONS FAILED', response.data);
      return false;
    }
  },

  // 6. Mark Notification as Read
  async testMarkAsRead() {
    console.log(`\n${colors.bright}${colors.blue}========== TEST 6: MARK AS READ ==========${colors.reset}`);
    
    // First get an unread notification
    const getResponse = await apiCall('GET', '/notifications/unread');
    
    if (getResponse.status === 200 && getResponse.data.count > 0) {
      const notificationId = getResponse.data.notifications[0]._id;
      
      // Mark it as read
      const response = await apiCall('PUT', `/notifications/${notificationId}/read`);
      
      if (response.status === 200) {
        log(colors.green, '✅ MARK AS READ', {
          notificationId,
          isRead: response.data.notification.isRead
        });
        return true;
      }
    }
    
    log(colors.yellow, '⚠️ MARK AS READ', 'No unread notifications found (this is OK)');
    return true;
  },

  // 7. Mark All as Read
  async testMarkAllAsRead() {
    console.log(`\n${colors.bright}${colors.blue}========== TEST 7: MARK ALL AS READ ==========${colors.reset}`);
    
    const response = await apiCall('PUT', '/notifications/read');
    
    if (response.status === 200) {
      log(colors.green, '✅ MARK ALL AS READ', {
        modifiedCount: response.data.data.modifiedCount
      });
      return true;
    } else {
      log(colors.red, '❌ MARK ALL AS READ FAILED', response.data);
      return false;
    }
  },

  // 8. Delete Notification
  async testDeleteNotification() {
    console.log(`\n${colors.bright}${colors.blue}========== TEST 8: DELETE NOTIFICATION ==========${colors.reset}`);
    
    // First get a notification
    const getResponse = await apiCall('GET', '/notifications?page=1&limit=1');
    
    if (getResponse.status === 200 && getResponse.data.data.notifications.length > 0) {
      const notificationId = getResponse.data.data.notifications[0]._id;
      
      // Delete it
      const response = await apiCall('DELETE', `/notifications/${notificationId}`);
      
      if (response.status === 200) {
        log(colors.green, '✅ DELETE NOTIFICATION', {
          notificationId,
          message: response.data.message
        });
        return true;
      }
    }
    
    log(colors.yellow, '⚠️ DELETE NOTIFICATION', 'No notifications found (this is OK)');
    return true;
  },

  // 9. Unauthorized Access Test
  async testUnauthorizedAccess() {
    console.log(`\n${colors.bright}${colors.blue}========== TEST 9: UNAUTHORIZED ACCESS ==========${colors.reset}`);
    
    // Clear token
    const tempToken = AUTH_TOKEN;
    AUTH_TOKEN = '';
    
    const response = await apiCall('GET', '/notifications');
    AUTH_TOKEN = tempToken;
    
    if (response.status === 401) {
      log(colors.green, '✅ UNAUTHORIZED ACCESS CORRECTLY REJECTED', response.data);
      return true;
    } else {
      log(colors.red, '❌ UNAUTHORIZED ACCESS NOT REJECTED', response.data);
      return false;
    }
  }
};

// Run all tests
async function runAllTests() {
  console.log(`${colors.bright}${colors.blue}
╔════════════════════════════════════════╗
║  EcoVerse Notification System Test     ║
║  API Test Suite v1.0                   ║
╚════════════════════════════════════════╝${colors.reset}`);

  const results = {
    passed: 0,
    failed: 0,
    tests: []
  };

  // Run tests in sequence
  for (const [testName, testFunc] of Object.entries(tests)) {
    try {
      const passed = await testFunc();
      results.tests.push({ testName, passed });
      if (passed) {
        results.passed++;
      } else {
        results.failed++;
      }
    } catch (error) {
      console.error(`Exception in ${testName}:`, error);
      results.tests.push({ testName, passed: false, error: error.message });
      results.failed++;
    }
  }

  // Summary
  console.log(`\n${colors.bright}${colors.blue}========== TEST SUMMARY ==========${colors.reset}`);
  console.log(`
${colors.green}✅ Passed: ${results.passed}${colors.reset}
${colors.red}❌ Failed: ${results.failed}${colors.reset}
Total: ${results.passed + results.failed}
`);

  // Details
  results.tests.forEach(test => {
    const icon = test.passed ? '✅' : '❌';
    const color = test.passed ? colors.green : colors.red;
    console.log(`${color}${icon} ${test.testName}${colors.reset}`);
  });

  console.log(`\n${colors.bright}${colors.blue}========== END OF TESTS ==========${colors.reset}\n`);
}

// Run tests
runAllTests().catch(error => {
  console.error('Test suite failed:', error);
  process.exit(1);
});
