const mongoose = require('mongoose');
const { Schema } = mongoose;

const ReportSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    reportType: {
      type: String,
      enum: ['progress', 'nutrition', 'workout_summary'],
      required: true,
    },
    format: {
      type: String,
      enum: ['pdf', 'csv'],
      required: true,
    },
    dateRange: {
      from: { type: Date, required: true },
      to: { type: Date, required: true },
    },
    fileUrl: {
      type: String, // generated file path/link (pdfkit / json2csv output)
    },
  },
  { timestamps: { createdAt: true, updatedAt: false } } // spec only calls for createdAt
);

ReportSchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model('Report', ReportSchema);
