const { generateAIResponse, checkOpenAIHealth, FALLBACK_REPLY } = require('../services/openaiService');
const User = require('../models/User');
const Task = require('../models/Task');
const Submission = require('../models/Submission');
const Forest = require('../models/Forest');
const { validationResult } = require('express-validator');

if (!process.env.OPENAI_API_KEY) {
  console.warn('⚠️ WARNING: OPENAI_API_KEY is not set in .env file. OpenAI path will not be available.');
}

/**
 * Chat with AI Guardian
 * POST /api/chat
 * Body: { message: string }
 * Access: All authenticated users (students, teachers, admins)
 */
const chatWithGuardian = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
        reply: 'Invalid input. Please check your message.'
      });
    }

    const { message } = req.body;
    const userId = req.user._id;
    const userRole = req.user.role; // Extra security: backend validates user role

    // Double-check role validation (defense in depth)
    if (!['student', 'teacher', 'admin'].includes(userRole)) {
      return res.status(403).json({
        success: false,
        message: 'Invalid user role for chat access',
        reply: 'Access denied.',
      });
    }

    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Message field is required.',
        reply: 'Please provide a message.',
      });
    }

    // Fetch user data for personalization
    const user = await User.findById(userId).select('name role className ecoPoints');
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found.',
      });
    }

    // Get user's task completion stats
    const submissions = await Submission.find({ student: userId })
      .populate('task')
      .sort({ submittedAt: -1 });

    const completedTasks = submissions.filter(s => s.status === 'approved').length;
    const pendingTasks = submissions.filter(s => s.status === 'pending').length;
    const totalSubmissions = submissions.length;

    // Get user's class forest data
    const forest = await Forest.findOne({ className: user.className });

    // Get recent task types completed
    const taskTypes = submissions
      .filter(s => s.status === 'approved')
      .map(s => s.task.title)
      .slice(0, 5); // Last 5 completed tasks

    // Build personalized context
    const context = `
You are EcoVerse AI Guardian, a helpful and knowledgeable environmental assistant.

USER PROFILE:
- Name: ${user.name}
- Class: ${user.className}
- Current Eco Points: ${user.ecoPoints}
- Role: ${user.role}

ACTIVITY STATS:
- Total Tasks Submitted: ${totalSubmissions}
- Tasks Completed (Approved): ${completedTasks}
- Tasks Pending Review: ${pendingTasks}
- Class Forest Eco Score: ${forest ? forest.ecoScore : 'Not available'}

RECENT COMPLETED TASKS:
${taskTypes.length > 0 ? taskTypes.map(task => `- ${task}`).join('\n') : 'No completed tasks yet'}

INSTRUCTIONS:
- Give personalized environmental advice based on user's current stats
- Suggest specific actions they can take to improve their eco score
- Reference their class performance and forest status
- Be encouraging and educational
- Keep responses helpful and actionable
- If they have low activity, suggest getting started with basic tasks
- If they have good activity, suggest advanced environmental actions

USER QUESTION: ${message}

Please provide a personalized, helpful response:`;

    const reply = await generateAIResponse(context);

    if (!reply) {
      return res.json({
        reply: 'I\'m having trouble connecting right now. Try again in a moment! 🌿'
      });
    }

    return res.json({ reply });
  } catch (error) {
    console.error('💥 OpenAI Chat Error:', error);
    return res.json({
      reply: 'AI Guardian is taking a break. Please try again later! 🌱'
    });
  }
};

// GET /api/chat/health
const chatHealth = async (req, res) => {
  const health = await checkOpenAIHealth();
  if (health.healthy) {
    return res.json({ success: true, ...health });
  }

  return res.status(503).json({ success: false, ...health, fallback: FALLBACK_REPLY });
};

module.exports = { chatWithGuardian, chatHealth };


