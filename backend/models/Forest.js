const mongoose = require('mongoose');

const forestSchema = new mongoose.Schema(
  {
    className: {
      type: String,
      required: [true, 'Class name is required'],
      unique: true,
      trim: true,
      uppercase: true
    },
    ecoScore: {
      type: Number,
      default: 0,
      min: [0, 'Eco score cannot be negative'],
      index: true // Add index for sorting queries
    },
    forestState: {
      type: String,
      enum: ['polluted', 'growing', 'healthy'],
      default: 'polluted'
    },
    lastUpdated: {
      type: Date,
      default: Date.now
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

// Pre-save middleware to calculate forest state based on ecoScore
forestSchema.pre('save', function(next) {
  if (this.ecoScore <= 100) {
    this.forestState = 'polluted';
  } else if (this.ecoScore > 100 && this.ecoScore <= 300) {
    this.forestState = 'growing';
  } else if (this.ecoScore > 300) {
    this.forestState = 'healthy';
  }
  this.lastUpdated = new Date();
  next();
});

// Static method to get or create forest by className
forestSchema.statics.getOrCreate = async function(className, schoolId) {
  try {
    let forest = await this.findOne({ className: className.toUpperCase(), school: schoolId });
    if (!forest) {
      forest = await this.create({
        className: className.toUpperCase(),
        ecoScore: 0,
        forestState: 'polluted',
        school: schoolId
      });
    }
    return forest;
  } catch (error) {
    throw error;
  }
};

// Instance method to add points
forestSchema.methods.addPoints = async function(points) {
  try {
    if (typeof points !== 'number' || points < 0) {
      throw new Error('Points must be a non-negative number');
    }
    this.ecoScore += points;
    await this.save();
    return this;
  } catch (error) {
    throw error;
  }
};

module.exports = mongoose.model('Forest', forestSchema);
