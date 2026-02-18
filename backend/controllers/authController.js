const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');

// Generate JWT Token
const generateToken = (userId) => {
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE || '7d' }
  );
};

// Register User
exports.register = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { name, email, password, role, className } = req.body;

    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email'
      });
    }

    // Validate className for students
    if (role === 'student' && !className) {
      return res.status(400).json({
        success: false,
        message: 'className is required for students'
      });
    }

    // Create new user
    user = new User({
      name,
      email,
      password,
      role,
      ...(role === 'student' && { className })
    });

    await user.save();

    // Generate token
    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token,
      user: user.toJSON()
    });
  } catch (error) {
    console.error('Registration error:', error);
    
    // Check if it's a connection error
    if (error.name === 'MongooseError' || error.message.includes('connect')) {
      return res.status(503).json({
        success: false,
        message: 'Database service temporarily unavailable. Please try again later.'
      });
    }
    
    res.status(500).json({
      success: false,
      message: error.message || 'Error during registration'
    });
  }
};

// Login User
exports.login = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { email, password } = req.body;

    // Find user and include password field
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Check password
    const isPasswordMatch = await user.matchPassword(password);

    if (!isPasswordMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: 'User account is disabled'
      });
    }

    // Generate token
    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      message: 'Logged in successfully',
      token,
      user: user.toJSON()
    });
  } catch (error) {
    console.error('Login error:', error);
    
    // Check if it's a connection error
    if (error.name === 'MongooseError' || error.message.includes('connect')) {
      return res.status(503).json({
        success: false,
        message: 'Database service temporarily unavailable. Please try again later.'
      });
    }
    
    res.status(500).json({
      success: false,
      message: error.message || 'Error during login'
    });
  }
};

// Get current user profile
exports.getCurrentUser = async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      user: req.user.toJSON()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Logout (client-side token removal)
exports.logout = (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Logged out successfully'
  });
};
