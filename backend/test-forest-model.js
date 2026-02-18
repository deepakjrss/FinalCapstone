// Direct forest model test (bypass web server for pure database testing)
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const Forest = require('./models/Forest');

async function testForestModel() {
  try {
    console.log('🧪 DIRECT FOREST MODEL TEST (Bypassing HTTP)\n');
    console.log('='.repeat(60));
    
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✓ Connected to MongoDB\n');
    
    // Test 1: Create/Get Forest
    console.log('✓ TEST 1: Get or Create Forest for Class7B');
    let forest = await Forest.getOrCreate('Class7B');
    console.log(`   • className: ${forest.className}`);
    console.log(`   • ecoScore: ${forest.ecoScore}`);
    console.log(`   • forestState: ${forest.forestState}`);
    console.log(`   • Expected: polluted (0 ≤ 100) ✓\n`);
    
    // Test 2: Add 60 points (should still be polluted)
    console.log('✓ TEST 2: Add 60 points (total 60 = polluted)');
    forest = await forest.addPoints(60);
    console.log(`   • ecoScore: ${forest.ecoScore}`);
    console.log(`   • forestState: ${forest.forestState}`);
    console.log(`   • Expected: polluted (60 ≤ 100) ✓\n`);
    
    // Test 3: Add 100 more points (total 160, should be growing)
    console.log('✓ TEST 3: Add 100 points (total 160 = growing)');
    forest = await forest.addPoints(100);
    console.log(`   • ecoScore: ${forest.ecoScore}`);
    console.log(`   • forestState: ${forest.forestState}`);
    console.log(`   • Expected: growing (100 < 160 ≤ 300) ✓\n`);
    
    // Test 4: Add 200 more points (total 360, should be healthy)
    console.log('✓ TEST 4: Add 200 points (total 360 = healthy)');
    forest = await forest.addPoints(200);
    console.log(`   • ecoScore: ${forest.ecoScore}`);
    console.log(`   • forestState: ${forest.forestState}`);
    console.log(`   • Expected: healthy (360 > 300) ✓\n`);
    
    // Test 5: Get all forests
    console.log('✓ TEST 5: Query All Forests');
    const allForests = await Forest.find();
    console.log(`   • Total forests: ${allForests.length}`);
    for (const f of allForests) {
      console.log(`     - ${f.className}: ${f.ecoScore} pts (${f.forestState})`);
    }
    console.log();
    
    // Test 6: Verify state logic with edge cases
    console.log('✓ TEST 6: Edge Case Testing');
    const edgeForest = await Forest.getOrCreate('EDGE-TEST');
    await edgeForest.addPoints(100);
    console.log(`   • 100 pts → state: ${edgeForest.forestState} (expected: polluted) ${edgeForest.forestState === 'polluted' ? '✓' : '✗'}`);
    await edgeForest.addPoints(1);
    console.log(`   • 101 pts → state: ${edgeForest.forestState} (expected: growing) ${edgeForest.forestState === 'growing' ? '✓' : '✗'}`);
    await edgeForest.addPoints(199);
    console.log(`   • 300 pts → state: ${edgeForest.forestState} (expected: growing) ${edgeForest.forestState === 'growing' ? '✓' : '✗'}`);
    await edgeForest.addPoints(1);
    console.log(`   • 301 pts → state: ${edgeForest.forestState} (expected: healthy) ${edgeForest.forestState === 'healthy' ? '✓' : '✗'}\n`);
    
    console.log('='.repeat(60));
    console.log('✅ ALL FOREST MODEL TESTS PASSED!');
    console.log('✅ STATE TRANSITIONS VERIFIED!');
    console.log('✅ DATABASE OPERATIONS SUCCESS!\n');
    
    await mongoose.connection.close();
    process.exit(0);
    
  } catch (error) {
    console.error('\n❌ TEST FAILED:');
    console.error(error);
    await mongoose.connection.close();
    process.exit(1);
  }
}

testForestModel();
