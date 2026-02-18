const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const Badge = require('./models/Badge');
const connectDB = require('./config/db');

const seedBadges = async () => {
  try {
    await connectDB();
    console.log('📚 Connected to MongoDB for badge seeding...');

    // Check if badges already exist
    const existingBadges = await Badge.countDocuments();
    if (existingBadges > 0) {
      console.log('✅ Badges already exist in database. Skipping seed.');
      process.exit(0);
    }

    const badges = [
      {
        name: 'Eco Starter',
        description: 'Earned your first 100 eco-points! Great start on your eco-journey.',
        icon: '🌱',
        conditionType: 'ecoPoints',
        threshold: 100
      },
      {
        name: 'Tree Protector',
        description: 'Accumulated 300 eco-points! You\'re making a real difference.',
        icon: '🌳',
        conditionType: 'ecoPoints',
        threshold: 300
      },
      {
        name: 'Climate Champion',
        description: 'Reached 600 eco-points! You\'re a true environmental champion.',
        icon: '🌍',
        conditionType: 'ecoPoints',
        threshold: 600
      },
      {
        name: 'Quiz Master',
        description: 'Completed 5 games! You\'re a knowledge superstar.',
        icon: '🏆',
        conditionType: 'gamesPlayed',
        threshold: 5
      },
      {
        name: 'Forest Guardian',
        description: 'Earned 1000 eco-points! You\'re preserving the planet.',
        icon: '🌲',
        conditionType: 'ecoPoints',
        threshold: 1000
      },
      {
        name: 'Game Legend',
        description: 'Completed 10 games! You\'re unstoppable.',
        icon: '⭐',
        conditionType: 'gamesPlayed',
        threshold: 10
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
