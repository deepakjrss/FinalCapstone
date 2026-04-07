const axios = require('axios');

// Test login and then admin analytics
async function testAdminLoginAndAnalytics() {
  try {
    console.log('🔐 Testing admin login...');

    // Login as admin
    const loginResponse = await axios.post('http://localhost:5000/api/auth/login', {
      email: 'admin@greenvalley.com',
      password: '123456'
    });

    const token = loginResponse.data.token;
    console.log('✅ Login successful, got token');

    console.log('📊 Testing admin analytics API...');

    // Test analytics API
    const analyticsResponse = await axios.get('http://localhost:5000/api/admin/analytics', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    console.log('✅ Admin Analytics API Success:');
    console.log(JSON.stringify(analyticsResponse.data, null, 2));

  } catch (error) {
    console.log('❌ Error:');
    if (error.response) {
      console.log('Status:', error.response.status);
      console.log('Data:', error.response.data);
    } else {
      console.log('Message:', error.message);
    }
  }
}

testAdminLoginAndAnalytics();