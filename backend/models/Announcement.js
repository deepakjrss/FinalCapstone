const mongoose = require('mongoose');

const announcementSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true
    },
    message: {
      type: String,
      required: [true, 'Message is required'],
      trim: true
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Sender is required']
    },
    school: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'School',
      required: [true, 'School reference is required']
    },
    class: {
      type: String,
      default: null
    },
    targetType: {
      type: String,
      enum: ['class', 'school'],
      required: [true, 'Target type is required'],
      default: 'school'
    }
  },
  {
    timestamps: true
  }
);

announcementSchema.index({ school: 1, targetType: 1, class: 1, createdAt: -1 });

module.exports = mongoose.model('Announcement', announcementSchema);
