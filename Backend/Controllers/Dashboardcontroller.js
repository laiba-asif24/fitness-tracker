const asyncHandler = require('../utils/asyncHandler');
const Workout = require('../models/Workout');
const NutritionLog = require('../models/NutritionLog');
const ProgressLog = require('../models/ProgressLog');
const Notification = require('../models/Notification');

// @desc    Get dashboard overview: recent workouts, nutrition, progress, unread notifications
// @route   GET /api/dashboard
// @access  Private
const getDashboard = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const [recentWorkouts, recentNutrition, latestProgress, unreadCount, workoutCount, weeklyCalories] =
    await Promise.all([
      Workout.find({ user: userId }).sort({ date: -1 }).limit(5),
      NutritionLog.find({ user: userId }).sort({ date: -1 }).limit(5),
      ProgressLog.findOne({ user: userId }).sort({ date: -1 }),
      Notification.countDocuments({ user: userId, isRead: false }),
      Workout.countDocuments({ user: userId }),
      NutritionLog.aggregate([
        {
          $match: {
            user: userId,
            date: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
          },
        },
        { $group: { _id: null, totalCalories: { $sum: '$totalCalories' } } },
      ]),
    ]);

  res.status(200).json({
    success: true,
    data: {
      recentWorkouts,
      recentNutrition,
      latestProgress,
      unreadNotifications: unreadCount,
      totalWorkouts: workoutCount,
      weeklyCalories: weeklyCalories[0]?.totalCalories || 0,
    },
  });
});

module.exports = { getDashboard };
