const express = require('express');
const {
  createNutritionLog,
  getNutritionLogs,
  getNutritionLogById,
  updateNutritionLog,
  deleteNutritionLog,
  getDailySummary,
} = require('../controllers/nutritionController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect);

router.get('/summary/daily', getDailySummary);

router.route('/').post(createNutritionLog).get(getNutritionLogs);

router.route('/:id').get(getNutritionLogById).put(updateNutritionLog).delete(deleteNutritionLog);

module.exports = router;