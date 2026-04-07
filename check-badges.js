const mongoose = require('mongoose');
const StudentBadge = require('./models/StudentBadge');
const User = require('./models/User');

async function checkLowEcoStudents() {
  try {
    await mongoose.connect('mongodb://localhost:27017/ecoverse');
    console.log('Connected to MongoDB');

    const students = await User.find({ role: 'student' }).select('name ecoPoints').sort({ ecoPoints: 1 }).limit(10);
    console.log('Students with lowest ecoPoints:');
    students.forEach(s => console.log('-', s.name, ':', s.ecoPoints, 'points'));

    // Check a student with low ecoPoints
    const lowEcoStudent = students.find(s => s.ecoPoints < 200);
    if (lowEcoStudent) {
      const studentId = lowEcoStudent._id;
      console.log('\nChecking badges for student:', lowEcoStudent.name, '(ecoPoints:', lowEcoStudent.ecoPoints, ')');

      const studentBadges = await StudentBadge.find({ student: studentId }).populate('badge', 'name threshold conditionType');
      console.log('Earned badges:');
      studentBadges.forEach(sb => {
        console.log('-', sb.badge.name, '(threshold:', sb.badge.threshold, sb.badge.conditionType + ')');
      });

      // Check what badges they should have earned
      console.log('\nShould have earned:');
      if (lowEcoStudent.ecoPoints >= 50) console.log('- Beginner Saver (50)');
      if (lowEcoStudent.ecoPoints >= 200) console.log('- Eco Warrior (200)');
      if (lowEcoStudent.ecoPoints >= 500) console.log('- Tree Guardian (500)');
      if (lowEcoStudent.ecoPoints >= 1000) console.log('- Earth Hero (1000)');
    }

    await mongoose.disconnect();
  } catch (err) {
    console.error('Error:', err);
  }
}

checkLowEcoStudents();