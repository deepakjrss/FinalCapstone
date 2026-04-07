const axios = require('axios');

const testBadgeProgress = async () => {
  try {
    console.log('🧪 Testing Badge Progress API...\n');

    // Test badge progress endpoint (assuming we have a test user)
    const response = await axios.get('http://localhost:5000/api/badges/progress', {
      headers: {
        'Authorization': 'Bearer YOUR_TEST_TOKEN_HERE' // You'll need to replace this
      }
    });

    console.log('✅ Badge Progress API Response:');
    console.log(JSON.stringify(response.data, null, 2));

  } catch (error) {
    console.error('❌ Error testing badge progress:', error.response?.data || error.message);
  }
};

testBadgeProgress();