/**
 * Test Games Display Integration
 * Verifies that games are properly displayed on dashboard and games list
 */

const baseURL = 'http://localhost:5000/api';
let authToken = '';

// Mock student user credentials
const testUser = {
  email: 'student@test.com',
  password: 'password123'
};

// Test Results
const results = {
  tests: [],
  passed: 0,
  failed: 0,
  summary: ''
};

// Helper function to log test results
function logTest(name, passed, message) {
  const status = passed ? '✅ PASS' : '❌ FAIL';
  console.log(`${status} | ${name}`);
  if (message) console.log(`   → ${message}`);
  
  results.tests.push({
    name,
    passed,
    message
  });
  
  if (passed) {
    results.passed++;
  } else {
    results.failed++;
  }
}

// Test 1: Login and get auth token
async function testLogin() {
  console.log('\n🔐 TEST 1: Authentication');
  try {
    const response = await fetch(`${baseURL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(testUser)
    });

    const data = await response.json();
    
    if (response.ok && data.token) {
      authToken = data.token;
      logTest('Login successful', true, `Got auth token: ${authToken.substring(0, 20)}...`);
      return true;
    } else {
      logTest('Login successful', false, `Response: ${data.message || 'Unknown error'}`);
      return false;
    }
  } catch (error) {
    logTest('Login successful', false, `Error: ${error.message}`);
    return false;
  }
}

// Test 2: Fetch available games
async function testGetGames() {
  console.log('\n🎮 TEST 2: Fetch Available Games');
  try {
    const response = await fetch(`${baseURL}/games`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json'
      }
    });

    const data = await response.json();
    
    if (response.ok && data.games) {
      logTest('Games API endpoint', true, `Returned ${data.games.length} games`);
      console.log('   Games returned:');
      data.games.forEach(game => {
        console.log(`   • ${game.title} (${game.difficulty}) - ${game.questions?.length || 0} questions`);
      });
      return data.games;
    } else {
      logTest('Games API endpoint', false, `Response: ${data.message || 'Unknown error'}`);
      return [];
    }
  } catch (error) {
    logTest('Games API endpoint', false, `Error: ${error.message}`);
    return [];
  }
}

// Test 3: Check game data structure
async function testGameDataStructure(games) {
  console.log('\n📊 TEST 3: Game Data Structure Validation');
  if (games.length === 0) {
    logTest('Game data structure', false, 'No games to validate');
    return;
  }

  let allValid = true;
  const requiredFields = ['_id', 'title', 'difficulty', 'category'];
  
  games.slice(0, 3).forEach((game, index) => {
    const missingFields = requiredFields.filter(field => !game[field]);
    if (missingFields.length > 0) {
      logTest(`Game ${index + 1} data structure`, false, `Missing fields: ${missingFields.join(', ')}`);
      allValid = false;
    } else {
      logTest(`Game ${index + 1} data structure`, true, `${game.title} has all required fields`);
    }
  });
}

// Test 4: Verify difficulty values
async function testDifficultyValues(games) {
  console.log('\n🎯 TEST 4: Difficulty Values');
  const validDifficulties = ['easy', 'medium', 'hard', 'Easy', 'Medium', 'Hard'];
  
  games.forEach((game, index) => {
    const isValid = validDifficulties.includes(game.difficulty);
    if (index < 5) { // Check first 5 games
      logTest(`Game ${index + 1} difficulty`, isValid, `${game.title}: ${game.difficulty}`);
    }
  });
}

// Test 5: Verify game descriptions and categories
async function testGameMetadata(games) {
  console.log('\n🏷️ TEST 5: Game Metadata');
  
  const categories = new Set();
  games.forEach(game => {
    if (game.category) {
      categories.add(game.category);
    }
  });

  logTest('Game descriptions', games.some(g => g.description), `${games.filter(g => g.description).length}/${games.length} games have descriptions`);
  logTest('Game categories', categories.size > 0, `Found ${categories.size} unique categories: ${Array.from(categories).join(', ')}`);
}

// Test 6: Check max points scaling
async function testMaxPoints(games) {
  console.log('\n💰 TEST 6: Max Points Configuration');
  
  const pointsDistribution = {
    100: 0,
    150: 0,
    200: 0,
    other: 0
  };

  games.forEach(game => {
    const points = game.maxPoints || 100;
    if (pointsDistribution.hasOwnProperty(points)) {
      pointsDistribution[points]++;
    } else {
      pointsDistribution.other++;
    }
  });

  logTest('Max points distribution', games.every(g => g.maxPoints && g.maxPoints > 0), 
    `Distribution: 100pts=${pointsDistribution[100]}, 150pts=${pointsDistribution[150]}, 200pts=${pointsDistribution[200]}, other=${pointsDistribution.other}`);
}

// Main test runner
async function runAllTests() {
  console.log('🧪 STARTING GAMES DISPLAY INTEGRATION TESTS\n');
  console.log('═'.repeat(60));

  // Test login
  const loggedIn = await testLogin();
  if (!loggedIn) {
    console.log('\n❌ Cannot continue without authentication');
    printSummary();
    return;
  }

  // Test get games
  const games = await testGetGames();
  
  // Test game structure and metadata
  if (games.length > 0) {
    await testGameDataStructure(games);
    await testDifficultyValues(games);
    await testGameMetadata(games);
    await testMaxPoints(games);
  } else {
    logTest('Test suite continuation', false, 'No games available to test');
  }

  // Print summary
  printSummary();
}

// Print test summary
function printSummary() {
  console.log('\n' + '═'.repeat(60));
  console.log('📋 TEST SUMMARY');
  console.log('═'.repeat(60));
  console.log(`✅ Passed: ${results.passed}`);
  console.log(`❌ Failed: ${results.failed}`);
  console.log(`📊 Total: ${results.tests.length}`);
  
  if (results.failed === 0) {
    console.log('\n🎉 ALL TESTS PASSED! Games display is working correctly.');
  } else {
    console.log('\n⚠️ Some tests failed. Check the details above.');
  }

  console.log('\n📝 DETAILED RESULTS:');
  results.tests.forEach((test, index) => {
    console.log(`${index + 1}. ${test.name}: ${test.passed ? '✅ PASS' : '❌ FAIL'}`);
  });
}

// Run tests
runAllTests().catch(error => {
  console.error('❌ Test runner error:', error.message);
  process.exit(1);
});
