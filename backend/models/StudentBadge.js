const mongoose = require('mongoose');

const studentBadgeSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Student ID is required'],
      index: true
    },
    badge: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Badge',
      required: [true, 'Badge ID is required']
    },
    earnedAt: {
      type: Date,
      default: Date.now,
      required: true
    },
    school: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "School",
      default: null
    }
  },
  {
    timestamps: true
  }
);

// Compound index to prevent duplicate badge earning
studentBadgeSchema.index({ student: 1, badge: 1 }, { unique: true });

/**
 * Static method to check if student has already earned a badge
 * @param {ObjectId} studentId - Student's user ID
 * @param {ObjectId} badgeId - Badge ID
 * @returns {Promise<Boolean>} - Whether student has earned badge
 */
studentBadgeSchema.statics.hasEarned = async function(studentId, badgeId) {
  const earned = await this.findOne({
    student: studentId,
    badge: badgeId
  });
  return !!earned;
};

module.exports = mongoose.model('StudentBadge', studentBadgeSchema);
