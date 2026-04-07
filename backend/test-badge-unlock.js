const axios = require('axios');

// Test badge unlocking
const testBadgeUnlock = async () => {
  try {
    console.log('🧪 Testing Badge Unlock Logic...\n');

    // First, login to get token
    const loginResponse = await axios.post('http://localhost:5000/api/auth/login', {
      email: 'student110a@greenvalley.com',
      password: '123456'
    });

    const token = loginResponse.data.token;
    console.log('✅ Logged in successfully');

    // Check current badge progress
    const progressResponse = await axios.get('http://localhost:5000/api/badges/progress', {
      headers: { Authorization: `Bearer ${token}` }
    });

    console.log('📊 Current Badge Progress:');
    const badgeData = progressResponse.data.data || progressResponse.data.progress || [];
    if (badgeData.length === 0) {
      console.log('  No badges found');
    } else {
      badgeData.forEach(badge => {
        console.log(`  ${badge.badge.icon} ${badge.badge.name}: ${badge.earned ? '✅ Earned' : '⏳ ' + Math.round(badge.progress) + '%'} (${badge.badge.conditionType} ≥ ${badge.badge.threshold})`);
      });
    }

    // Add eco points to reach 1000
    console.log('\n💚 Adding eco points to reach 1000...');
    const addPointsResponse = await axios.post('http://localhost:5000/api/users/add-points', {
      points: 1000
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });

    console.log(`✅ Added points. New total: ${addPointsResponse.data.ecoPoints}`);

    // Check badge progress again
    const updatedProgressResponse = await axios.get('http://localhost:5000/api/badges/progress', {
      headers: { Authorization: `Bearer ${token}` }
    });

    console.log('\n📊 Updated Badge Progress:');
    const updatedBadgeData = updatedProgressResponse.data.data || updatedProgressResponse.data.progress || [];
    if (updatedBadgeData.length === 0) {
      console.log('  No badges found');
    } else {
      updatedBadgeData.forEach(badge => {
        console.log(`  ${badge.badge.icon} ${badge.badge.name}: ${badge.earned ? '✅ Earned' : '⏳ ' + Math.round(badge.progress) + '%'} (${badge.badge.conditionType} ≥ ${badge.badge.threshold})`);
      });
    }

    console.log('\n🎉 Badge unlock test completed!');

  } catch (error) {
    console.error('❌ Error testing badge unlock:', error.response?.data || error.message);
  }
};

testBadgeUnlock();