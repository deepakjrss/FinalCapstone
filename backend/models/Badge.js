const mongoose = require('mongoose');

const badgeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Badge name is required'],
      unique: true,
      trim: true
    },
    description: {
      type: String,
      required: [true, 'Badge description is required'],
      trim: true
    },
    icon: {
      type: String,
      required: [true, 'Badge icon is required'],
      trim: true // Emoji or icon identifier
    },
    conditionType: {
      type: String,
      enum: ['ecoPoints', 'gamesPlayed', 'streak'],
      required: [true, 'Condition type is required']
    },
    threshold: {
      type: Number,
      required: [true, 'Threshold is required'],
      min: [0, 'Threshold cannot be negative']
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

// Index for faster queries
badgeSchema.index({ conditionType: 1, threshold: 1 });

/**
 * Static method to check if a student qualifies for this badge
 * @param {Number} ecoPoints - Student's eco points
 * @param {Number} gamesPlayed - Number of games played by student
 * @returns {Boolean} - Whether student qualifies
 */
badgeSchema.statics.qualifies = function(ecoPoints, gamesPlayed) {
  if (this.conditionType === 'ecoPoints') {
    return ecoPoints >= this.threshold;
  } else if (this.conditionType === 'gamesPlayed') {
    return gamesPlayed >= this.threshold;
  }
  return false;
};

module.exports = mongoose.model('Badge', badgeSchema);
