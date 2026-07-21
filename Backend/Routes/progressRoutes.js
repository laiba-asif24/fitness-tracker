const express = require('express');
const {
  createProgressLog,
  getProgressLogs,
  getProgressLogById,
  updateProgressLog,
  deleteProgressLog,
  getChartData,
} = require('../controllers/progressController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect);

router.get('/chart-data', getChartData);

router.route('/').post(createProgressLog).get(getProgressLogs);

router.route('/:id').get(getProgressLogById).put(updateProgressLog).delete(deleteProgressLog);

module.exports = router;
