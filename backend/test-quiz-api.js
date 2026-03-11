// Script to register/login and call /api/games/generate-quiz
const http = require('http');

function request(options, body) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ status: res.statusCode, data }));
    });
    req.on('error', reject);
    if (body) req.write(body);
    req.end();
  });
}

(async () => {
  try {
    const email = `quiz${Date.now()}@example.com`;
    console.log('registering', email);
    const regRes = await request({
      hostname:'localhost', port:5000, path:'/api/auth/register', method:'POST', headers:{'Content-Type':'application/json'}
    }, JSON.stringify({ name:'Quiz User', email, password:'password123', role:'student', className:'QuizClass' }));
    console.log('reg', regRes.status, regRes.data);
    const loginRes = await request({ hostname:'localhost',port:5000,path:'/api/auth/login',method:'POST',headers:{'Content-Type':'application/json'} }, JSON.stringify({ email, password:'password123' }));
    console.log('login', loginRes.status, loginRes.data);
    const token = JSON.parse(loginRes.data).token;
    const quizRes = await request({ hostname:'localhost',port:5000,path:'/api/games/generate-quiz',method:'GET',headers:{ Authorization:`Bearer ${token}` } });
    console.log('quiz', quizRes.status, quizRes.data);
  } catch(err){ console.error('error', err); }
})();
