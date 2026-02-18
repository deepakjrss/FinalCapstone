const mongoose = require('mongoose');

const mongoURI = process.env.MONGODB_URI || 'mongodb+srv://deepak:8466062726Deepak@cluster0.qzyxzn5.mongodb.net/ecoverse?retryWrites=true&w=majority';

console.log('🔍 Testing MongoDB connection...');
console.log('URI:', mongoURI.replace(/:[^:]*@/, ':***@'));

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 5000
})
.then(() => {
  console.log('✅ MongoDB connection SUCCESS!');
  console.log('You can now use the app normally.');
  process.exit(0);
})
.catch(err => {
  console.log('❌ MongoDB connection FAILED');
  console.log('Error:', err.message);
  
  if (err.message.includes('querySrv') || err.message.includes('ECONNREFUSED')) {
    console.log('\n💡 SOLUTION: Your IP is likely not whitelisted in MongoDB Atlas\n');
    console.log('ACTION REQUIRED:');
    console.log('1. Go to: https://cloud.mongodb.com');
    console.log('2. Sign in → Select "Cluster0"');
    console.log('3. Click "Network Access" in the left sidebar');
    console.log('4. Click "Add IP Address"');
    console.log('5. Click "Add Current IP Address" (auto-detects your IP)');
    console.log('6. Click "Add IP Address" button');
    console.log('7. Restart the backend: npm start\n');
    console.log('ALT: Add 0.0.0.0/0 to allow ALL IPs (not recommended for production)');
  }
  process.exit(1);
});
