const mongoose = require('mongoose');

const FeedbackSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    subject: { type: String, required: true, trim: true },
    message: { type: String, required: true },
    status: { type: String, enum: ['open', 'in_progress', 'resolved'], default: 'open' },
  },
  { timestamps: true }
);

FeedbackSchema.index({ user: 1, status: 1 });

module.exports = mongoose.model('Feedback', FeedbackSchema);
