async function testGamesAPI() {
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

    // Call games endpoint
    const gamesResponse = await fetch('http://localhost:5000/api/games', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    const gamesData = await gamesResponse.json();
    console.log('Games API response:');
    console.log(JSON.stringify(gamesData, null, 2));

  } catch (error) {
    console.error('Error:', error.message);
  }
}

testGamesAPI();