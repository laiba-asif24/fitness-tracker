const mongoose = require('mongoose');

// Exercise sub-schema — embedded inside Workout (no independent lifecycle)
const ExerciseSchema = new mongoose.Schema(
  {
    exerciseName: { type: String, required: true },
    sets: { type: Number, default: 0 },
    reps: { type: Number, default: 0 },
    weight: { type: Number, default: 0 }, // in kg/lb per user preferences.units
    restTime: { type: Number, default: 0 }, // seconds
    notes: { type: String, default: '' },
  },
  { _id: true }
);

const WorkoutSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: [true, 'Workout title is required'], trim: true },
    category: {
      type: String,
      enum: ['strength', 'cardio', 'flexibility', 'other'],
      default: 'other',
    },
    tags: [{ type: String, trim: true }],
    exercises: [ExerciseSchema],
    notes: { type: String, default: '' },
    duration: { type: Number, default: 0 }, // minutes
    date: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// Indexes for search & filter (title/tags)
WorkoutSchema.index({ title: 'text', tags: 'text' });
WorkoutSchema.index({ user: 1, date: -1 });

module.exports = mongoose.model('Workout', WorkoutSchema);
