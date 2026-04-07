const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Import models
const User = require('./models/User');
const School = require('./models/School');
const Class = require('./models/Class');

// Connect to MongoDB
const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ecoverse';
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✓ MongoDB connected for seeding');
  } catch (error) {
    console.error('✗ MongoDB connection error:', error);
    process.exit(1);
  }
};

// Clear existing data
const clearData = async () => {
  try {
    await User.deleteMany({});
    await School.deleteMany({});
    await Class.deleteMany({});
    console.log('✓ Existing data cleared');
  } catch (error) {
    console.error('✗ Error clearing data:', error);
    process.exit(1);
  }
};

// Create schools
const createSchools = async () => {
  const schools = [
    { name: 'Green Valley School', emailDomain: 'greenvalley.com', inviteCode: 'GV123' },
    { name: 'Eco Future School', emailDomain: 'ecofuture.com', inviteCode: 'EF456' },
    { name: 'Nature High School', emailDomain: 'naturehigh.com', inviteCode: 'NH789' }
  ];

  const createdSchools = [];
  for (const schoolData of schools) {
    const school = new School(schoolData);
    await school.save();
    createdSchools.push(school);
    console.log(`✓ Created school: ${school.name}`);
  }
  return createdSchools;
};

// Hash password
const hashPassword = async (password) => {
  return await bcrypt.hash(password, 10);
};

// Create admins
const createAdmins = async (schools) => {
  const admins = [];
  for (let i = 0; i < schools.length; i++) {
    const school = schools[i];
    const hashedPassword = await hashPassword('123456');
    const admin = new User({
      name: `Admin ${school.name}`,
      email: `admin@${school.emailDomain}`,
      password: hashedPassword,
      role: 'admin',
      school: school._id,
      status: 'approved'
    });
    await admin.save();
    admins.push(admin);
    console.log(`✓ Created admin: ${admin.email}`);
  }
  return admins;
};

// Create teachers
const createTeachers = async (schools) => {
  const teachers = [];
  for (let i = 0; i < schools.length; i++) {
    const school = schools[i];
    for (let j = 1; j <= 2; j++) {
      const hashedPassword = await hashPassword('123456');
      const teacher = new User({
        name: `Teacher ${j} ${school.name}`,
        email: `teacher${j}@${school.emailDomain}`,
        password: hashedPassword,
        role: 'teacher',
        school: school._id,
        status: 'approved'
      });
      await teacher.save();
      teachers.push(teacher);
      console.log(`✓ Created teacher: ${teacher.email}`);
    }
  }
  return teachers;
};

// Create classes
const createClasses = async (schools, teachers) => {
  const classes = [];

  // Green Valley School: 10-A, 10-B
  const greenValley = schools.find(s => s.name === 'Green Valley School');
  if (greenValley) {
    const greenValleyTeachers = teachers.filter(t => t.school.toString() === greenValley._id.toString());
    const classNames = ['10-A', '10-B'];
    for (let j = 0; j < classNames.length; j++) {
      const className = classNames[j];
      const teacher = greenValleyTeachers[j % greenValleyTeachers.length];
      const cls = new Class({
        name: className,
        school: greenValley._id,
        teacher: teacher._id
      });
      await cls.save();
      classes.push(cls);
      console.log(`✓ Created class: ${className} for ${greenValley.name}`);
    }
  }

  // Eco Future School: 9-A
  const ecoFuture = schools.find(s => s.name === 'Eco Future School');
  if (ecoFuture) {
    const ecoFutureTeachers = teachers.filter(t => t.school.toString() === ecoFuture._id.toString());
    const className = '9-A';
    const teacher = ecoFutureTeachers[0];
    const cls = new Class({
      name: className,
      school: ecoFuture._id,
      teacher: teacher._id
    });
    await cls.save();
    classes.push(cls);
    console.log(`✓ Created class: ${className} for ${ecoFuture.name}`);
  }

  // Nature High School: 8-A
  const natureHigh = schools.find(s => s.name === 'Nature High School');
  if (natureHigh) {
    const natureHighTeachers = teachers.filter(t => t.school.toString() === natureHigh._id.toString());
    const className = '8-A';
    const teacher = natureHighTeachers[0];
    const cls = new Class({
      name: className,
      school: natureHigh._id,
      teacher: teacher._id
    });
    await cls.save();
    classes.push(cls);
    console.log(`✓ Created class: ${className} for ${natureHigh.name}`);
  }

  return classes;
};

// Create students
const createStudents = async (schools, classes) => {
  for (let i = 0; i < schools.length; i++) {
    const school = schools[i];
    const schoolClasses = classes.filter(c => c.school.toString() === school._id.toString());

    // Create 5 students per class
    for (let classIndex = 0; classIndex < schoolClasses.length; classIndex++) {
      const studentClass = schoolClasses[classIndex];
      for (let j = 1; j <= 5; j++) {
        const hashedPassword = await hashPassword('123456');
        // Random ecoPoints between 50-300
        const ecoPoints = Math.floor(Math.random() * 251) + 50;

        const student = new User({
          name: `Student ${j} ${studentClass.name} ${school.name}`,
          email: `student${j}${studentClass.name.replace('-', '')}@${school.emailDomain}`,
          password: hashedPassword,
          role: 'student',
          school: school._id,
          class: studentClass._id,
          ecoPoints: ecoPoints,
          status: 'approved'
        });
        await student.save();
        console.log(`✓ Created student: ${student.email} in class ${studentClass.name} with ${ecoPoints} ecoPoints`);
      }
    }
  }
};

// Create super admin
const createSuperAdmin = async () => {
  const hashedPassword = await hashPassword('123456');
  const superAdmin = new User({
    name: 'Super Admin',
    email: 'superadmin@ecoverse.com',
    password: hashedPassword,
    role: 'superadmin',
    isSuperAdmin: true,
    status: 'approved'
  });
  await superAdmin.save();
  console.log(`✓ Created super admin: ${superAdmin.email}`);
};

// Main seed function
const seedData = async () => {
  try {
    await connectDB();
    await clearData();

    const schools = await createSchools();
    const admins = await createAdmins(schools);
    const teachers = await createTeachers(schools);
    const classes = await createClasses(schools, teachers);
    await createStudents(schools, classes);
    await createSuperAdmin();

    console.log('🎉 Seeding completed successfully!');
  } catch (error) {
    console.error('✗ Seeding failed:', error);
  } finally {
    await mongoose.disconnect();
    console.log('✓ Database connection closed');
    process.exit(0);
  }
};

// Run the seed
seedData();