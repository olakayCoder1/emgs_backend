const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    message: { type: String, required: true },
    type: { 
      type: String, 
      enum: ['course', 'service', 'payment', 'system'], 
      default: 'system' 
    },
    isRead: { type: Boolean, default: false },
    relatedItemId: { type: mongoose.Schema.Types.ObjectId }, // Course, Service, etc.
  },
  { timestamps: true }
);

const Notification = mongoose.model('Notification', notificationSchema);
module.exports = Notification;