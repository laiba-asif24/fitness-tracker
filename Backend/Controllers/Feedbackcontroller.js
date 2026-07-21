const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const Feedback = require('../models/Feedback');

// @desc    Submit feedback / support ticket
// @route   POST /api/feedback
// @access  Private
const createFeedback = asyncHandler(async (req, res) => {
  const { subject, message } = req.body;
  if (!subject || !message) throw new ApiError(400, 'subject and message are required');

  const feedback = await Feedback.create({ user: req.user._id, subject, message });
  res.status(201).json({ success: true, data: feedback });
});

// @desc    Get logged-in user's feedback tickets
// @route   GET /api/feedback
// @access  Private
const getMyFeedback = asyncHandler(async (req, res) => {
  const feedback = await Feedback.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.status(200).json({ success: true, count: feedback.length, data: feedback });
});

// ---------------- Admin only ----------------

// @desc    Get all feedback tickets (optionally filter by status)
// @route   GET /api/feedback/all
// @access  Private/Admin
const getAllFeedback = asyncHandler(async (req, res) => {
  const { status } = req.query;
  const query = {};
  if (status) query.status = status;

  const feedback = await Feedback.find(query).populate('user', 'name email username').sort({ createdAt: -1 });
  res.status(200).json({ success: true, count: feedback.length, data: feedback });
});

// @desc    Update feedback status (open/in_progress/resolved)
// @route   PATCH /api/feedback/:id/status
// @access  Private/Admin
const updateFeedbackStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  if (!['open', 'in_progress', 'resolved'].includes(status)) {
    throw new ApiError(400, 'Invalid status value');
  }

  const feedback = await Feedback.findById(req.params.id);
  if (!feedback) throw new ApiError(404, 'Feedback not found');

  feedback.status = status;
  await feedback.save();

  res.status(200).json({ success: true, data: feedback });
});

module.exports = { createFeedback, getMyFeedback, getAllFeedback, updateFeedbackStatus };
