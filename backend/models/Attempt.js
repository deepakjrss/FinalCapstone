const mongoose = require('mongoose');

const attemptSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Student reference is required']
    },
    game: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Game',
      required: [true, 'Game reference is required']
    },
    answers: {
      type: [Number],
      required: [true, 'Answers array is required']
    },
    score: {
      type: Number,
      required: [true, 'Score is required'],
      min: [0, 'Score cannot be negative'],
      max: [100, 'Score cannot exceed 100']
    },
    pointsEarned: {
      type: Number,
      required: [true, 'Points earned is required'],
      min: [0, 'Points cannot be negative']
    },
    passed: {
      type: Boolean,
      default: false
    },
    completedAt: {
      type: Date,
      default: Date.now
    },
    timeTaken: {
      type: Number,
      default: 0 // in seconds
    },
    school: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "School",
      required: true
    }
  },
  {
    timestamps: true
  }
);

// Index for query performance
attemptSchema.index({ student: 1, game: 1 });
attemptSchema.index({ student: 1, createdAt: -1 });
attemptSchema.index({ game: 1, createdAt: -1 });

// Static method to get student's game performance
attemptSchema.statics.getStudentStats = async function(studentId) {
  try {
    const stats = await this.aggregate([
      { $match: { student: mongoose.Types.ObjectId(studentId) } },
      {
        $group: {
          _id: null,
          totalAttempts: { $sum: 1 },
          totalPointsEarned: { $sum: '$pointsEarned' },
          averageScore: { $avg: '$score' },
          passedCount: {
            $sum: { $cond: [{ $eq: ['$passed', true] }, 1, 0] }
          }
        }
      }
    ]);

    return stats.length > 0 ? stats[0] : {
      totalAttempts: 0,
      totalPointsEarned: 0,
      averageScore: 0,
      passedCount: 0
    };
  } catch (error) {
    throw error;
  }
};

module.exports = mongoose.model('Attempt', attemptSchema);
