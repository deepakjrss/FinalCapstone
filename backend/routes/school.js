const express = require('express');
const { verifyToken } = require('../middleware/auth');
const School = require('../models/School');

const router = express.Router();

// Generate invite code function
const generateCode = () => {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
};

// Create school
router.post("/create", verifyToken, async (req, res) => {
  try {
    const code = generateCode();

    const school = await School.create({
      name: req.body.name,
      emailDomain: req.body.emailDomain,
      inviteCode: code,
      createdBy: req.user._id
    });

    res.json(school);
  } catch (err) {
    res.status(500).json({ message: "Error creating school" });
  }
});

// Get current user's school
router.get("/my", verifyToken, async (req, res) => {
  try {
    const school = await School.findById(req.user.school);
    if (!school) {
      return res.status(404).json({ message: "School not found" });
    }
    res.json(school);
  } catch (err) {
    res.status(500).json({ message: "Error fetching school" });
  }
});

// Get all schools (Super Admin only)
router.get("/schools", verifyToken, async (req, res) => {
  try {
    if (!req.user.isSuperAdmin) {
      return res.status(403).json({ message: "Access denied" });
    }

    const schools = await School.find();

    // Add user counts for each school
    const schoolsWithCounts = await Promise.all(
      schools.map(async (school) => {
        const userCount = await require('../models/User').countDocuments({ school: school._id, isDeleted: false });
        return {
          _id: school._id,
          name: school.name,
          inviteCode: school.inviteCode,
          emailDomain: school.emailDomain,
          totalUsers: userCount,
          createdAt: school.createdAt
        };
      })
    );

    res.json(schoolsWithCounts);
  } catch (err) {
    res.status(500).json({ message: "Error fetching schools" });
  }
});

// Get all schools (public for registration dropdown)
router.get("/all", async (req, res) => {
  try {
    const schools = await School.find({}, '_id name inviteCode');
    res.json(schools);
  } catch (err) {
    res.status(500).json({ message: "Error fetching schools" });
  }
});

// Get classes for a school (public for registration)
router.get("/classes/:schoolId", async (req, res) => {
  try {
    const { schoolId } = req.params;
    const classes = await require('../models/Class').find({ school: schoolId })
      .populate('teacher', 'name')
      .select('name teacher');
    res.json(classes);
  } catch (err) {
    res.status(500).json({ message: "Error fetching classes" });
  }
});

module.exports = router;