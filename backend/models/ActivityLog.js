const mongoose = require("mongoose");

const activityLogSchema = new mongoose.Schema({
  action: String,
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  target: String,
  role: String,
  details: String,
  school: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "School",
    required: true
  },
}, { timestamps: true });

module.exports = mongoose.model("ActivityLog", activityLogSchema);