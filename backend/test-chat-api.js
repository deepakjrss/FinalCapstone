// Automated test for AI chatbot endpoint: registers a user, logs in, then calls /api/chat

const http = require('http');

function request(options, body) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({ status: res.statusCode, data });
      });
    });
    req.on('error', reject);
    if (body) req.write(body);
    req.end();
  });
}

(async () => {
  try {
    console.log('Starting chatbot API full test...');

    // 1. register a temporary student user
    const email = `test${Date.now()}@example.com`;
    const registerOpts = {
      hostname: 'localhost',
      port: 5000,
      path: '/api/auth/register',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    };

    const regBody = JSON.stringify({
      name: 'Test User',
      email,
      password: 'password123',
      role: 'student',
      className: 'TestClass'
    });

    const regRes = await request(registerOpts, regBody);
    console.log('Register status', regRes.status, regRes.data);

    // 2. login to receive token
    const loginOpts = { ...registerOpts, path: '/api/auth/login' };
    const loginBody = JSON.stringify({ email, password: 'password123' });
    const loginRes = await request(loginOpts, loginBody);
    console.log('Login status', loginRes.status, loginRes.data);

    const token = JSON.parse(loginRes.data).token;
    if (!token) throw new Error('No token obtained');

    // 3. call chat endpoint
    const chatOpts = {
      hostname: 'localhost',
      port: 5000,
      path: '/api/chat',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      }
    };

    const chatRes = await request(chatOpts, JSON.stringify({ message: 'How can I be eco-friendly?' }));
    console.log('Chat status', chatRes.status, chatRes.data);

  } catch (err) {
    console.error('Test script error:', err);
  }
})();
