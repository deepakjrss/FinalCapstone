const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const Badge = require('./models/Badge');
const connectDB = require('./config/db');

const seedBadges = async () => {
  try {
    await connectDB();
    console.log('📚 Connected to MongoDB for badge seeding...');

    // Clear existing badges to force update
    await Badge.deleteMany({});
    console.log('🗑️ Cleared existing badges for fresh seeding...');

    const badges = [
      {
        name: 'Beginner Saver',
        description: 'Earned 50 eco-points! You\'re taking your first steps towards a greener future.',
        icon: '🌱',
        conditionType: 'ecoPoints',
        threshold: 50
      },
      {
        name: 'Eco Warrior',
        description: 'Reached 200 eco-points! You\'re fighting for the environment like a true warrior.',
        icon: '🌿',
        conditionType: 'ecoPoints',
        threshold: 200
      },
      {
        name: 'Tree Guardian',
        description: 'Accumulated 500 eco-points! You\'re protecting our planet\'s precious trees.',
        icon: '🌳',
        conditionType: 'ecoPoints',
        threshold: 500
      },
      {
        name: 'Earth Hero',
        description: 'Achieved 1000 eco-points! You\'re a legendary hero saving our planet.',
        icon: '🏆',
        conditionType: 'ecoPoints',
        threshold: 1000
      },
      {
        name: 'Streak Master',
        description: 'Maintained a 7-day streak! Consistency is key to environmental change.',
        icon: '🔥',
        conditionType: 'streak',
        threshold: 7
      }
    ];

    const createdBadges = await Badge.insertMany(badges);
    console.log(`\n✨ Successfully seeded ${createdBadges.length} badges:`);
    createdBadges.forEach(badge => {
      console.log(`  ${badge.icon} ${badge.name} - ${badge.conditionType} ≥ ${badge.threshold}`);
    });

    console.log('\n✅ Badge seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding badges:', error);
    process.exit(1);
  }
};

seedBadges();
