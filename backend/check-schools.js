const mongoose = require('mongoose');
require('dotenv').config();

const School = require('./models/School');

async function checkSchools() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const schools = await School.find({});
    console.log('Schools:');
    schools.forEach(school => {
      console.log(`Name: ${school.name}, InviteCode: ${school.inviteCode}, EmailDomain: ${school.emailDomain}`);
    });

    await mongoose.disconnect();
  } catch (error) {
    console.error('Error:', error);
  }
}

checkSchools();