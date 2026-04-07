const mongoose = require('mongoose');
const bcryptjs = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a name'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters']
    },
    email: {
      type: String,
      required: [true, 'Please provide an email'],
      unique: true,
      lowercase: true,
      index: true, // Add index for faster email lookups
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email'
      ]
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false // Don't return password by default
    },
    role: {
      type: String,
      enum: ['student', 'teacher', 'admin', 'superadmin'],
      default: 'student',
      required: true,
      index: true // Add index for role-based queries
    },
    status: {
      type: String,
      enum: ['pending', 'approved'],
      default: 'approved'
    },
    class: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Class",
      required: function() {
        return this.role === 'student';
      }
    },
    ecoPoints: {
      type: Number,
      default: 0,
      min: [0, 'Eco points cannot be negative'],
      index: true // Add index for analytics and sorting queries
    },
    gamesPlayed: {
      type: Number,
      default: 0,
      min: [0, 'Games played cannot be negative']
    },
    isActive: {
      type: Boolean,
      default: true
    },
    otp: {
      type: String,
      default: null
    },
    otpExpiry: {
      type: Date,
      default: null
    },
    isVerified: {
      type: Boolean,
      default: false
    },
    isFirstLogin: {
      type: Boolean,
      default: true
    },
    isDeleted: {
      type: Boolean,
      default: false
    },
    deletedAt: {
      type: Date,
      default: null
    },
    school: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "School"
    },
    unlockedItems: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'RewardItem'
      }
    ],
    isSuperAdmin: {
      type: Boolean,
      default: false
    },
    streak: {
      type: Number,
      default: 0,
      min: [0, 'Streak cannot be negative']
    },
    lastTaskCompletedDate: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true
  }
);

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }

  // Avoid double hashing a password already stored as bcrypt hash
  if (typeof this.password === 'string' && /^\$2[aby]\$\d{2}\$[./A-Za-z0-9]{53}$/.test(this.password)) {
    return next();
  }

  try {
    const salt = await bcryptjs.genSalt(10);
    this.password = await bcryptjs.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare passwords
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcryptjs.compare(enteredPassword, this.password);
};

// Method to get user without sensitive data
userSchema.methods.toJSON = function() {
  const user = this.toObject();
  delete user.password;
  return user;
};

module.exports = mongoose.model('User', userSchema);
