const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { verifyToken, authorizeRoles } = require('./middleware/auth');
const { getStudentsByClass } = require('./controllers/analyticsController');
const connectDB = require('./config/db');
const nodemailer = require('nodemailer');
const http = require('http');
const socketIo = require('socket.io');

// Load environment variables
dotenv.config();

// Debug: Check if API key is loaded
console.log("🔑 OPENAI_API_KEY loaded:", process.env.OPENAI_API_KEY ? "YES" : "NO");
console.log("🔑 API Key starts with:", process.env.OPENAI_API_KEY ? process.env.OPENAI_API_KEY.substring(0, 10) + "..." : "undefined");

// Initialize Nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Initialize Express app
const app = express();

// Connect to MongoDB
connectDB();

// Security Middleware
app.use(helmet());

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

app.use(limiter);

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Input Sanitization & Security
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');

// Prevent NoSQL injection
app.use(mongoSanitize());

// Prevent XSS attacks
app.use(xss());

// Prevent empty requests
app.use((req, res, next) => {
  if (["POST", "PATCH"].includes(req.method) && (!req.body || Object.keys(req.body).length === 0)) {
    return res.status(400).json({ message: 'Empty request body' });
  }
  next();
});

// Serve static files from uploads directory
app.use('/uploads', express.static('uploads'));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/forest', require('./routes/forest'));
app.use('/api/games', require('./routes/game'));
app.use('/api/badges', require('./routes/badgeRoutes'));
app.use('/api/rewards', require('./routes/rewardRoutes'));
app.use('/api/certificates', require('./routes/certificateRoutes'));
app.use('/api/leaderboard', require('./routes/leaderboard'));
app.use('/api/analytics', require('./routes/analytics'));
app.get('/api/students/class/:className', verifyToken, authorizeRoles('teacher'), getStudentsByClass);
app.use('/api/users', require('./routes/users'));
app.use('/api/tasks', require('./routes/tasks'));
app.use('/api/notifications', require('./routes/notifications'));
app.use('/api/announcements', require('./routes/announcements'));
app.use('/api/feedback', require('./routes/feedback'));
// AI Forest Guardian chatbot endpoint
app.use('/api/chat', require('./routes/chat'));

// AI health route alias for easy public check
const { chatHealth } = require('./controllers/chatController');
app.get('/api/ai/health', async (req, res, next) => {
  try {
    await chatHealth(req, res);
  } catch (error) {
    next(error);
  }
});

app.use('/api/school', require('./routes/school'));
app.use('/api/requests', require('./routes/requests'));
app.use('/api/superadmin', require('./routes/superadmin'));
app.use('/api/admin', require('./routes/admin'));

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ message: 'Server is running successfully' });
});

// Test email route
app.get("/test-email", async (req, res) => {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: "yourgmail@gmail.com", // Replace with your email
      subject: "Test Email",
      text: "Working",
    });

    res.send("Email sent");
  } catch (err) {
    console.error("FULL EMAIL ERROR:", err);
    res.send("Error sending email");
  }
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    message: err.message || 'Internal server error',
    status: err.status || 500
  });
});

// Start server
const PORT = process.env.PORT || 5000;
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    credentials: true
  }
});

// Make io available in routes
app.set('io', io);

// Socket connection
io.on("connection", (socket) => {
  socket.on("join", (userId) => {
    socket.join(userId);
  });
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT} in ${process.env.NODE_ENV} mode`);
});
