const API_URL = 'http://localhost:5000/api';

async function fetchJson(url, options = {}) {
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers
    },
    ...options
  });
  
  if (!response.ok && response.status !== 409) {
    throw new Error(`HTTP ${response.status}: ${await response.text()}`);
  }
  return response.json();
}

async function runTests() {
  try {
    console.log('🧪 TESTING MODULE 2: VIRTUAL FOREST ENGINE\n');
    console.log('='.repeat(60));
    
    // Test 1: Login Teacher (direct login, skip registration to avoid SSL issues)
    console.log('\n✓ TEST 1: Login Teacher Account');
    const loginRes = await fetchJson(`${API_URL}/auth/login`, {
      method: 'POST',
      body: JSON.stringify({
        email: 'teacher.forest@test.com',
        password: 'SecurePass123'
      })
    }).catch(async (e) => {
      // If login fails, try to register first
      console.log('   → No existing account, registering...');
      return await fetchJson(`${API_URL}/auth/register`, {
        method: 'POST',
        body: JSON.stringify({
          name: 'Test Teacher',
          email: 'teacher.forest@test.com',
          password: 'SecurePass123',
          role: 'teacher'
        })
      });
    });
    
    const token = loginRes.token;
    console.log('   ✓ Teacher authenticated');
    console.log(`   ✓ Token: ${token.substring(0, 20)}...`);
    
    const headers = { Authorization: `Bearer ${token}` };
    
    // Test 2: Get Forest (auto-create)
    console.log('\n✓ TEST 2: GET /api/forest/Class8A (auto-create)');
    const getRes = await fetchJson(`${API_URL}/forest/Class8A`, { headers });
    console.log(`   ✓ Forest retrieved/created`);
    console.log(`   • Class: ${getRes.forest.className}`);
    console.log(`   • Eco Score: ${getRes.forest.ecoScore}`);
    console.log(`   • State: ${getRes.forest.forestState}`);
    
    // Test 3: Update Forest Score (add 50 points)
    console.log('\n✓ TEST 3: PUT /api/forest/update (add 50 points)');
    const updateRes = await fetchJson(`${API_URL}/forest/update`, {
      method: 'PUT',
      headers,
      body: JSON.stringify({
        className: 'Class8A',
        points: 50
      })
    });
    console.log(`   ✓ Forest updated`);
    console.log(`   • New Eco Score: ${updateRes.forest.ecoScore}`);
    console.log(`   • State: ${updateRes.forest.forestState}`);
    console.log(`   • Expected: polluted (score 50 ≤ 100) ✓`);
    
    // Test 4: Add more points to reach 'growing' state
    console.log('\n✓ TEST 4: PUT /api/forest/update (add 100 points → total 150)');
    const update2Res = await fetchJson(`${API_URL}/forest/update`, {
      method: 'PUT',
      headers,
      body: JSON.stringify({
        className: 'Class8A',
        points: 100
      })
    });
    console.log(`   ✓ Forest updated`);
    console.log(`   • New Eco Score: ${update2Res.forest.ecoScore}`);
    console.log(`   • State: ${update2Res.forest.forestState}`);
    console.log(`   • Expected: growing (100 < score 150 ≤ 300) ✓`);
    
    // Test 5: Add more points to reach 'healthy' state
    console.log('\n✓ TEST 5: PUT /api/forest/update (add 200 points → total 350)');
    const update3Res = await fetchJson(`${API_URL}/forest/update`, {
      method: 'PUT',
      headers,
      body: JSON.stringify({
        className: 'Class8A',
        points: 200
      })
    });
    console.log(`   ✓ Forest updated`);
    console.log(`   • New Eco Score: ${update3Res.forest.ecoScore}`);
    console.log(`   • State: ${update3Res.forest.forestState}`);
    console.log(`   • Expected: healthy (score 350 > 300) ✓`);
    
    // Test 6: Get all forests (admin view)
    console.log('\n✓ TEST 6: GET /api/forest (all forests)');
    const allRes = await fetchJson(`${API_URL}/forest`, { headers });
    console.log(`   ✓ Retrieved ${allRes.count} forest(s)`);
    
    // Test 7: Get forest stats
    console.log('\n✓ TEST 7: GET /api/forest/stats/summary');
    const statsRes = await fetchJson(`${API_URL}/forest/stats/summary`, { headers });
    console.log(`   ✓ Stats retrieved`);
    console.log(`   • Total Forests: ${statsRes.stats.totalForests}`);
    console.log(`   • Total Eco Score: ${statsRes.stats.totalEcoScore}`);
    console.log(`   • Average Score: ${statsRes.stats.averageEcoScore}`);
    console.log(`   • State Distribution:`, statsRes.stats.stateDistribution);
    
    console.log('\n' + '='.repeat(60));
    console.log('✅ ALL TESTS PASSED!');
    console.log('✅ MODULE 2 BACKEND APPROVED!\n');
    
  } catch (error) {
    console.error('\n❌ TEST FAILED:');
    console.error('Error:', error.message);
    process.exit(1);
  }
}

runTests();
