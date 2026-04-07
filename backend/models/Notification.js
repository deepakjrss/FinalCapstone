const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
  message: String,
  type: String, // info, success, warning
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  isRead: { type: Boolean, default: false },
  school: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "School",
    required: true
  },
}, { timestamps: true });

module.exports = mongoose.model("Notification", notificationSchema);
