const Feedback = require('../models/Feedback');
const User = require('../models/User');
const { validationResult } = require('express-validator');
const { createNotification } = require('../services/notificationService');
const { logActivity } = require('../services/activityService');

// POST /api/feedback
// Submit feedback (students only)
const submitFeedback = async (req, res, next) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { teacherId, rating, comment } = req.body;
    const studentId = req.user.id;

    // Validate rating
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5' });
    }

    // Check if teacher exists and is a teacher
    const teacher = await User.findById(teacherId).select('role _id');
    if (!teacher || teacher.role !== 'teacher') {
      return res.status(404).json({ message: 'Teacher not found' });
    }

    // Check if student exists and is a student
    const student = await User.findById(studentId).select('role _id');
    if (!student || student.role !== 'student') {
      return res.status(403).json({ message: 'Only students can submit feedback' });
    }

    // Create feedback
    const feedback = new Feedback({
      student: studentId,
      teacher: teacherId,
      rating,
      comment,
      school: req.user.school
    });

    await feedback.save();

    // Log activity
    await logActivity(req.user, "Submitted feedback", teacher.name);

    // Notify teacher about new feedback
    const io = req.app.get('io');
    await createNotification(
      teacherId,
      "New feedback received ⭐",
      "success",
      io,
      req.user.school
    );

    return res.status(201).json({ message: 'Feedback submitted successfully' });
  } catch (error) {
    next(error);
  }
};

// GET /api/feedback/teacher
// Get feedback for current teacher
const getTeacherFeedback = async (req, res, next) => {
  try {
    const teacherId = req.user.id;

    const feedback = await Feedback.find({ teacher: teacherId, school: req.user.school })
      .populate('student', 'name')
      .sort({ createdAt: -1 });

    return res.status(200).json(feedback);
  } catch (error) {
    next(error);
  }
};

// GET /api/feedback/admin
// Get all feedback (admin only)
const getAllFeedback = async (req, res, next) => {
  try {
    const feedback = await Feedback.find({ school: req.user.school })
      .populate('student', 'name')
      .populate('teacher', 'name')
      .sort({ createdAt: -1 });

    // Group by teacher and calculate averages
    const teacherStats = {};
    feedback.forEach(fb => {
      const teacherId = fb.teacher._id.toString();
      if (!teacherStats[teacherId]) {
        teacherStats[teacherId] = {
          teacherName: fb.teacher.name,
          feedback: [],
          totalRating: 0,
          count: 0
        };
      }
      teacherStats[teacherId].feedback.push(fb);
      teacherStats[teacherId].totalRating += fb.rating;
      teacherStats[teacherId].count += 1;
    });

    // Calculate averages and sort by average rating descending
    const statsArray = Object.values(teacherStats).map(stat => ({
      ...stat,
      averageRating: stat.count > 0 ? (stat.totalRating / stat.count).toFixed(1) : 0
    })).sort((a, b) => parseFloat(b.averageRating) - parseFloat(a.averageRating));

    return res.status(200).json(feedback);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  submitFeedback,
  getTeacherFeedback,
  getAllFeedback
};