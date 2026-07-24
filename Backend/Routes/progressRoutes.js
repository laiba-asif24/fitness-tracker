const express = require('express');
const {
  createProgressLog,
  getProgressLogs,
  getProgressLogById,
  updateProgressLog,
  deleteProgressLog,
  uploadProgressPhoto,
  getChartData,
} = require('../controllers/progressController');
const { protect } = require('../middleware/authMiddleware');
const uploadTo = require('../middleware/uploadMiddleware');

const router = express.Router();

router.use(protect);

router.get('/chart-data', getChartData);

router.route('/').post(createProgressLog).get(getProgressLogs);

router.route('/:id').get(getProgressLogById).put(updateProgressLog).delete(deleteProgressLog);
router.post('/:id/photo', uploadTo('progress').single('photo'), uploadProgressPhoto);

module.exports = router;