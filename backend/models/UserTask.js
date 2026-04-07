const mongoose = require('mongoose');

const userTaskSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    task: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Task',
      required: true,
      index: true
    },
    completed: {
      type: Boolean,
      default: false
    },
    completedAt: {
      type: Date,
      default: null
    },
    date: {
      type: Date,
      default: () => {
        const now = new Date();
        now.setHours(0, 0, 0, 0);
        return now;
      },
      index: true
    }
  },
  {
    timestamps: true
  }
);

// Ensure one task per user per day
userTaskSchema.index({ user: 1, task: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('UserTask', userTaskSchema);
