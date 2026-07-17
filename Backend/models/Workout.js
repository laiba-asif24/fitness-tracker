const mongoose = require('mongoose');
const { Schema } = mongoose;

// 3.1 Exercises — embedded sub-document (no independent lifecycle,
// denormalized on purpose for read speed since they're always queried
// together with their parent workout).
const ExerciseSchema = new Schema(
  {
    exerciseName: {
      type: String,
      required: [true, 'Exercise name is required'],
      trim: true,
    },
    sets: {
      type: Number,
      min: 0,
    },
    reps: {
      type: Number,
      min: 0,
    },
    weight: {
      type: Number, // interpreted in kg/lb per user.preferences.units
      min: 0,
    },
    restTime: {
      type: Number, // seconds
      min: 0,
    },
    notes: {
      type: String,
      trim: true,
    },
  },
  { _id: true } // keep an _id per exercise so the frontend can edit/remove a single one
);

const WorkoutSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Workout title is required'],
      trim: true,
    },
    category: {
      type: String,
      enum: ['strength', 'cardio', 'flexibility', 'other'],
      default: 'other',
    },
    tags: {
      type: [String],
      default: [],
    },
    exercises: {
      type: [ExerciseSchema],
      default: [],
    },
    notes: {
      type: String,
      trim: true,
    },
    duration: {
      type: Number, // minutes
      min: 0,
    },
    date: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true } // adds createdAt & updatedAt
);

// Text index to power the "search workouts by title/tags" requirement
WorkoutSchema.index({ title: 'text', tags: 'text' });

// Common query pattern: a user's workouts sorted by date
WorkoutSchema.index({ user: 1, date: -1 });

module.exports = mongoose.model('Workout', WorkoutSchema);
