async function testBadgeProgressAPI() {
  try {
    // First login to get token
    const loginResponse = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: 'student110a@greenvalley.com',
        password: '123456'
      })
    });

    const loginData = await loginResponse.json();
    const token = loginData.token;
    console.log('Logged in, got token');

    // Call badge progress endpoint
    const badgeResponse = await fetch('http://localhost:5000/api/badges/progress', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    const badgeData = await badgeResponse.json();
    console.log('Badge progress response:');
    console.log(JSON.stringify(badgeData, null, 2));

  } catch (error) {
    console.error('Error:', error.message);
  }
}

testBadgeProgressAPI();