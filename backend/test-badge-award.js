const mongoose = require('mongoose');
const { checkAndAwardBadges } = require('./controllers/badgeController');
const User = require('./models/User');

async function testBadgeAwarding() {
  try {
    await mongoose.connect('mongodb://localhost:27017/ecoverse');

    // Get a student with ecoPoints >= 50
    const students = await User.find({ role: 'student' }).select('name ecoPoints').sort({ ecoPoints: -1 }).limit(1);
    if (students.length > 0) {
      const student = students[0];
      console.log('Testing badge awarding for:', student.name, '- ecoPoints:', student.ecoPoints);

      const result = await checkAndAwardBadges(student._id);
      console.log('Badges awarded:', result.length);
      result.forEach(badge => console.log('- Awarded:', badge.name));
    }

    await mongoose.disconnect();
  } catch (err) {
    console.error('Error:', err);
  }
}

testBadgeAwarding();