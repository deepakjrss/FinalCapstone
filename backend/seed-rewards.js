const mongoose = require('mongoose');
require('dotenv').config();

// Import models
const RewardItem = require('./models/RewardItem');

// Connect to MongoDB
const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ecoverse';
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✓ MongoDB connected for reward seeding...');
  } catch (error) {
    console.error('✗ MongoDB connection error:', error);
    process.exit(1);
  }
};

// Clear existing reward items
const clearRewardItems = async () => {
  try {
    await RewardItem.deleteMany({});
    console.log('✓ Existing reward items cleared');
  } catch (error) {
    console.error('✗ Error clearing reward items:', error);
    process.exit(1);
  }
};

// Create reward shop items
const createRewardItems = async () => {
  const rewardItems = [
    {
      name: 'Forest Skin - Autumn',
      description: 'Beautiful autumn colors for your forest',
      icon: '🍂',
      cost: 150,
      type: 'skin'
    },
    {
      name: 'Forest Skin - Winter',
      description: 'Snowy winter theme for your forest',
      icon: '❄️',
      cost: 200,
      type: 'skin'
    },
    {
      name: 'Avatar - Eco Warrior',
      description: 'Powerful eco warrior avatar',
      icon: '⚔️',
      cost: 300,
      type: 'avatar'
    },
    {
      name: 'Avatar - Forest Guardian',
      description: 'Mystical forest guardian avatar',
      icon: '🛡️',
      cost: 250,
      type: 'avatar'
    },
    {
      name: 'Badge - Speed Runner',
      description: 'Special badge for completing games quickly',
      icon: '⚡',
      cost: 100,
      type: 'badge'
    },
    {
      name: 'Badge - Perfectionist',
      description: 'Badge for achieving perfect scores',
      icon: '💎',
      cost: 180,
      type: 'badge'
    }
  ];

  const createdItems = [];
  for (const itemData of rewardItems) {
    const item = new RewardItem(itemData);
    await item.save();
    createdItems.push(item);
    console.log(`✓ Created reward item: ${item.name} (${item.cost} points)`);
  }
  return createdItems;
};

// Main seeding function
const seedRewards = async () => {
  try {
    await connectDB();
    await clearRewardItems();
    await createRewardItems();

    console.log('\n🎉 Reward shop seeding completed successfully!');
    console.log('✓ All reward items are now available in the shop');
  } catch (error) {
    console.error('❌ Error seeding rewards:', error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('✓ Database connection closed');
  }
};

// Run seeding
seedRewards();