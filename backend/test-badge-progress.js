const mongoose = require('mongoose');
const User = require('./models/User');
const Badge = require('./models/Badge');
const StudentBadge = require('./models/StudentBadge');

async function testBadgeProgress() {
  try {
    await mongoose.connect('mongodb://localhost:27017/ecoverse');

    // Get a student with low ecoPoints
    const students = await User.find({ role: 'student' }).select('name ecoPoints').sort({ ecoPoints: 1 }).limit(5);
    const student = students.find(s => s.ecoPoints > 50 && s.ecoPoints < 200);

    if (student) {
      console.log('Testing badge progress for:', student.name, '- ecoPoints:', student.ecoPoints);

      // Get all badges
      const allBadges = await Badge.find({ isActive: true }).sort({ threshold: 1 });
      console.log('All badges:');
      allBadges.forEach(b => console.log(`- ${b.name}: ${b.threshold} ${b.conditionType}`));

      // Check earned badges
      const studentBadges = await StudentBadge.find({ student: student._id }).populate('badge');
      console.log('Earned badges:');
      studentBadges.forEach(sb => console.log(`- ${sb.badge.name} (${sb.badge.threshold})`));

      // Calculate what should be earned
      console.log('Should be earned:');
      allBadges.forEach(badge => {
        if (badge.conditionType === 'ecoPoints' && student.ecoPoints >= badge.threshold) {
          console.log(`- ${badge.name} (${badge.threshold})`);
        }
      });

      // Simulate the progress calculation
      console.log('Progress calculations:');
      allBadges.forEach(badge => {
        if (badge.conditionType === 'ecoPoints') {
          const progress = Math.min((student.ecoPoints / badge.threshold) * 100, 100);
          const qualifies = student.ecoPoints >= badge.threshold;
          const earned = studentBadges.some(sb => sb.badge._id.toString() === badge._id.toString());
          console.log(`- ${badge.name}: progress=${Math.round(progress)}%, qualifies=${qualifies}, earned=${earned}`);
        }
      });
    }

    await mongoose.disconnect();
  } catch (err) {
    console.error('Error:', err);
  }
}

testBadgeProgress();