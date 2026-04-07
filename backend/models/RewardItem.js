const mongoose = require('mongoose');

const rewardItemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Reward item name is required'],
      trim: true,
      unique: true
    },
    description: {
      type: String,
      required: [true, 'Reward item description is required'],
      trim: true
    },
    icon: {
      type: String,
      required: [true, 'Reward item icon is required'],
      trim: true
    },
    cost: {
      type: Number,
      required: [true, 'Reward item cost is required'],
      min: [0, 'Reward item cost cannot be negative']
    },
    type: {
      type: String,
      enum: ['skin', 'avatar', 'badge', 'other'],
      default: 'other'
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

rewardItemSchema.index({ cost: 1 });

module.exports = mongoose.model('RewardItem', rewardItemSchema);
