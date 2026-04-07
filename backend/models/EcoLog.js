const mongoose = require('mongoose');

const ecoLogSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User reference is required']
    },
    school: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'School',
      required: [true, 'School reference is required']
    },
    className: {
      type: String,
      default: null
    },
    points: {
      type: Number,
      required: [true, 'Points are required'],
      min: [0, 'Points cannot be negative']
    },
    type: {
      type: String,
      enum: ['task', 'game'],
      required: [true, 'Type is required']
    },
    description: {
      type: String,
      default: ''
    },
    date: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
);

ecoLogSchema.index({ school: 1, date: -1 });
ecoLogSchema.index({ user: 1, date: -1 });
ecoLogSchema.index({ className: 1 });

module.exports = mongoose.model('EcoLog', ecoLogSchema);
