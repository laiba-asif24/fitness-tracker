const mongoose = require('mongoose');

const ProgressLogSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    date: { type: Date, default: Date.now },
    weight: { type: Number }, // kg/lb per user preferences.units
    bodyMeasurements: {
      chest: Number,
      waist: Number,
      hips: Number,
      arms: Number,
      thighs: Number,
    },
    // Flexible key-value store for things like runTime, liftingMax, etc.
    performanceMetrics: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    photoUrl: { type: String, default: '' },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

ProgressLogSchema.index({ user: 1, date: -1 });

module.exports = mongoose.model('ProgressLog', ProgressLogSchema);
