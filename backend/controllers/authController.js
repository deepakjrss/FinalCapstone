const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const nodemailer = require('nodemailer');
const School = require('../models/School');
const Request = require('../models/Request');
const Class = require('../models/Class');
const Notification = require('../models/Notification');
const { createNotification } = require('../services/notificationService');

// Temporary storage for registration OTPs (in production, use Redis or DB)
const registrationOTPs = new Map();

// Initialize Nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Generate JWT Token
const generateToken = (userId) => {
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE || '7d' }
  );
};

// Generate 6-digit OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Send OTP for first login (after approval)
exports.sendOTP = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required'
      });
    }

    // Check if user exists and is approved
    const user = await User.findOne({ email, isDeleted: false });
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    if (user.status !== 'approved') {
      return res.status(403).json({
        success: false,
        message: 'Account not approved yet'
      });
    }

    // Generate OTP
    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    console.log("OTP generated:", otp); // DEBUG: Add console log

    user.otp = otp;
    user.otpExpiry = otpExpiry;
    await user.save();

    // Send OTP via email
    try {
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Your OTP Code',
        html: `
          <div style="font-family: Arial, sans-serif; padding: 20px;">
            <h2 style="color: #059669;">EcoVerse OTP Verification</h2>
            <p>Your OTP is: <strong>${otp}</strong></p>
            <p style="color: #666;">This OTP will expire in 5 minutes.</p>
            <p style="color: #999; font-size: 12px;">If you didn't request this, please ignore this email.</p>
          </div>
        `
      });
    } catch (emailError) {
      console.error("FULL EMAIL ERROR:", emailError);
      return res.status(500).json({
        success: false,
        message: 'Failed to send OTP email. Please check email configuration.'
      });
    }

    res.status(200).json({
      success: true,
      message: 'OTP sent successfully'
    });
  } catch (error) {
    console.error('Send OTP error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error sending OTP'
    });
  }
};

// Send OTP for registration
exports.sendRegisterOTP = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required'
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email, isDeleted: false });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Email already registered'
      });
    }

    // Generate OTP
    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    // Store in temporary storage
    registrationOTPs.set(email, { otp, expiry: otpExpiry });

    console.log("Registration OTP generated:", otp); // DEBUG

    // Send OTP via email
    try {
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'EcoVerse Registration OTP',
        html: `
          <div style="font-family: Arial, sans-serif; padding: 20px;">
            <h2 style="color: #059669;">EcoVerse Registration Verification</h2>
            <p>Your OTP is: <strong>${otp}</strong></p>
            <p style="color: #666;">This OTP will expire in 5 minutes.</p>
            <p style="color: #999; font-size: 12px;">If you didn't request this, please ignore this email.</p>
          </div>
        `
      });
    } catch (emailError) {
      console.error("FULL EMAIL ERROR:", emailError);
      return res.status(500).json({
        success: false,
        message: 'Failed to send OTP email. Please check email configuration.'
      });
    }

    res.status(200).json({
      success: true,
      message: 'OTP sent successfully'
    });
  } catch (error) {
    console.error('Send register OTP error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error sending OTP'
    });
  }
};

// Verify OTP for registration
exports.verifyRegisterOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: 'Email and OTP are required'
      });
    }

    const storedData = registrationOTPs.get(email);

    if (!storedData) {
      return res.status(400).json({
        success: false,
        message: 'OTP not found. Please request a new OTP.'
      });
    }

    // Check if OTP matches
    if (storedData.otp !== otp) {
      return res.status(400).json({
        success: false,
        message: 'Invalid OTP'
      });
    }

    // Check if OTP has expired
    if (new Date() > storedData.expiry) {
      registrationOTPs.delete(email);
      return res.status(400).json({
        success: false,
        message: 'OTP has expired. Please request a new one.'
      });
    }

    // Mark email as verified (keep in storage for registration)
    storedData.verified = true;

    res.status(200).json({
      success: true,
      message: 'Email verified successfully'
    });
  } catch (error) {
    console.error('Verify register OTP error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error verifying OTP'
    });
  }
};

// Verify OTP for first login
exports.verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;
    console.log(`Verifying OTP for: ${email}, OTP: ${otp}`);

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: 'Email and OTP are required'
      });
    }

    const user = await User.findOne({ email, isDeleted: false });

    if (!user) {
      console.log(`User not found: ${email}`);
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    if (user.status !== 'approved') {
      console.log(`User not approved: ${email}, status: ${user.status}`);
      return res.status(403).json({
        success: false,
        message: 'Account not approved yet'
      });
    }

    console.log(`Stored OTP: ${user.otp}, Expiry: ${user.otpExpiry}`);

    // Check if OTP matches
    if (user.otp !== otp) {
      console.log(`Invalid OTP: entered ${otp}, stored ${user.otp}`);
      return res.status(400).json({
        success: false,
        message: 'Invalid OTP'
      });
    }

    // Check if OTP has expired
    if (new Date() > user.otpExpiry) {
      console.log(`OTP expired for: ${email}`);
      return res.status(400).json({
        success: false,
        message: 'OTP has expired. Please request a new one.'
      });
    }

    // Mark first login as complete
    user.isFirstLogin = false;
    user.otp = null;
    user.otpExpiry = null;
    await user.save();

    // Generate JWT token
    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        className: user.className,
        ecoPoints: user.ecoPoints
      }
    });
  } catch (error) {
    console.error('Verify OTP error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error verifying OTP'
    });
  }
};

// Resend OTP for login
exports.resendOTP = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required'
      });
    }

    // Check if user exists and is approved
    const user = await User.findOne({ email, isDeleted: false });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    if (user.status !== 'approved') {
      return res.status(403).json({
        success: false,
        message: 'Account not approved yet'
      });
    }

    // Generate new OTP
    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    console.log("Resend OTP generated:", otp); // DEBUG

    user.otp = otp;
    user.otpExpiry = otpExpiry;
    await user.save();

    // Send OTP via email
    try {
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'EcoVerse Login OTP (Resent)',
        html: `
          <div style="font-family: Arial, sans-serif; padding: 20px;">
            <h2 style="color: #059669;">EcoVerse Login Verification</h2>
            <p>Your new OTP is: <strong>${otp}</strong></p>
            <p style="color: #666;">This OTP will expire in 5 minutes.</p>
            <p style="color: #999; font-size: 12px;">If you didn't request this, please ignore this email.</p>
          </div>
        `
      });
    } catch (emailError) {
      console.error("FULL EMAIL ERROR:", emailError);
      return res.status(500).json({
        success: false,
        message: 'Failed to send OTP email. Please check email configuration.'
      });
    }

    res.status(200).json({
      success: true,
      message: 'OTP resent successfully'
    });
  } catch (error) {
    console.error('Resend OTP error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error resending OTP'
    });
  }
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

    const { name, email, password, role, schoolId, inviteCode, classId } = req.body;

    // Check if email is verified via OTP
    const otpData = registrationOTPs.get(email);
    if (!otpData || !otpData.verified) {
      return res.status(400).json({
        success: false,
        message: 'Email not verified. Please verify your email first.'
      });
    }

    // Find school by ID
    const school = await School.findById(schoolId);
    if (!school) {
      return res.status(400).json({
        success: false,
        message: 'Invalid school selected'
      });
    }

    // Validate invite code
    if (school.inviteCode !== inviteCode.toUpperCase()) {
      return res.status(400).json({
        success: false,
        message: 'Invalid invite code'
      });
    }

    // Check email domain for teachers
    if (role === 'teacher') {
      const domain = email.split('@')[1];
      if (domain !== school.emailDomain) {
        return res.status(400).json({
          success: false,
          message: 'Please use your school email (e.g. teacher@' + school.emailDomain + ')'
        });
      }
    }

    // Validate class for students
    let assignedClass = null;
    if (role === 'student') {
      if (!classId) {
        return res.status(400).json({
          success: false,
          message: 'Class is required for students'
        });
      }
      assignedClass = await Class.findById(classId);
      if (!assignedClass || assignedClass.school.toString() !== schoolId) {
        return res.status(400).json({
          success: false,
          message: 'Invalid class selected'
        });
      }
    }

    // Create user
    const user = new User({
      name,
      email,
      password,
      role,
      status: 'pending',
      school: schoolId,
      class: role === 'student' ? classId : undefined
    });

    await user.save();

    // Create approval request
    let assignedTo;
    if (role === 'student') {
      assignedTo = assignedClass.teacher;
    } else if (role === 'teacher') {
      // Assign to first admin of the school
      const admin = await User.findOne({ role: 'admin', school: schoolId, status: 'approved', isDeleted: false });
      if (!admin) {
        return res.status(400).json({
          success: false,
          message: 'No admin found for this school'
        });
      }
      assignedTo = admin._id;
    }

    const request = new Request({
      user: user._id,
      role: role,
      school: schoolId,
      class: role === 'student' ? classId : undefined,
      assignedTo: assignedTo,
      status: 'pending'
    });
    await request.save();

    // Send notification to assigned person
    try {
      const io = req.app.get('io');
      await createNotification(
        assignedTo,
        `New ${role} "${name}" registered and is waiting for approval`,
        "info",
        io,
        schoolId
      );
    } catch (notificationError) {
      console.error('Error sending notification:', notificationError);
    }

    // Clean up OTP data
    registrationOTPs.delete(email);

    // Do not generate token for pending users
    res.status(201).json({
      success: true,
      message: 'Request sent for approval ⏳'
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

// Login User - Combined approval + OTP flow
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email, isDeleted: false }).select('+password').populate('school');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Validate password
    const isPasswordMatch = await user.matchPassword(password);
    if (!isPasswordMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check if approved
    if (user.status !== 'approved') {
      // Check if request already exists
      const existingRequest = await Request.findOne({
        userId: user._id,
        status: 'pending'
      });

      if (!existingRequest) {
        // Create new request
        await Request.create({
          userId: user._id,
          role: user.role,
          school: user.school
        });

        // Find teachers/admins to notify
        let recipients = [];
        if (user.role === 'student') {
          // Notify teachers in the same school
          recipients = await User.find({
            role: 'teacher',
            school: user.school,
            isDeleted: false
          });
        } else if (user.role === 'teacher') {
          // Notify admins in the same school
          recipients = await User.find({
            role: 'admin',
            school: user.school,
            isDeleted: false
          });
        }

        // Create notifications
        const io = req.app.get('io');
        for (const recipient of recipients) {
          await createNotification(
            recipient._id,
            `New approval request from ${user.name} (${user.role})`,
            'info',
            io,
            user.school
          );
        }
      }

      return res.status(403).json({
        success: false,
        message: 'Request sent for approval ⏳',
        requiresApproval: true
      });
    }

    // User is approved, login normally
    const token = generateToken(user._id);
    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        school: user.school,
        className: user.className,
        ecoPoints: user.ecoPoints
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Login failed'
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

// Verify Password and Send Login OTP
exports.verifyPasswordAndSendOTP = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    // Find user and include password field
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Check if email is verified
    if (!user.isVerified) {
      return res.status(403).json({
        success: false,
        message: 'Email not verified. Please verify your email first.'
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

    // Generate OTP
    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    user.otp = otp;
    user.otpExpiry = otpExpiry;
    await user.save();

    // Send OTP via email
    try {
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'EcoVerse Login OTP',
        html: `
          <div style="font-family: Arial, sans-serif; padding: 20px;">
            <h2 style="color: #059669;">EcoVerse Login Verification</h2>
            <p>Someone is trying to log into your EcoVerse account.</p>
            <p>Your OTP for login is:</p>
            <h1 style="color: #059669; letter-spacing: 5px;">${otp}</h1>
            <p style="color: #666;">This OTP will expire in 5 minutes.</p>
            <p style="color: #999; font-size: 12px;">If you didn't try to login, please ignore this email and change your password.</p>
          </div>
        `
      });
    } catch (emailError) {
      console.error("FULL EMAIL ERROR:", emailError);
      return res.status(500).json({
        success: false,
        message: 'Failed to send OTP email. Please check email configuration.'
      });
    }

    res.status(200).json({
      success: true,
      message: 'OTP sent to your email. Valid for 5 minutes.'
    });
  } catch (error) {
    console.error('Verify password and send OTP error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error during authentication'
    });
  }
};

// Verify Login OTP and Return JWT
exports.verifyLoginOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: 'Email and OTP are required'
      });
    }

    const user = await User.findOne({ email, isDeleted: false });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check if OTP matches
    if (user.otp !== otp) {
      return res.status(400).json({
        success: false,
        message: 'Invalid OTP'
      });
    }

    // Check if OTP has expired
    if (new Date() > user.otpExpiry) {
      user.otp = null;
      user.otpExpiry = null;
      await user.save();
      
      return res.status(400).json({
        success: false,
        message: 'OTP has expired. Please login again.'
      });
    }

    // Clear OTP
    user.otp = null;
    user.otpExpiry = null;

    // Check if teacher is approved
    if (user.role === 'teacher' && user.status === 'pending') {
      await user.save();
      return res.status(403).json({
        success: false,
        message: 'Your account is waiting for admin approval ⏳'
      });
    }

    await user.save();

    // Generate JWT token
    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      message: 'Logged in successfully',
      token,
      user: user.toJSON()
    });
  } catch (error) {
    console.error('Verify login OTP error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error verifying OTP'
    });
  }
};
