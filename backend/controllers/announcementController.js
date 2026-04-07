const Announcement = require('../models/Announcement');
const Class = require('../models/Class');

const resolveUserClassName = async (user) => {
  if (user?.className) {
    return user.className;
  }

  if (user?.class) {
    const classDoc = await Class.findById(user.class).select('name');
    if (classDoc) return classDoc.name;
  }

  if (user?.role === 'teacher') {
    const teacherClass = await Class.findOne({ teacher: user._id }).select('name');
    if (teacherClass) return teacherClass.name;
  }

  return null;
};

const createAnnouncement = async (req, res, next) => {
  try {
    console.log('DEBUG createAnnouncement req.user:', req.user);
    console.log('DEBUG createAnnouncement req.user._id:', req.user?._id);
    console.log('DEBUG createAnnouncement req.user.role:', req.user?.role);
    console.log('DEBUG createAnnouncement req.user.school:', req.user?.school);
    console.log('DEBUG createAnnouncement req.body:', req.body);

    const { title, message, targetType, class: classNameBody, className } = req.body;
    const targetClassName = classNameBody || className;

    if (!title || !message) {
      console.log('DEBUG createAnnouncement: Missing title or message');
      return res.status(400).json({ success: false, message: 'Title and message are required' });
    }

    const announcementData = {
      title: title.trim(),
      message: message.trim(),
      sender: req.user._id,
      school: req.user.school
    };

    if (req.user.role === 'teacher') {
      const teacherClassName = await resolveUserClassName(req.user);
      if (!teacherClassName) {
        return res.status(400).json({ success: false, message: 'Unable to determine your class for announcement delivery' });
      }
      announcementData.targetType = 'class';
      announcementData.class = teacherClassName;
    } else if (req.user.role === 'admin') {
      if (!targetType || !['class', 'school'].includes(targetType)) {
        return res.status(400).json({ success: false, message: 'targetType must be either "class" or "school"' });
      }
      announcementData.targetType = targetType;
      if (targetType === 'class') {
        if (!targetClassName) {
          return res.status(400).json({ success: false, message: 'Class name is required when targetType is "class"' });
        }

        const classDoc = await Class.findOne({ name: targetClassName, school: req.user.school });
        if (!classDoc) {
          return res.status(404).json({ success: false, message: 'Class not found for this school' });
        }

        announcementData.class = classDoc.name;
      }
    } else {
      return res.status(403).json({ success: false, message: 'Only teachers and admins can create announcements' });
    }

    const announcement = await Announcement.create(announcementData);
    return res.status(201).json({ success: true, data: announcement });
  } catch (error) {
    console.error('Error creating announcement:', error);
    next(error);
  }
};

const getAnnouncements = async (req, res, next) => {
  try {
    const query = { school: req.user.school };

    if (req.user.role === 'admin') {
      // Admin sees all school announcements
    } else {
      const className = await resolveUserClassName(req.user);
      query.$or = [{ targetType: 'school' }];
      if (className) {
        query.$or.push({ targetType: 'class', class: className });
      }
    }

    const announcements = await Announcement.find(query)
      .sort({ createdAt: -1 })
      .limit(50)
      .populate('sender', 'name role');

    return res.status(200).json({ success: true, data: announcements });
  } catch (error) {
    console.error('Error fetching announcements:', error);
    next(error);
  }
};

module.exports = {
  createAnnouncement,
  getAnnouncements
};
