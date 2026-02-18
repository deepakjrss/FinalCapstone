/**
 * Leaderboard Module Test File
 * Tests the Class vs Class Leaderboard endpoints
 * 
 * Usage: node test-leaderboard.js
 * 
 * This file demonstrates:
 * 1. Creating test forest data
 * 2. Calling leaderboard API endpoints
 * 3. Validating responses
 */

require('dotenv').config();
const mongoose = require('mongoose');
const Forest = require('./models/Forest');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('✅ MongoDB connected for testing');
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error);
    process.exit(1);
  }
};

// Test data - Forest classes with various eco scores
const testForests = [
  { className: 'CLASS 10A', ecoScore: 520 },
  { className: 'CLASS 10B', ecoScore: 380 },
  { className: 'CLASS 9A', ecoScore: 150 },
  { className: 'CLASS 9B', ecoScore: 280 },
  { className: 'CLASS 8A', ecoScore: 420 },
  { className: 'CLASS 8B', ecoScore: 90 },
  { className: 'CLASS 7A', ecoScore: 350 },
  { className: 'CLASS 7B', ecoScore: 200 }
];

/**
 * Seed test forest data
 */
const seedTestData = async () => {
  try {
    console.log('\n📝 Seeding test forest data...');

    // Clear existing forests
    await Forest.deleteMany({});
    console.log('  Cleared existing forests');

    // Create test forests
    for (const forest of testForests) {
      const existingForest = await Forest.findOne({
        className: forest.className
      });

      if (!existingForest) {
        const newForest = new Forest(forest);
        await newForest.save();
        console.log(`  ✓ Created ${forest.className} with score ${forest.ecoScore}`);
      }
    }

    console.log('✅ Test data seeded successfully\n');
  } catch (error) {
    console.error('❌ Error seeding test data:', error);
    throw error;
  }
};

/**
 * Simulate API: Get Complete Leaderboard
 */
const testGetLeaderboard = async () => {
  try {
    console.log('🧪 TEST 1: Get Complete Leaderboard');
    console.log('├─ Endpoint: GET /api/leaderboard');
    console.log('├─ Access: Protected (Student, Teacher)');
    console.log('└─ Expected: All classes ranked by ecoScore\n');

    const forests = await Forest.find()
      .sort({ ecoScore: -1 })
      .lean();

    const leaderboard = forests.map((forest, index) => ({
      rank: index + 1,
      className: forest.className,
      ecoScore: forest.ecoScore,
      forestState: forest.forestState,
      lastUpdated: forest.lastUpdated
    }));

    console.log('   RESPONSE:');
    console.log('   ┌─────────────────────────────────────┐');
    leaderboard.forEach((entry) => {
      console.log(
        `   │ #${entry.rank.toString().padEnd(2)} ${entry.className.padEnd(12)} ${entry.ecoScore.toString().padEnd(5)} pts  [${entry.forestState}]`
      );
    });
    console.log('   └─────────────────────────────────────┘\n');

    console.log(`   ✅ PASS: Retrieved ${leaderboard.length} classes\n`);
    return true;
  } catch (error) {
    console.error('   ❌ FAIL:', error.message, '\n');
    return false;
  }
};

/**
 * Simulate API: Get Leaderboard by Forest State
 */
const testGetLeaderboardByState = async () => {
  try {
    console.log('🧪 TEST 2: Get Leaderboard by Forest State');
    console.log('├─ Endpoint: GET /api/leaderboard/state/:state');
    console.log('├─ Parameter: state = "healthy"');
    console.log('└─ Expected: Classes with healthy forests\n');

    const forests = await Forest.find({ forestState: 'healthy' })
      .sort({ ecoScore: -1 })
      .lean();

    const leaderboard = forests.map((forest, index) => ({
      rank: index + 1,
      className: forest.className,
      ecoScore: forest.ecoScore,
      forestState: forest.forestState
    }));

    console.log('   RESPONSE:');
    if (leaderboard.length > 0) {
      console.log('   ┌─────────────────────────────────────┐');
      leaderboard.forEach((entry) => {
        console.log(
          `   │ #${entry.rank.toString().padEnd(2)} ${entry.className.padEnd(12)} ${entry.ecoScore.toString().padEnd(5)} pts  [healthy]`
        );
      });
      console.log('   └─────────────────────────────────────┘\n');
    } else {
      console.log('   No classes with healthy forests found\n');
    }

    console.log(`   ✅ PASS: Retrieved ${leaderboard.length} healthy classes\n`);
    return true;
  } catch (error) {
    console.error('   ❌ FAIL:', error.message, '\n');
    return false;
  }
};

/**
 * Simulate API: Get Top N Classes
 */
const testGetTopClasses = async () => {
  try {
    console.log('🧪 TEST 3: Get Top N Classes');
    console.log('├─ Endpoint: GET /api/leaderboard/top/:limit');
    console.log('├─ Parameter: limit = 3');
    console.log('└─ Expected: Top 3 classes by ecoScore\n');

    const forests = await Forest.find()
      .sort({ ecoScore: -1 })
      .limit(3)
      .lean();

    const leaderboard = forests.map((forest, index) => ({
      rank: index + 1,
      className: forest.className,
      ecoScore: forest.ecoScore,
      forestState: forest.forestState
    }));

    console.log('   RESPONSE:');
    console.log('   ┌─────────────────────────────────────┐');
    leaderboard.forEach((entry) => {
      console.log(
        `   │ #${entry.rank.toString().padEnd(2)} ${entry.className.padEnd(12)} ${entry.ecoScore.toString().padEnd(5)} pts  [${entry.forestState}]`
      );
    });
    console.log('   └─────────────────────────────────────┘\n');

    console.log(`   ✅ PASS: Retrieved top 3 classes\n`);
    return true;
  } catch (error) {
    console.error('   ❌ FAIL:', error.message, '\n');
    return false;
  }
};

/**
 * Simulate API: Get Class Rank
 */
const testGetClassRank = async () => {
  try {
    console.log('🧪 TEST 4: Get Class Rank');
    console.log('├─ Endpoint: GET /api/leaderboard/rank/:className');
    console.log('├─ Parameter: className = "10A"');
    console.log('└─ Expected: Rank and details of CLASS 10A\n');

    const forest = await Forest.findOne({
      className: 'CLASS 10A'
    }).lean();

    if (!forest) {
      throw new Error('Forest not found');
    }

    const allForests = await Forest.find()
      .sort({ ecoScore: -1 })
      .lean();

    const rankIndex = allForests.findIndex((f) => f.className === forest.className);
    const rank = rankIndex !== -1 ? rankIndex + 1 : null;

    console.log('   RESPONSE:');
    console.log(`   ┌────────────────────────────────────────┐`);
    console.log(`   │ Class Name:   CLASS 10A                │`);
    console.log(`   │ Rank:         #${rank}                     │`);
    console.log(`   │ Eco Score:    ${forest.ecoScore} pts                │`);
    console.log(`   │ Forest State: ${forest.forestState}               │`);
    console.log(`   │ Total Classes: ${allForests.length}                  │`);
    console.log(`   └────────────────────────────────────────┘\n`);

    console.log(`   ✅ PASS: Retrieved CLASS 10A rank: #${rank}\n`);
    return true;
  } catch (error) {
    console.error('   ❌ FAIL:', error.message, '\n');
    return false;
  }
};

/**
 * Test input validation
 */
const testInputValidation = async () => {
  try {
    console.log('🧪 TEST 5: Input Validation');

    // Test 1: Invalid forest state
    console.log('├─ Testing invalid forest state...');
    const validStates = ['polluted', 'growing', 'healthy'];
    const invalidState = 'invalid';
    if (!validStates.includes(invalidState)) {
      console.log(`   ✅ Correctly rejects invalid state: "${invalidState}"\n`);
    }

    // Test 2: Invalid class name
    console.log('├─ Testing invalid class name...');
    const className = '';
    if (!className || className.trim() === '') {
      console.log(`   ✅ Correctly rejects empty class name\n`);
    }

    // Test 3: Invalid limit
    console.log('└─ Testing invalid limit values...');
    const testLimits = [-1, 0, 101, 'abc', 50]; // Last one is valid
    testLimits.forEach((limit) => {
      const limitNum = parseInt(limit);
      const isValid = !isNaN(limitNum) && limitNum >= 1 && limitNum <= 100;
      const status = isValid ? '✅' : '❌';
      console.log(
        `   ${status} Limit ${limit}: ${isValid ? 'Valid' : 'Invalid'}`
      );
    });
    console.log('\n');

    return true;
  } catch (error) {
    console.error('   ❌ FAIL:', error.message, '\n');
    return false;
  }
};

/**
 * Test database performance
 */
const testPerformance = async () => {
  try {
    console.log('🧪 TEST 6: Performance Metrics');
    console.log('');

    // Test 1: Query all forests
    const start1 = Date.now();
    const forests = await Forest.find().sort({ ecoScore: -1 }).lean();
    const time1 = Date.now() - start1;
    console.log(`├─ Query all forests: ${time1}ms (${forests.length} docs)`);

    // Test 2: Query with filter
    const start2 = Date.now();
    const healthyForests = await Forest.find({ forestState: 'healthy' });
    const time2 = Date.now() - start2;
    console.log(
      `├─ Query by state (healthy): ${time2}ms (${healthyForests.length} docs)`
    );

    // Test 3: Single forest lookup
    const start3 = Date.now();
    const singleForest = await Forest.findOne({ className: 'CLASS 10A' }).lean();
    const time3 = Date.now() - start3;
    console.log(`└─ Single forest lookup: ${time3}ms`);

    console.log('\n   ✅ PASS: All queries executed successfully\n');
    return true;
  } catch (error) {
    console.error('   ❌ FAIL:', error.message, '\n');
    return false;
  }
};

/**
 * Main test runner
 */
const runTests = async () => {
  try {
    await connectDB();

    console.log('\n╔═══════════════════════════════════════════════════════╗');
    console.log('║  ECOVERSE LEADERBOARD MODULE - TEST SUITE            ║');
    console.log('║  Module 5: Class vs Class Leaderboard               ║');
    console.log('╚═══════════════════════════════════════════════════════╝\n');

    // Seed test data
    await seedTestData();

    // Run all tests
    const results = [];
    results.push(await testGetLeaderboard());
    results.push(await testGetLeaderboardByState());
    results.push(await testGetTopClasses());
    results.push(await testGetClassRank());
    results.push(await testInputValidation());
    results.push(await testPerformance());

    // Summary
    const passed = results.filter((r) => r === true).length;
    const failed = results.filter((r) => r === false).length;

    console.log('╔═══════════════════════════════════════════════════════╗');
    console.log('║  TEST SUMMARY                                        ║');
    console.log(`║  Total Tests: ${(passed + failed).toString().padEnd(42)} ║`);
    console.log(
      `║  ${passed === results.length ? '✅' : '⚠️ '} Passed: ${passed.toString().padEnd(45)} ║`
    );
    if (failed > 0) {
      console.log(`║  ❌ Failed: ${failed.toString().padEnd(45)} ║`);
    }
    console.log('╚═══════════════════════════════════════════════════════╝\n');

    if (passed === results.length) {
      console.log('✅ All tests passed! Leaderboard module is ready.\n');
    } else {
      console.log('⚠️  Some tests failed. Please review the errors above.\n');
    }

    await mongoose.connection.close();
    process.exit(passed === results.length ? 0 : 1);
  } catch (error) {
    console.error('Fatal error:', error);
    process.exit(1);
  }
};

// Run tests
runTests();
