const Task = require('../models/Task');
const Submission = require('../models/Submission');
const User = require('../models/User');
const Forest = require('../models/Forest');
const EcoLog = require('../models/EcoLog');
const mongoose = require('mongoose');
const { validationResult } = require('express-validator');
const { createNotification } = require('../services/notificationService');
const { logActivity } = require('../services/activityService');
const { createTaskNotification } = require('./notificationController');
const { checkAndAwardBadges } = require('./badgeController');

/**
 * POST /api/tasks
 * Teacher creates a new task for a class
 * Access: Teacher only
 */
const createTask = async (req, res, next) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { title, description, points, className } = req.body;
    const teacherId = req.user._id;

    // Validation
    if (!title || !description || points === undefined || !className) {
      return res.status(400).json({
        success: false,
        message: 'Please provide title, description, points, and className',
      });
    }

    if (points < 1 || points > 1000) {
      return res.status(400).json({
        success: false,
        message: 'Points must be between 1 and 1000',
      });
    }

    const task = new Task({
      title,
      description,
      points,
      className: className.toUpperCase(),
      createdBy: teacherId,
      school: req.user.school,
    });

    await task.save();

    return res.status(201).json({
      success: true,
      task,
      message: 'Task created successfully',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/tasks/:className
 * Get all active tasks for a specific class
 * Access: Student, Teacher (protected)
 */
const getTasksByClass = async (req, res, next) => {
  try {
    const { className } = req.params;

    if (!className) {
      return res.status(400).json({
        success: false,
        message: 'Class name is required',
      });
    }

    const tasks = await Task.find({
      className: className.toUpperCase(),
      isActive: true,
      school: req.user.school,
    })
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: tasks.length,
      tasks,
      message: 'Tasks retrieved successfully',
    });
  } catch (error) {
    console.error('📋 getTasksByClass - Error:', error);
    next(error);
  }
};

/**
 * POST /api/tasks/submit
 * Student submits proof for a task
 * Access: Student only
 * Body: { taskId, proof }
 */
const submitTask = async (req, res, next) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { taskId, proof } = req.body;
    const studentId = req.user._id;
    const proofImage = req.file?.path; // Cloudinary returns full URL in path

    // Validation - require either text proof or image proof
    if (!taskId || (!proof && !proofImage)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide taskId and either text proof or image proof',
      });
    }

    // Get task to verify it exists
    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found',
      });
    }

    // Check if student already submitted this task (pending or approved)
    const alreadySubmitted = await Submission.hasSubmitted(taskId, studentId);
    if (alreadySubmitted) {
      return res.status(409).json({
        success: false,
        message: 'You have already submitted this task',
      });
    }

    // Create submission with both text and image proof
    const submission = new Submission({
      task: taskId,
      student: studentId,
      proof: proof || '', // Text proof (optional)
      proofImage: proofImage || null, // Image proof (optional)
      status: 'pending',
      submittedAt: new Date(),
      school: req.user.school,
    });

    await submission.save();

    // Log activity
    await logActivity(req.user, "Completed task", task.title);

    // Notify teacher about new submission
    const taskData = await Task.findById(taskId).populate('createdBy', '_id');
    if (taskData && taskData.createdBy) {
      const io = req.app.get('io');
      await createNotification(
        taskData.createdBy._id,
        `${req.user.name} has submitted a task: "${taskData.title}". Please review their submission.`,
        "info",
        io,
        req.user.school
      );
    }

    return res.status(201).json({
      success: true,
      submission: {
        _id: submission._id,
        task: submission.task,
        proof: submission.proof,
        proofImage: submission.proofImage,
        status: submission.status,
        submittedAt: submission.submittedAt,
      },
      message: 'Task submitted successfully. Awaiting teacher review.',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/tasks/submissions
 * Get all submissions for teacher's tasks
 * Access: Teacher only
 * Query: status (optional filter: pending, approved, rejected)
 */
const getSubmissions = async (req, res, next) => {
  try {
    const teacherId = req.user._id;
    const { status } = req.query;

    // Get all tasks created by this teacher
    const teacherTasks = await Task.find({ createdBy: teacherId, school: req.user.school }).select('_id');
    const taskIds = teacherTasks.map((t) => t._id);

    if (taskIds.length === 0) {
      return res.status(200).json({
        success: true,
        count: 0,
        submissions: [],
        message: 'No submissions found',
      });
    }

    // Build query
    let query = { task: { $in: taskIds }, school: req.user.school };
    if (status && ['pending', 'approved', 'rejected'].includes(status)) {
      query.status = status;
    }

    const submissions = await Submission.find(query)
      .populate('task', 'title points className')
      .populate('student', 'name email className')
      .populate('reviewedBy', 'name')
      .sort({ submittedAt: -1 });

    return res.status(200).json({
      success: true,
      count: submissions.length,
      submissions,
      message: 'Submissions retrieved successfully',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/tasks/review
 * Teacher approves or rejects a submission
 * Access: Teacher only
 * Body: { submissionId, status (approved/rejected), reviewComments (optional) }
 */
const reviewSubmission = async (req, res, next) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { submissionId, status, reviewComments } = req.body;
    const teacherId = req.user._id;

    // Validation
    if (!submissionId || !status) {
      return res.status(400).json({
        success: false,
        message: 'Please provide submissionId and status',
      });
    }

    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Status must be either "approved" or "rejected"',
      });
    }

    // Get submission with populated task and student
    const submission = await Submission.findById(submissionId)
      .populate('task')
      .populate('student');
    
    if (!submission) {
      return res.status(404).json({
        success: false,
        message: 'Submission not found',
      });
    }

    // Verify teacher created the task
    if (submission.task.createdBy.toString() !== teacherId.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to review this submission',
      });
    }

    // Update submission
    submission.status = status;
    submission.reviewedBy = teacherId;
    submission.reviewedAt = new Date();
    if (reviewComments) {
      submission.reviewComments = reviewComments;
    }

    await submission.save();

    // Send notification to student
    await createTaskNotification(
      submission.student._id,
      submission.task.title,
      status,
      req.user.school
    );

    // If approved, add eco points and update forest
    if (status === 'approved') {
      const studentId = submission.student._id;
      const studentClassName = submission.student.className;
      const pointsToAdd = submission.task.points;

      // Add points to student
      const student = await User.findByIdAndUpdate(
        studentId,
        { $inc: { ecoPoints: pointsToAdd } },
        { new: true }
      );

      // Check and award badges after ecoPoints update
      const newlyEarnedBadges = await checkAndAwardBadges(studentId);

      await EcoLog.create({
        user: studentId,
        school: req.user.school,
        className: submission.student.className || null,
        points: pointsToAdd,
        type: 'task',
        description: `Task approved: ${submission.task.title}`,
        date: new Date()
      });

      // Notify student about eco points update
      const io = req.app.get('io');
      await createNotification(
        studentId,
        `Your eco score has been updated! +${pointsToAdd} points for "${submission.task.title}". 🌱`,
        "success",
        io,
        req.user.school
      );

      // Update forest eco score
      if (studentClassName) {
        const forest = await Forest.findOneAndUpdate(
          { className: studentClassName.toUpperCase() },
          { $inc: { ecoScore: pointsToAdd } },
          { new: true }
        );

        if (!forest) {
          // Create forest if it doesn't exist
          await Forest.create({
            className: studentClassName.toUpperCase(),
            ecoScore: pointsToAdd,
            forestState: 'polluted',
          });
        }
      }

      // Invalidate analytics caches since data has changed
      cacheUtils.invalidateAnalytics();
      cacheUtils.invalidateClass(studentClassName);

      // Emit real-time analytics update to admin users
      io.emit('analytics-update', {
        type: 'task_approved',
        studentId: studentId,
        className: studentClassName,
        pointsEarned: pointsToAdd,
        timestamp: new Date()
      });

      return res.status(200).json({
        success: true,
        submission,
        studentUpdate: {
          newEcoPoints: student.ecoPoints,
          pointsAdded: pointsToAdd,
        },
        message: `Submission approved. ${pointsToAdd} eco points added to ${submission.student.name}`,
      });
    }

    return res.status(200).json({
      success: true,
      submission,
      message: 'Submission rejected',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/tasks/stats/student/:studentId
 * Get submission stats for a specific student
 * Access: Teacher only
 */
const getStudentSubmissionStats = async (req, res, next) => {
  try {
    const { studentId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(studentId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid student ID',
      });
    }

    const stats = await Submission.aggregate([
      { $match: { student: mongoose.Types.ObjectId(studentId) } },
      {
        $group: {
          _id: null,
          totalSubmissions: { $sum: 1 },
          approvedCount: {
            $sum: { $cond: [{ $eq: ['$status', 'approved'] }, 1, 0] },
          },
          rejectedCount: {
            $sum: { $cond: [{ $eq: ['$status', 'rejected'] }, 1, 0] },
          },
          pendingCount: {
            $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] },
          },
        },
      },
    ]);

    const response = stats.length
      ? stats[0]
      : {
          totalSubmissions: 0,
          approvedCount: 0,
          rejectedCount: 0,
          pendingCount: 0,
        };

    return res.status(200).json({
      success: true,
      stats: response,
      message: 'Student submission stats retrieved successfully',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/tasks/today
 * Get today's tasks for user's school
 * Access: Student only
 */
const getTodaysTasks = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const school = req.user.school;

    // Get today's date at midnight
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Get all active tasks for the user's school
    const tasks = await Task.find({
      school: school,
      isActive: true
    })
      .populate('createdBy', 'name')
      .sort({ createdAt: -1 });

    // Get user's task completions for today
    const UserTask = require('../models/UserTask');
    const userTasks = await UserTask.find({
      user: userId,
      date: { $gte: today, $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000) }
    }).select('task completed completedAt');

    // Map completed task IDs
    const completedTaskIds = new Set(
      userTasks.filter(ut => ut.completed).map(ut => ut.task.toString())
    );

    // Enrich tasks with completion status
    const enrichedTasks = tasks.map(task => ({
      _id: task._id,
      title: task.title,
      description: task.description,
      points: task.points,
      createdBy: task.createdBy,
      completed: completedTaskIds.has(task._id.toString())
    }));

    return res.status(200).json({
      success: true,
      tasks: enrichedTasks,
      count: enrichedTasks.length,
      message: 'Today\'s tasks retrieved successfully'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/tasks/complete
 * Mark a task as completed and award eco points
 * Access: Student only
 * Body: { taskId }
 */
const completeTask = async (req, res, next) => {
  try {
    const { taskId } = req.body;
    const userId = req.user._id;
    const school = req.user.school;

    if (!taskId) {
      return res.status(400).json({
        success: false,
        message: 'Task ID is required'
      });
    }

    // Get task
    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    // Get today's date at midnight
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const UserTask = require('../models/UserTask');

    // Check if task already completed today
    let userTask = await UserTask.findOne({
      user: userId,
      task: taskId,
      date: today
    });

    if (!userTask) {
      // Create new user task record
      userTask = new UserTask({
        user: userId,
        task: taskId,
        completed: true,
        completedAt: new Date(),
        date: today
      });
    } else if (userTask.completed) {
      return res.status(400).json({
        success: false,
        message: 'You have already completed this task today'
      });
    } else {
      // Mark as completed
      userTask.completed = true;
      userTask.completedAt = new Date();
    }

    await userTask.save();

    // Add eco points to user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Update user ecoPoints
    user.ecoPoints += task.points;

    await EcoLog.create({
      user: user._id,
      school: user.school,
      className: user.className || null,
      points: task.points,
      type: 'task',
      description: `Task completed: ${task.title}`,
      date: new Date()
    });

    // Update streak
    const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);
    const completedYesterday = await UserTask.findOne({
      user: userId,
      completed: true,
      date: yesterday
    });

    if (completedYesterday || !user.lastTaskCompletedDate) {
      // Continue or start streak
      user.streak = (user.streak || 0) + 1;
    } else {
      // Reset streak
      user.streak = 1;
    }

    user.lastTaskCompletedDate = today;
    await user.save();

    // Check and award badges after ecoPoints update
    const newlyEarnedBadges = await checkAndAwardBadges(user._id);

    // Update forest eco score
    if (user.class) {
      const Class = require('../models/Class');
      const classDoc = await Class.findById(user.class);
      if (classDoc) {
        const Forest = require('../models/Forest');
        await Forest.findOneAndUpdate(
          { className: classDoc.name.toUpperCase() },
          { $inc: { ecoScore: task.points } },
          { new: true, upsert: true }
        );
      }
    }

    return res.status(200).json({
      success: true,
      message: 'Task completed successfully',
      user: {
        ecoPoints: user.ecoPoints,
        streak: user.streak
      },
      pointsEarned: task.points,
      newStreak: user.streak
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createTask,
  getTasksByClass,
  submitTask,
  getSubmissions,
  reviewSubmission,
  getStudentSubmissionStats,
  getTodaysTasks,
  completeTask
};
