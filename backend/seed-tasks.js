const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Task = require('./models/Task');
const User = require('./models/User');
const connectDB = require('./config/db');

dotenv.config();

const sampleTasks = [
  {
    title: 'Plant a Tree in Your Neighborhood',
    description: 'Find a suitable location in your neighborhood and plant a tree. Take a photo of the planted tree as proof.',
    points: 50,
    className: '10-A',
    isActive: true
  },
  {
    title: 'Reduce Plastic Usage for a Week',
    description: 'Avoid using single-use plastics for 7 days. Keep a journal of your daily activities and submit it.',
    points: 30,
    className: '10-A',
    isActive: true
  },
  {
    title: 'Create a Recycling Poster',
    description: 'Design and create a poster about the importance of recycling. Display it in your classroom.',
    points: 40,
    className: '10-A',
    isActive: true
  }
];

const seedTasks = async () => {
  try {
    console.log('🌱 Connecting to MongoDB...');
    await connectDB();
    console.log('✅ Connected to MongoDB');

    // Find a teacher to assign as createdBy
    const teacher = await User.findOne({ role: 'teacher' });
    if (!teacher) {
      console.log('❌ No teacher found. Please create a teacher user first.');
      process.exit(1);
    }
    console.log(`👨‍🏫 Using teacher: ${teacher.name} (${teacher._id})`);

    console.log('🧹 Clearing existing tasks...');
    await Task.deleteMany({});
    console.log('✅ Cleared existing tasks');

    // Add createdBy to sample tasks
    const tasksWithTeacher = sampleTasks.map(task => ({
      ...task,
      createdBy: teacher._id
    }));

    console.log('📝 Seeding tasks...');
    const tasks = await Task.insertMany(tasksWithTeacher);
    console.log('✅ Successfully seeded tasks');

    console.log('\n📋 Seeded Tasks:');
    tasks.forEach((task, index) => {
      console.log(`${index + 1}. ${task.title} (${task.className}) - ${task.points} points`);
    });

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding tasks:', error);
    process.exit(1);
  }
};

seedTasks();