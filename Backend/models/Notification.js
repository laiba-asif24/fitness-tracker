const mongoose = require('mongoose');
const { Schema } = mongoose;

const NotificationSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: [
        'workout_reminder',
        'meal_reminder',
        'goal_achieved',
        'system',
        'follow',
      ],
      required: true,
    },
    message: {
      type: String,
      required: [true, 'Notification message is required'],
      trim: true,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    scheduledFor: {
      type: Date, // used for reminders/alerts (cron/scheduler reads this)
    },
  },
  { timestamps: { createdAt: true, updatedAt: false } } // spec only calls for createdAt
);

// Fast "get my unread notifications, newest first" queries
NotificationSchema.index({ user: 1, isRead: 1, createdAt: -1 });
// Fast lookup for a scheduler job pulling due reminders
NotificationSchema.index({ scheduledFor: 1 });

module.exports = mongoose.model('Notification', NotificationSchema);
