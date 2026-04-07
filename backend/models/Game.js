const mongoose = require('mongoose');

const gameSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Game title is required'],
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters']
    },
    description: {
      type: String,
      required: [true, 'Game description is required'],
      trim: true,
      maxlength: [500, 'Description cannot exceed 500 characters']
    },
    category: {
      type: String,
      enum: ['renewable-energy', 'conservation', 'climate', 'sustainability', 'waste-management'],
      default: 'sustainability'
    },
    difficulty: {
      type: String,
      enum: ['easy', 'medium', 'hard'],
      default: 'medium'
    },
    questions: [
      {
        questionText: {
          type: String,
          required: [true, 'Question text is required']
        },
        options: {
          type: [String],
          required: [true, 'Options are required'],
          validate: {
            validator: (v) => v.length >= 2 && v.length <= 5,
            message: 'Must have between 2 and 5 options'
          }
        },
        correctAnswer: {
          type: Number,
          required: [true, 'Correct answer index is required'],
          validate: {
            validator: function(v) {
              return v >= 0 && v < this.options.length;
            },
            message: 'Correct answer index must be valid'
          }
        },
        explanation: {
          type: String,
          trim: true
        }
      }
    ],
    maxPoints: {
      type: Number,
      required: [true, 'Max points is required'],
      min: [1, 'Max points must be at least 1'],
      max: [500, 'Max points cannot exceed 500']
    },
    minPassScore: {
      type: Number,
      default: 60,
      min: [0, 'Min pass score cannot be negative'],
      max: [100, 'Min pass score cannot exceed 100']
    },
    isActive: {
      type: Boolean,
      default: true
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
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

// Index for better query performance
gameSchema.index({ category: 1, isActive: 1 });
gameSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Game', gameSchema);
