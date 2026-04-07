const Notification = require("../models/Notification");

const createNotification = async (userId, message, type, io, schoolId) => {
  const notification = await Notification.create({
    user: userId,
    message,
    type,
    school: schoolId,
  });

  // send real-time
  io.to(userId.toString()).emit("notification", notification);

  return notification;
};

module.exports = { createNotification };