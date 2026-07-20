const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    type: {
      type: String,
      enum: ['workout_reminder', 'meal_reminder', 'goal_achieved', 'system', 'follow'],
      required: true,
    },
    message: { type: String, required: true },
    isRead: { type: Boolean, default: false },
    scheduledFor: { type: Date },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

NotificationSchema.index({ user: 1, isRead: 1, createdAt: -1 });

module.exports = mongoose.model('Notification', NotificationSchema);