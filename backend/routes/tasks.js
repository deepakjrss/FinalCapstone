const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const { verifyToken, authorizeRoles } = require('../middleware/auth');
const uploadCloud = require('../middleware/uploadCloud');
const {
  createTask,
  getTasksByClass,
  submitTask,
  getSubmissions,
  reviewSubmission,
  getStudentSubmissionStats,
  getTodaysTasks,
  completeTask
} = require('../controllers/taskController');

/**
 * POST /api/tasks
 * Teacher creates a new task for a class
 * Access: Teacher only
 */
router.post(
  '/',
  verifyToken,
  authorizeRoles('teacher'),
  [
    body('title')
      .trim()
      .notEmpty()
      .withMessage('Task title is required')
      .isLength({ min: 3, max: 100 })
      .withMessage('Title must be between 3 and 100 characters'),
    body('description')
      .trim()
      .notEmpty()
      .withMessage('Task description is required')
      .isLength({ min: 10, max: 1000 })
      .withMessage('Description must be between 10 and 1000 characters'),
    body('className')
      .trim()
      .notEmpty()
      .withMessage('Class name is required'),
    body('points')
      .isInt({ min: 1, max: 100 })
      .withMessage('Points must be between 1 and 100')
  ],
  createTask
);

/**
 * GET /api/tasks/:className
 * Get all active tasks for a specific class
 * Access: Student, Teacher (protected)
 */
router.get(
  '/:className',
  verifyToken,
  authorizeRoles('student', 'teacher'),
  getTasksByClass
);

/**
 * POST /api/tasks/submit
 * Student submits proof for a task (with optional file upload)
 * Access: Student only
 * Body: { taskId, proof } + optional file upload
 */
router.post(
  '/submit',
  verifyToken,
  authorizeRoles('student'),
  uploadCloud.single('proofImage'),
  [
    body('taskId')
      .isMongoId()
      .withMessage('Invalid task ID'),
    body('proof')
      .optional()
      .trim()
      .isLength({ min: 10, max: 500 })
      .withMessage('Proof text must be between 10 and 500 characters')
  ],
  submitTask
);

/**
 * GET /api/tasks/submissions
 * Teacher gets all submissions for their tasks
 * Access: Teacher only
 * Query: status (optional filter)
 */
router.get(
  '/submissions',
  verifyToken,
  authorizeRoles('teacher'),
  getSubmissions
);

/**
 * PUT /api/tasks/review
 * Teacher approves or rejects a submission
 * Access: Teacher only
 * Body: { submissionId, status, reviewComments (optional) }
 */
router.put(
  '/review',
  verifyToken,
  authorizeRoles('teacher'),
  [
    body('submissionId')
      .isMongoId()
      .withMessage('Invalid submission ID'),
    body('status')
      .isIn(['approved', 'rejected'])
      .withMessage('Status must be approved or rejected'),
    body('reviewComments')
      .optional()
      .trim()
      .isLength({ max: 500 })
      .withMessage('Review comments must be less than 500 characters')
  ],
  reviewSubmission
);

/**
 * GET /api/tasks/stats/student/:studentId
 * Get submission stats for a student
 * Access: Teacher only
 */
router.get(
  '/stats/student/:studentId',
  verifyToken,
  authorizeRoles('teacher'),
  getStudentSubmissionStats
);

/**
 * GET /api/tasks/today
 * Get today's tasks for user's school
 * Access: Student only
 */
router.get(
  '/today',
  verifyToken,
  authorizeRoles('student'),
  getTodaysTasks
);

/**
 * POST /api/tasks/complete
 * Mark a task as completed and award eco points
 * Access: Student only
 */
router.post(
  '/complete',
  verifyToken,
  authorizeRoles('student'),
  [
    body('taskId')
      .notEmpty()
      .withMessage('Task ID is required')
  ],
  completeTask
);

module.exports = router;
