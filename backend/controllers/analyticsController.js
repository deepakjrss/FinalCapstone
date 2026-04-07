const User = require('../models/User');
const Attempt = require('../models/Attempt');
const Forest = require('../models/Forest');
const EcoLog = require('../models/EcoLog');
const { cacheUtils, CACHE_KEYS } = require('../utils/cache');

// GET /api/analytics/overview
// Returns: totalStudents, totalGamesPlayed, avgEcoPoints, classEcoScore
const getAnalyticsOverview = async (req, res, next) => {
  try {
    console.log('📊 getAnalyticsOverview called');
    console.log('📊 req.user:', req.user);
    console.log('📊 req.user.school:', req.user?.school);
    console.log('📊 req.user.role:', req.user?.role);

    // Check cache first
    const cached = cacheUtils.get(CACHE_KEYS.ANALYTICS_OVERVIEW);
    if (cached) {
      return res.status(200).json(cached);
    }

    const totalStudentsPromise = User.countDocuments({ role: 'student', school: req.user.school, status: 'approved' });
    const totalGamesPlayedPromise = Attempt.countDocuments({ school: req.user.school });
    const avgEcoPointsPromise = User.aggregate([
      { $match: { role: 'student', school: req.user.school, status: 'approved' } },
      { $group: { _id: null, avgEcoPoints: { $avg: '$ecoPoints' } } }
    ]);
    const classEcoScorePromise = Forest.aggregate([
      { $match: { school: req.user.school } },
      { $project: { _id: 0, className: 1, ecoScore: 1, forestState: 1 } },
      { $sort: { ecoScore: -1 } }
    ]);

    const [totalStudents, totalGamesPlayed, avgEcoPointsResult, classEcoScore] = await Promise.all([
      totalStudentsPromise,
      totalGamesPlayedPromise,
      avgEcoPointsPromise,
      classEcoScorePromise
    ]);

    console.log('📊 Results:', { totalStudents, totalGamesPlayed, avgEcoPointsResult, classEcoScore });

    const avgEcoPoints = avgEcoPointsResult.length ? Number(avgEcoPointsResult[0].avgEcoPoints.toFixed(2)) : 0;

    const data = {
      totalStudents,
      totalGamesPlayed,
      avgEcoPoints,
      classEcoScore
    };

    // Cache the result
    cacheUtils.set(CACHE_KEYS.ANALYTICS_OVERVIEW, data);

    return res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};

// GET /api/analytics/top-students
// Returns top 5 students by ecoPoints
const getTopStudents = async (req, res, next) => {
  try {
    // Check cache first
    const cached = cacheUtils.get(CACHE_KEYS.ANALYTICS_TOP_STUDENTS);
    if (cached) {
      return res.status(200).json(cached);
    }

    let topStudents = await User.aggregate([
      { $match: { role: 'student', school: req.user.school, status: 'approved' } },
      { $project: { _id: 0, name: 1, ecoPoints: 1, className: 1 } },
      { $sort: { ecoPoints: -1 } },
      { $limit: 5 }
    ]);

    topStudents = topStudents
      .filter((user) => user !== null)
      .map((user) => ({
        name: user?.name || 'Deleted User',
        ecoPoints: user?.ecoPoints ?? 0,
        className: user?.className || 'N/A'
      }));

    // Cache the result
    cacheUtils.set(CACHE_KEYS.ANALYTICS_TOP_STUDENTS, topStudents);

    return res.status(200).json(topStudents);
  } catch (error) {
    next(error);
  }
};

// GET /api/analytics/dashboard-charts
// Returns data for dashboard charts (class comparison, student performance, monthly progress)
const getDashboardCharts = async (req, res, next) => {
  try {
    // Check cache first
    const cached = cacheUtils.get(CACHE_KEYS.ANALYTICS_DASHBOARD_CHARTS);
    if (cached) {
      return res.status(200).json(cached);
    }

    // Class comparison data
    const classComparison = await Forest.aggregate([
      { $match: { school: req.user.school } },
      {
        $group: {
          _id: '$className',
          score: { $sum: '$ecoScore' },
          students: { $sum: 1 }
        }
      },
      {
        $project: {
          name: '$_id',
          score: 1,
          students: 1,
          _id: 0
        }
      },
      { $sort: { score: -1 } },
      { $limit: 10 }
    ]);

    // Student performance data (monthly submissions)
    const studentPerformance = await Attempt.aggregate([
      { $match: { school: req.user.school } },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          submissions: { $sum: 1 },
          approved: {
            $sum: { $cond: [{ $eq: ['$status', 'approved'] }, 1, 0] }
          }
        }
      },
      {
        $project: {
          name: {
            $concat: [
              { $arrayElemAt: [['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'], '$_id.month'] },
              '-',
              { $substr: [{ $toString: '$_id.year' }, 2, 2] }
            ]
          },
          submissions: 1,
          approved: 1,
          _id: 0
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
      { $limit: 6 }
    ]);

    // Monthly progress data
    const monthlyProgress = await User.aggregate([
      { $match: { role: 'student', school: req.user.school, status: 'approved' } },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          ecoPoints: { $sum: '$ecoPoints' }
        }
      },
      {
        $project: {
          month: {
            $concat: [
              { $arrayElemAt: [['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'], '$_id.month'] },
              '-',
              { $substr: [{ $toString: '$_id.year' }, 2, 2] }
            ]
          },
          ecoPoints: 1,
          _id: 0
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
      { $limit: 6 }
    ]);

    const data = {
      classComparison: classComparison || [],
      studentPerformance: studentPerformance || [],
      monthlyProgress: monthlyProgress || []
    };

    // Cache the result
    cacheUtils.set(CACHE_KEYS.ANALYTICS_DASHBOARD_CHARTS, data);

    return res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};

// GET /api/analytics/engagement
// Returns students with low participation and active students
const getEngagement = async (req, res, next) => {
  try {
    console.log('DEBUG getEngagement user:', req.user);
    console.log('DEBUG getEngagement school:', req.user?.school);

    // Check cache first
    const cached = cacheUtils.get(CACHE_KEYS.ANALYTICS_ENGAGEMENT);
    if (cached) {
      return res.status(200).json(cached);
    }

    const lowParticipationPromise = User.aggregate([
      { $match: { role: 'student', school: req.user.school, status: 'approved', ecoPoints: { $lt: 50 } } },
      { $project: { _id: 0, name: 1, ecoPoints: 1, class: 1 } },
      { $sort: { ecoPoints: 1 } }
    ]);

    const activeStudentsPromise = User.aggregate([
      { $match: { role: 'student', school: req.user.school, status: 'approved', ecoPoints: { $gt: 200 } } },
      { $project: { _id: 0, name: 1, ecoPoints: 1, class: 1 } },
      { $sort: { ecoPoints: -1 } }
    ]);

    let [lowParticipation, activeStudents] = await Promise.all([lowParticipationPromise, activeStudentsPromise]);

    lowParticipation = lowParticipation
      .filter((student) => student !== null)
      .map((student) => ({
        name: student?.name || 'Deleted User',
        ecoPoints: student?.ecoPoints ?? 0,
        className: student?.class || 'N/A'
      }));

    activeStudents = activeStudents
      .filter((student) => student !== null)
      .map((student) => ({
        name: student?.name || 'Deleted User',
        ecoPoints: student?.ecoPoints ?? 0,
        className: student?.class || 'N/A'
      }));

    const data = {
      lowParticipation,
      activeStudents
    };

    // Cache the result
    cacheUtils.set(CACHE_KEYS.ANALYTICS_ENGAGEMENT, data);

    return res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};

// GET /api/analytics/students
// Returns all students with name, className, ecoPoints (school-scoped)
const getStudents = async (req, res, next) => {
  try {
    console.log('DEBUG getStudents user:', req.user);
    console.log('DEBUG getStudents school:', req.user?.school);

    const cacheKey = `${CACHE_KEYS.ANALYTICS_STUDENTS}_${req.user?.school}`;
    const cached = cacheUtils.get(cacheKey);
    if (cached) {
      return res.status(200).json(cached);
    }

    let students = await User.find({
      role: 'student',
      school: req.user?.school,
      status: 'approved',
      isDeleted: false
    }, 'name className ecoPoints').sort({ ecoPoints: -1 });

    students = students
      .filter((student) => student !== null)
      .map((student) => ({
        _id: student._id,
        name: student?.name || 'Deleted User',
        className: student?.className || 'N/A',
        ecoPoints: student?.ecoPoints ?? 0
      }));

    cacheUtils.set(cacheKey, students);

    return res.status(200).json(students);
  } catch (error) {
    next(error);
  }
};

// GET /api/analytics/games
// Returns list of game attempts with studentName, gameName, score
const getGames = async (req, res, next) => {
  try {
    console.log('DEBUG getGames user:', req.user);
    console.log('DEBUG getGames school:', req.user?.school);

    // Check cache first
    const cached = cacheUtils.get(CACHE_KEYS.ANALYTICS_GAMES);
    if (cached) {
      return res.status(200).json(cached);
    }

    const attempts = await Attempt.find({ school: req.user.school })
      .populate('student', 'name')
      .populate('game', 'title')
      .select('student game score');
    const games = attempts
      .filter((att) => att && att.student !== null && att.game !== null)
      .map((att) => ({
        studentName: att.student?.name || 'Deleted User',
        gameName: att.game?.title || 'Unknown Game',
        score: att?.score ?? 0
      }));

    // Cache the result
    cacheUtils.set(CACHE_KEYS.ANALYTICS_GAMES, games);

    return res.status(200).json(games);
  } catch (error) {
    next(error);
  }
};

// GET /api/analytics/classes
// Returns list of unique class names
const getClasses = async (req, res, next) => {
  try {
    console.log('DEBUG getClasses user:', req.user);
    console.log('DEBUG getClasses school:', req.user?.school);

    // Check cache first
    const cached = cacheUtils.get(CACHE_KEYS.ANALYTICS_CLASSES);
    if (cached) {
      return res.status(200).json(cached);
    }

    const classes = await User.distinct('class', { role: 'student', school: req.user.school, status: 'approved', isDeleted: false });

    // Cache the result
    cacheUtils.set(CACHE_KEYS.ANALYTICS_CLASSES, classes.filter(c => c));

    return res.status(200).json(classes.filter(c => c)); // Filter out null/undefined
  } catch (error) {
    next(error);
  }
};

// GET /api/students/class/:className
// Returns students in a class with name and ecoPoints
const getStudentsByClass = async (req, res, next) => {
  try {
    const { className } = req.params;
    if (!className) {
      return res.status(400).json({ message: 'className is required' });
    }

    console.log('DEBUG getStudentsByClass user:', req.user);
    console.log('DEBUG getStudentsByClass school:', req.user?.school);

    // Check cache first
    const cacheKey = CACHE_KEYS.STUDENTS_BY_CLASS(className);
    const cached = cacheUtils.get(cacheKey);
    if (cached) {
      return res.status(200).json(cached);
    }

    let students = await User.find({
      role: 'student',
      class: className,
      school: req.user.school,
      status: 'approved',
      isDeleted: false
    }, 'name ecoPoints class').sort({ ecoPoints: -1 });

    students = students.map((student) => ({
      name: student?.name || 'Deleted User',
      ecoPoints: student?.ecoPoints ?? 0,
      className: student?.class || 'N/A'
    }));

    // Cache the result
    cacheUtils.set(cacheKey, students);

    return res.status(200).json(students);
  } catch (error) {
    next(error);
  }
};

// GET /api/teachers
// Returns list of teachers (school-scoped)
const getTeachers = async (req, res, next) => {
  try {
    console.log('DEBUG getTeachers user:', req.user);
    console.log('DEBUG getTeachers school:', req.user?.school);

    const cacheKey = `${CACHE_KEYS.USERS_TEACHERS}_${req.user?.school}`;
    const cached = cacheUtils.get(cacheKey);
    if (cached) {
      return res.status(200).json(cached);
    }

    const teachers = await User.find({
      role: 'teacher',
      school: req.user?.school,
      status: 'approved',
      isDeleted: false
    }, 'name _id');

    cacheUtils.set(cacheKey, teachers);

    return res.status(200).json(teachers);
  } catch (error) {
    next(error);
  }
};

// GET /api/analytics/class-performance
// Returns class-wise average ecoPoints
const getClassPerformance = async (req, res, next) => {
  try {
    console.log('📊 getClassPerformance school:', req.user?.school);

    const cacheKey = `${CACHE_KEYS.ANALYTICS_CLASS_PERFORMANCE}_${req.user?.school}`;
    const cached = cacheUtils.get(cacheKey);
    if (cached) {
      return res.status(200).json(cached);
    }

    // Advanced class performance with top student
    const classPerformance = await User.aggregate([
      {
        $match: {
          role: 'student',
          school: req.user.school,
          status: 'approved'
        }
      },
      {
        $group: {
          _id: '$class',
          totalEcoPoints: { $sum: '$ecoPoints' },
          averageEcoPoints: { $avg: '$ecoPoints' },
          studentCount: { $sum: 1 },
          maxEcoPoints: { $max: '$ecoPoints' },
          students: { 
            $push: { 
              name: '$name', 
              ecoPoints: '$ecoPoints' 
            } 
          }
        }
      },
      {
        $lookup: {
          from: 'classes',
          localField: '_id',
          foreignField: '_id',
          as: 'classInfo'
        }
      },
      {
        $unwind: { path: '$classInfo', preserveNullAndEmptyArrays: true }
      },
      {
        $addFields: {
          topStudent: {
            $arrayElemAt: [
              {
                $filter: {
                  input: '$students',
                  as: 'student',
                  cond: { $eq: ['$$student.ecoPoints', '$maxEcoPoints'] }
                }
              },
              0
            ]
          }
        }
      },
      {
        $project: {
          className: { $ifNull: ['$classInfo.name', 'Unknown Class'] },
          totalEcoPoints: { $round: ['$totalEcoPoints', 2] },
          averageEcoPoints: { $round: ['$averageEcoPoints', 2] },
          studentCount: 1,
          topStudent: { $ifNull: ['$topStudent.name', 'N/A'] },
          maxEcoPoints: 1,
          _id: 0
        }
      },
      { $sort: { averageEcoPoints: -1 } }
    ]);

    // Get games played per class
    const gamesData = await Attempt.aggregate([
      {
        $match: {
          school: req.user.school
        }
      },
      {
        $group: {
          _id: '$class',
          totalGamesPlayed: { $sum: 1 }
        }
      }
    ]);

    // Merge games data with class performance
    const gamesMap = {};
    gamesData.forEach(item => {
      gamesMap[item._id] = item.totalGamesPlayed;
    });

    const result = classPerformance.map(cls => ({
      ...cls,
      totalGamesPlayed: gamesMap[cls._id] || 0,
      // Performance scoring: green (>200), yellow (100-200), red (<100)
      performanceLevel: cls.averageEcoPoints >= 200 ? 'high' : cls.averageEcoPoints >= 100 ? 'medium' : 'low'
    }));

    cacheUtils.set(cacheKey, result);
    return res.status(200).json(result);
  } catch (error) {
    console.error('Error in getClassPerformance:', error);
    next(error);
  }
};

// GET /api/analytics/eco-score-trend
// Returns advanced eco score trend with daily + weekly data and growth percentage
const getEcoScoreTrend = async (req, res, next) => {
  try {
    console.log('📈 getEcoScoreTrend school:', req.user?.school);

    const cacheKey = `${CACHE_KEYS.ANALYTICS_ECO_TREND}_${req.user?.school}`;
    const cached = cacheUtils.get(cacheKey);
    if (cached) {
      return res.status(200).json(cached);
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const mondayOffset = (today.getDay() + 6) % 7;
    const thisWeekStart = new Date(today);
    thisWeekStart.setDate(today.getDate() - mondayOffset);

    const lastWeekStart = new Date(thisWeekStart);
    lastWeekStart.setDate(thisWeekStart.getDate() - 7);

    const ecoLogs = await EcoLog.find({
      school: req.user.school,
      date: { $gte: lastWeekStart }
    }).select('points date');

    const dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const dailyTrend = [];

    for (let i = 0; i < 7; i++) {
      const dayStart = new Date(thisWeekStart);
      dayStart.setDate(thisWeekStart.getDate() + i);
      const dayEnd = new Date(dayStart);
      dayEnd.setDate(dayStart.getDate() + 1);

      const dayTotal = ecoLogs
        .filter((log) => log.date >= dayStart && log.date < dayEnd)
        .reduce((sum, log) => sum + (log.points || 0), 0);

      dailyTrend.push({
        date: dayNames[i],
        score: dayTotal
      });
    }

    const thisWeekTotal = ecoLogs
      .filter((log) => log.date >= thisWeekStart)
      .reduce((sum, log) => sum + (log.points || 0), 0);

    const lastWeekTotal = ecoLogs
      .filter((log) => log.date >= lastWeekStart && log.date < thisWeekStart)
      .reduce((sum, log) => sum + (log.points || 0), 0);

    let weeklyTrend = {
      thisWeek: thisWeekTotal,
      lastWeek: lastWeekTotal,
      growth: 0,
      trend: 'stable'
    };

    if (ecoLogs.length === 0) {
      const mockDaily = [
        { date: 'Monday', score: 90 },
        { date: 'Tuesday', score: 120 },
        { date: 'Wednesday', score: 105 },
        { date: 'Thursday', score: 135 },
        { date: 'Friday', score: 150 },
        { date: 'Saturday', score: 110 },
        { date: 'Sunday', score: 140 }
      ];
      const mockThisWeek = mockDaily.reduce((sum, item) => sum + item.score, 0);
      const mockLastWeek = Math.max(Math.round(mockThisWeek * 0.9), 1);
      const mockGrowth = Math.round(((mockThisWeek - mockLastWeek) / mockLastWeek) * 100);
      weeklyTrend = {
        thisWeek: mockThisWeek,
        lastWeek: mockLastWeek,
        growth: mockGrowth,
        trend: mockGrowth > 0 ? 'up' : mockGrowth < 0 ? 'down' : 'stable',
        isMock: true
      };
      dailyTrend.splice(0, dailyTrend.length, ...mockDaily);
    } else {
      const growth = lastWeekTotal > 0
        ? Math.round(((thisWeekTotal - lastWeekTotal) / lastWeekTotal) * 100)
        : thisWeekTotal > 0 ? 100 : 0;
      weeklyTrend = {
        thisWeek: thisWeekTotal,
        lastWeek: lastWeekTotal,
        growth,
        trend: growth > 0 ? 'up' : growth < 0 ? 'down' : 'stable',
        isMock: false
      };
    }

    const result = {
      daily: dailyTrend,
      weekly: weeklyTrend
    };

    cacheUtils.set(cacheKey, result);
    return res.status(200).json(result);
  } catch (error) {
    console.error('Error in getEcoScoreTrend:', error);
    next(error);
  }
};

// GET /api/admin/analytics
// Returns admin-specific stats for their school
const getAdminAnalytics = async (req, res, next) => {
  try {
    const schoolId = req.user.school;

    const totalUsers = await User.countDocuments({
      school: schoolId,
      status: 'approved',
      isDeleted: false
    });

    const totalStudents = await User.countDocuments({
      school: schoolId,
      role: 'student',
      status: 'approved',
      isDeleted: false
    });

    const totalTeachers = await User.countDocuments({
      school: schoolId,
      role: 'teacher',
      status: 'approved',
      isDeleted: false
    });

    const activeUsers = await User.countDocuments({
      school: schoolId,
      status: 'approved',
      isDeleted: false,
      updatedAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }
    });

    // Simple health check
    const systemHealth = 100;

    const data = {
      totalUsers,
      totalStudents,
      totalTeachers,
      activeUsers,
      systemHealth
    };

    return res.status(200).json(data);
  } catch (error) {
    console.error('Error in getAdminAnalytics:', error);
    next(error);
  }
};

module.exports = {
  getAnalyticsOverview,
  getTopStudents,
  getEngagement,
  getStudents,
  getGames,
  getStudentsByClass,
  getTeachers,
  getDashboardCharts,
  getClasses,
  getClassPerformance,
  getEcoScoreTrend,
  getAdminAnalytics
};
