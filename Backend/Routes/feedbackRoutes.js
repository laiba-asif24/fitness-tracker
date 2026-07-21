const express = require('express');
const {
  createFeedback,
  getMyFeedback,
  getAllFeedback,
  updateFeedbackStatus,
} = require('../controllers/feedbackController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect);

router.route('/').post(createFeedback).get(getMyFeedback);

// Admin only
router.get('/all', authorize('admin'), getAllFeedback);
router.patch('/:id/status', authorize('admin'), updateFeedbackStatus);

module.exports = router;
