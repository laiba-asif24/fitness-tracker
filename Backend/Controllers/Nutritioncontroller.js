const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const NutritionLog = require('../models/NutritionLog');

const createNutritionLog = asyncHandler(async (req, res) => {
  const { date, mealType, items } = req.body;

  if (!mealType) throw new ApiError(400, 'mealType is required');

  const log = await NutritionLog.create({
    user: req.user._id,
    date,
    mealType,
    items,
  });

  res.status(201).json({ success: true, data: log });
});
const getNutritionLogs = asyncHandler(async (req, res) => {
  const { mealType, from, to, page = 1, limit = 10 } = req.query;

  const query = { user: req.user._id };
  if (mealType) query.mealType = mealType;
  if (from || to) {
    query.date = {};
    if (from) query.date.$gte = new Date(from);
    if (to) query.date.$lte = new Date(to);
  }

  const skip = (Number(page) - 1) * Number(limit);

  const [logs, total] = await Promise.all([
    NutritionLog.find(query).sort({ date: -1 }).skip(skip).limit(Number(limit)),
    NutritionLog.countDocuments(query),
  ]);

  res.status(200).json({
    success: true,
    count: logs.length,
    total,
    page: Number(page),
    pages: Math.ceil(total / limit),
    data: logs,
  });
});


const getNutritionLogById = asyncHandler(async (req, res) => {
  const log = await NutritionLog.findOne({ _id: req.params.id, user: req.user._id });
  if (!log) throw new ApiError(404, 'Nutrition log not found');
  res.status(200).json({ success: true, data: log });
});

const updateNutritionLog = asyncHandler(async (req, res) => {
  let log = await NutritionLog.findOne({ _id: req.params.id, user: req.user._id });
  if (!log) throw new ApiError(404, 'Nutrition log not found');

  // Apply updates then save (not findByIdAndUpdate) so the pre-save totals hook runs
  Object.assign(log, req.body);
  log = await log.save();

  res.status(200).json({ success: true, data: log });
});

const deleteNutritionLog = asyncHandler(async (req, res) => {
  const log = await NutritionLog.findOne({ _id: req.params.id, user: req.user._id });
  if (!log) throw new ApiError(404, 'Nutrition log not found');

  await log.deleteOne();
  res.status(200).json({ success: true, message: 'Nutrition log deleted successfully' });
});

const getDailySummary = asyncHandler(async (req, res) => {
  const { from, to } = req.query;

  const match = { user: req.user._id };
  if (from || to) {
    match.date = {};
    if (from) match.date.$gte = new Date(from);
    if (to) match.date.$lte = new Date(to);
  }

  const summary = await NutritionLog.aggregate([
    { $match: match },
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m-%d', date: '$date' } },
        totalCalories: { $sum: '$totalCalories' },
        totalProtein: { $sum: '$totalMacros.protein' },
        totalCarbs: { $sum: '$totalMacros.carbs' },
        totalFats: { $sum: '$totalMacros.fats' },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  res.status(200).json({ success: true, data: summary });
});

module.exports = {
  createNutritionLog,
  getNutritionLogs,
  getNutritionLogById,
  updateNutritionLog,
  deleteNutritionLog,
  getDailySummary,
};