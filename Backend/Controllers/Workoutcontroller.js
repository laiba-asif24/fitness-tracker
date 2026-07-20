const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const Workout = require('../models/Workout');

const createWorkout = asyncHandler(async (req, res) => {
  const { title, category, tags, exercises, notes, duration, date } = req.body;

  if (!title) throw new ApiError(400, 'Workout title is required');

  const workout = await Workout.create({
    user: req.user._id,
    title,
    category,
    tags,
    exercises,
    notes,
    duration,
    date,
  });

  res.status(201).json({ success: true, data: workout });
});
const getWorkouts = asyncHandler(async (req, res) => {
  const { category, tag, from, to, page = 1, limit = 10, search } = req.query;

  const query = { user: req.user._id };
  if (category) query.category = category;
  if (tag) query.tags = tag;
  if (from || to) {
    query.date = {};
    if (from) query.date.$gte = new Date(from);
    if (to) query.date.$lte = new Date(to);
  }
  if (search) query.$text = { $search: search };

  const skip = (Number(page) - 1) * Number(limit);

  const [workouts, total] = await Promise.all([
    Workout.find(query).sort({ date: -1 }).skip(skip).limit(Number(limit)),
    Workout.countDocuments(query),
  ]);

  res.status(200).json({
    success: true,
    count: workouts.length,
    total,
    page: Number(page),
    pages: Math.ceil(total / limit),
    data: workouts,
  });
});
const getWorkoutById = asyncHandler(async (req, res) => {
  const workout = await Workout.findOne({ _id: req.params.id, user: req.user._id });
  if (!workout) throw new ApiError(404, 'Workout not found');
  res.status(200).json({ success: true, data: workout });
});
const updateWorkout = asyncHandler(async (req, res) => {
  let workout = await Workout.findOne({ _id: req.params.id, user: req.user._id });
  if (!workout) throw new ApiError(404, 'Workout not found');

  workout = await Workout.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({ success: true, data: workout });
});

// @desc    Delete a workout
// @route   DELETE /api/workouts/:id
// @access  Private
const deleteWorkout = asyncHandler(async (req, res) => {
  const workout = await Workout.findOne({ _id: req.params.id, user: req.user._id });
  if (!workout) throw new ApiError(404, 'Workout not found');

  await workout.deleteOne();
  res.status(200).json({ success: true, message: 'Workout deleted successfully' });
});
const addExercise = asyncHandler(async (req, res) => {
  const workout = await Workout.findOne({ _id: req.params.id, user: req.user._id });
  if (!workout) throw new ApiError(404, 'Workout not found');

  workout.exercises.push(req.body);
  await workout.save();

  res.status(201).json({ success: true, data: workout });
});
const removeExercise = asyncHandler(async (req, res) => {
  const workout = await Workout.findOne({ _id: req.params.id, user: req.user._id });
  if (!workout) throw new ApiError(404, 'Workout not found');

  workout.exercises = workout.exercises.filter(
    (ex) => ex._id.toString() !== req.params.exerciseId
  );
  await workout.save();

  res.status(200).json({ success: true, data: workout });
});

module.exports = {
  createWorkout,
  getWorkouts,
  getWorkoutById,
  updateWorkout,
  deleteWorkout,
  addExercise,
  removeExercise,
};