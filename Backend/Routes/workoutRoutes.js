const express = require('express');
const {
  createWorkout,
  getWorkouts,
  getWorkoutById,
  updateWorkout,
  deleteWorkout,
  addExercise,
  removeExercise,
} = require('../controllers/workoutController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect);

router.route('/').post(createWorkout).get(getWorkouts);

router.route('/:id').get(getWorkoutById).put(updateWorkout).delete(deleteWorkout);

router.route('/:id/exercises').post(addExercise);
router.route('/:id/exercises/:exerciseId').delete(removeExercise);

module.exports = router;