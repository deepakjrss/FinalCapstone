// Direct API test without authentication headers
const http = require('http');

console.log('Testing Leaderboard API endpoints...\n');

// Test 1: Test without token (should fail with 401)
console.log('Test 1: GET /api/leaderboard (without token)');
const options = {
  hostname: 'localhost',
  port: 5000,
  path: '/api/leaderboard',
  method: 'GET'
};

const req = http.request(options, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    console.log(`Status: ${res.statusCode}`);
    console.log(`Response: ${data}\n`);
    
    if (res.statusCode === 401) {
      console.log('✅ Correctly requires authentication token\n');
    }
  });
});

req.on('error', (e) => {
  console.error(`Error: ${e.message}`);
});

req.end();
