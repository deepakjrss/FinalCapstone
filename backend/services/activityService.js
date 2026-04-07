const ActivityLog = require("../models/ActivityLog");

const logActivity = async (user, action, target, details = '') => {
  // Fallback to user's school from ID or populated object
  const schoolId = user?.school?._id ? user.school._id : user?.school;

  if (!schoolId) {
    console.warn('ActivityLog missing school in logActivity', {
      userId: user?._id,
      role: user?.role,
      action,
      target
    });
  }

  await ActivityLog.create({
    user: user._id,
    role: user.role,
    action,
    target,
    details,
    school: schoolId
  });
};

module.exports = { logActivity };