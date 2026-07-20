const mongoose = require('mongoose');

const ReportSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    reportType: {
      type: String,
      enum: ['progress', 'nutrition', 'workout_summary'],
      required: true,
    },
    format: { type: String, enum: ['pdf', 'csv'], required: true },
    dateRange: {
      from: { type: Date, required: true },
      to: { type: Date, required: true },
    },
    fileUrl: { type: String, required: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

ReportSchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model('Report', ReportSchema);