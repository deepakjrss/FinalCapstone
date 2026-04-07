const Request = require('../models/Request');
const User = require('../models/User');
const nodemailer = require('nodemailer');

// Initialize Nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// GET /api/requests/pending
const getPendingRequests = async (req, res) => {
  try {
    let requests;

    if (req.user.role === 'teacher') {
      // Teachers see student requests from their school
      requests = await Request.find({
        role: 'student',
        status: 'pending',
        school: req.user.school
      }).populate('user', 'name email').populate('class', 'name').populate('school', 'name');
    } else if (req.user.role === 'admin') {
      // Admins see teacher requests from their school
      requests = await Request.find({
        role: 'teacher',
        status: 'pending',
        school: req.user.school
      }).populate('user', 'name email').populate('school', 'name');
    } else {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json(requests);
  } catch (error) {
    console.error('Get pending requests error:', error);
    res.status(500).json({ message: 'Error fetching pending requests' });
  }
};

// PUT /api/requests/approve/:id
const approveRequest = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the request
    const request = await Request.findById(id).populate('user');
    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    // Check if user has permission to approve this request
    if (req.user.role === 'teacher' && request.role !== 'student') {
      return res.status(403).json({ message: 'Access denied' });
    }
    if (req.user.role === 'admin' && request.role !== 'teacher') {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Check if request is from the same school
    if (request.school.toString() !== req.user.school.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Update request
    request.status = 'approved';
    request.approvedBy = req.user._id;
    await request.save();

    // Update user status
    await User.findByIdAndUpdate(request.user._id, { status: 'approved' });

    // Send approval email
    try {
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: request.user.email,
        subject: 'EcoVerse Account Approved',
        html: `
          <div style="font-family: Arial, sans-serif; padding: 20px;">
            <h2 style="color: #059669;">Welcome to EcoVerse! 🎉</h2>
            <p>Dear ${request.user.name},</p>
            <p>Your account has been approved! You can now login to EcoVerse.</p>
            <p>Please use your email and password to log in.</p>
            <br>
            <p>Best regards,<br>EcoVerse Team</p>
          </div>
        `
      });
    } catch (emailError) {
      console.error('Error sending approval email:', emailError);
      // Don't fail the approval if email fails
    }

    res.json({ message: 'Request approved successfully' });
  } catch (error) {
    console.error('Approve request error:', error);
    res.status(500).json({ message: 'Error approving request' });
  }
};

// PUT /api/requests/reject/:id
const rejectRequest = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the request
    const request = await Request.findById(id);
    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    // Check if user has permission to reject this request
    if (req.user.role === 'teacher' && request.role !== 'student') {
      return res.status(403).json({ message: 'Access denied' });
    }
    if (req.user.role === 'admin' && request.role !== 'teacher') {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Check if request is from the same school
    if (request.school.toString() !== req.user.school.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Update request status
    request.status = 'rejected';
    request.approvedBy = req.user._id;
    await request.save();

    // Optionally delete the user or keep them as rejected
    // For now, we'll keep them as rejected status

    res.json({ message: 'Request rejected' });
  } catch (error) {
    console.error('Reject request error:', error);
    res.status(500).json({ message: 'Error rejecting request' });
  }
};

module.exports = {
  getPendingRequests,
  approveRequest,
  rejectRequest
};