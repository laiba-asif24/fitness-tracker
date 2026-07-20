const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const ProgressLog = require('../models/ProgressLog');


const createProgressLog = asyncHandler(async (req, res) => {
  const { date, weight, bodyMeasurements, performanceMetrics, photoUrl } = req.body;

  const log = await ProgressLog.create({
    user: req.user._id,
    date,
    weight,
    bodyMeasurements,
    performanceMetrics,
    photoUrl,
  });

  res.status(201).json({ success: true, data: log });
});


const getProgressLogs = asyncHandler(async (req, res) => {
  const { from, to, page = 1, limit = 20 } = req.query;

  const query = { user: req.user._id };
  if (from || to) {
    query.date = {};
    if (from) query.date.$gte = new Date(from);
    if (to) query.date.$lte = new Date(to);
  }

  const skip = (Number(page) - 1) * Number(limit);

  const [logs, total] = await Promise.all([
    ProgressLog.find(query).sort({ date: 1 }).skip(skip).limit(Number(limit)),
    ProgressLog.countDocuments(query),
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

const getProgressLogById = asyncHandler(async (req, res) => {
  const log = await ProgressLog.findOne({ _id: req.params.id, user: req.user._id });
  if (!log) throw new ApiError(404, 'Progress log not found');
  res.status(200).json({ success: true, data: log });
});

const updateProgressLog = asyncHandler(async (req, res) => {
  let log = await ProgressLog.findOne({ _id: req.params.id, user: req.user._id });
  if (!log) throw new ApiError(404, 'Progress log not found');

  log = await ProgressLog.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({ success: true, data: log });
});

const deleteProgressLog = asyncHandler(async (req, res) => {
  const log = await ProgressLog.findOne({ _id: req.params.id, user: req.user._id });
  if (!log) throw new ApiError(404, 'Progress log not found');

  await log.deleteOne();
  res.status(200).json({ success: true, message: 'Progress log deleted successfully' });
});

const getChartData = asyncHandler(async (req, res) => {
  const { from, to } = req.query;

  const query = { user: req.user._id };
  if (from || to) {
    query.date = {};
    if (from) query.date.$gte = new Date(from);
    if (to) query.date.$lte = new Date(to);
  }

  const logs = await ProgressLog.find(query)
    .sort({ date: 1 })
    .select('date weight bodyMeasurements performanceMetrics');

  res.status(200).json({ success: true, data: logs });
});

module.exports = {
  createProgressLog,
  getProgressLogs,
  getProgressLogById,
  updateProgressLog,
  deleteProgressLog,
  getChartData,
};