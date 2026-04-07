const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema(
  {
    task: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Task',
      required: [true, 'Task reference is required']
    },
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Student reference is required']
    },
    proof: {
      type: String,
      trim: true,
      maxlength: [2000, 'Proof must not exceed 2000 characters']
    },
    proofImage: {
      type: String,
      trim: true
    },
    status: {
      type: String,
      enum: {
        values: ['pending', 'approved', 'rejected'],
        message: 'Status must be pending, approved, or rejected'
      },
      default: 'pending'
    },
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    reviewComments: {
      type: String,
      trim: true,
      maxlength: [500, 'Review comments must not exceed 500 characters']
    },
    submittedAt: {
      type: Date,
      default: Date.now
    },
    reviewedAt: {
      type: Date
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

// Pre-save validation to ensure at least one proof type is provided
submissionSchema.pre('save', function(next) {
  if (!this.proof && !this.proofImage) {
    const error = new Error('Either proof text or proof image must be provided');
    return next(error);
  }
  next();
});

// Index for query performance
submissionSchema.index({ task: 1, student: 1 });
submissionSchema.index({ status: 1, submittedAt: -1 });
submissionSchema.index({ student: 1, status: 1 });

// Static method to check if student already submitted this task
submissionSchema.statics.hasSubmitted = async function(taskId, studentId) {
  const submission = await this.findOne({
    task: taskId,
    student: studentId,
    status: { $in: ['pending', 'approved'] }
  });
  return !!submission;
};

module.exports = mongoose.model('Submission', submissionSchema);
