const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Task title is required'],
      trim: true,
      minlength: [5, 'Title must be at least 5 characters'],
      maxlength: [100, 'Title must not exceed 100 characters']
    },
    description: {
      type: String,
      required: [true, 'Task description is required'],
      trim: true,
      minlength: [10, 'Description must be at least 10 characters'],
      maxlength: [500, 'Description must not exceed 500 characters']
    },
    points: {
      type: Number,
      required: [true, 'EcoPoints reward is required'],
      min: [1, 'Points must be at least 1'],
      max: [1000, 'Points must not exceed 1000']
    },
    className: {
      type: String,
      required: [true, 'Class name is required'],
      uppercase: true,
      trim: true
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Teacher reference is required']
    },
    isActive: {
      type: Boolean,
      default: true
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

// Index for faster queries
taskSchema.index({ className: 1, isActive: 1 });
taskSchema.index({ createdBy: 1, createdAt: -1 });

module.exports = mongoose.model('Task', taskSchema);
