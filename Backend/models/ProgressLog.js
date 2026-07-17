const mongoose = require('mongoose');
const { Schema } = mongoose;

const ProgressLogSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    date: {
      type: Date,
      required: true,
      default: Date.now,
    },
    weight: {
      type: Number, // kg/lb per user.preferences.units
      min: 0,
    },
    bodyMeasurements: {
      chest: { type: Number, min: 0 },
      waist: { type: Number, min: 0 },
      hips: { type: Number, min: 0 },
      arms: { type: Number, min: 0 },
      thighs: { type: Number, min: 0 },
    },
    // Flexible key-value bucket for things like runTime, liftingMax, etc.
    // Kept as Mixed since metric names/units vary per user and per sport.
    performanceMetrics: {
      type: Schema.Types.Mixed,
      default: {},
    },
    photoUrl: {
      type: String,
      default: '',
    },
  },
  { timestamps: { createdAt: true, updatedAt: false } } // spec only calls for createdAt
);

// Powers Dashboard/Analytics time-series queries (weight trend, lift trend, etc.)
ProgressLogSchema.index({ user: 1, date: -1 });

module.exports = mongoose.model('ProgressLog', ProgressLogSchema);
