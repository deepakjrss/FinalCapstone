const School = require('../models/School');
const User = require('../models/User');

// GET /api/superadmin/schools - Get all schools with stats
const getAllSchools = async (req, res) => {
  try {
    const schools = await School.find();

    // Add user counts for each school
    const schoolsWithStats = await Promise.all(
      schools.map(async (school) => {
        const totalUsers = await User.countDocuments({
          school: school._id,
          isDeleted: false
        });
        const totalTeachers = await User.countDocuments({
          school: school._id,
          role: 'teacher',
          isDeleted: false
        });
        const totalStudents = await User.countDocuments({
          school: school._id,
          role: 'student',
          isDeleted: false
        });

        return {
          _id: school._id,
          name: school.name,
          emailDomain: school.emailDomain,
          inviteCode: school.inviteCode,
          totalUsers,
          totalTeachers,
          totalStudents,
          createdAt: school.createdAt
        };
      })
    );

    res.json(schoolsWithStats);
  } catch (error) {
    console.error('Get all schools error:', error);
    res.status(500).json({ message: 'Error fetching schools' });
  }
};

// POST /api/superadmin/schools - Create new school
const createSchool = async (req, res) => {
  try {
    const { name, emailDomain } = req.body;

    if (!name || !emailDomain) {
      return res.status(400).json({
        success: false,
        message: 'School name and email domain are required'
      });
    }

    // Check if school name already exists
    const existingSchool = await School.findOne({
      name: { $regex: new RegExp(`^${name}$`, 'i') }
    });

    if (existingSchool) {
      return res.status(400).json({
        success: false,
        message: 'School with this name already exists'
      });
    }

    // Generate unique invite code
    const generateCode = () => {
      return Math.random().toString(36).substring(2, 8).toUpperCase();
    };

    let inviteCode;
    let codeExists = true;
    let attempts = 0;

    // Ensure unique invite code
    while (codeExists && attempts < 10) {
      inviteCode = generateCode();
      const existingCode = await School.findOne({ inviteCode });
      codeExists = !!existingCode;
      attempts++;
    }

    if (codeExists) {
      return res.status(500).json({
        success: false,
        message: 'Could not generate unique invite code'
      });
    }

    const school = new School({
      name: name.trim(),
      emailDomain: emailDomain.toLowerCase().trim(),
      inviteCode
    });

    await school.save();

    res.status(201).json({
      success: true,
      message: 'School created successfully',
      school: {
        _id: school._id,
        name: school.name,
        emailDomain: school.emailDomain,
        inviteCode: school.inviteCode,
        createdAt: school.createdAt
      }
    });
  } catch (error) {
    console.error('Create school error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error creating school'
    });
  }
};

// GET /api/superadmin/users - Get all users globally
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ isDeleted: false })
      .populate('school', 'name')
      .populate('class', 'name')
      .select('name email role status school class ecoPoints createdAt')
      .sort({ createdAt: -1 });

    res.json(users);
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({ message: 'Error fetching users' });
  }
};

// GET /api/superadmin/analytics - Global system analytics
const getGlobalAnalytics = async (req, res) => {
  try {
    const totalSchools = await School.countDocuments();
    const totalUsers = await User.countDocuments({ isDeleted: false });
    const totalStudents = await User.countDocuments({
      role: 'student',
      isDeleted: false
    });
    const totalTeachers = await User.countDocuments({
      role: 'teacher',
      isDeleted: false
    });
    const totalAdmins = await User.countDocuments({
      role: 'admin',
      isDeleted: false
    });
    const pendingUsers = await User.countDocuments({
      status: 'pending',
      isDeleted: false
    });

    res.json({
      totalSchools,
      totalUsers,
      totalStudents,
      totalTeachers,
      totalAdmins,
      pendingUsers
    });
  } catch (error) {
    console.error('Get global analytics error:', error);
    res.status(500).json({ message: 'Error fetching analytics' });
  }
};

module.exports = {
  getAllSchools,
  createSchool,
  getAllUsers,
  getGlobalAnalytics
};