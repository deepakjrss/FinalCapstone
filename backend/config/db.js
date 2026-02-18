const mongoose = require('mongoose');

const connectDB = async () => {
  let retries = 5;
  
  const attemptConnection = async () => {
    try {
      const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ecoverse';
      
      await mongoose.connect(mongoURI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
        bufferCommands: false, // Don't buffer - fail fast if not connected
        retryWrites: true,
      });

      console.log('✓ MongoDB connected successfully');
    } catch (error) {
      retries--;
      if (retries > 0) {
        console.warn(`⚠ Connection attempt failed. Retrying in 3 seconds... (${retries} retries left)`);
        setTimeout(attemptConnection, 3000);
      } else {
        console.error('✗ MongoDB connection failed after multiple attempts:', error.message);
        console.error('The server will continue running, but database operations will fail.');
        console.error('\n📋 TROUBLESHOOTING:');
        console.error('1. Check your MongoDB Atlas cluster is ACTIVE');
        console.error('2. Verify your IP address is whitelisted in MongoDB Atlas');
        console.error('3. Check your internet connection');
        console.error('4. Verify MONGODB_URI in .env file is correct');
      }
    }
  };
  
  await attemptConnection();
};

module.exports = connectDB;
