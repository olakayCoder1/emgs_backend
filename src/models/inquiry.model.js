const mongoose = require('mongoose');

const inquirySchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    userName: { type: String, required: true },
    userEmail: { type: String, required: true },
    userPhone: { type: String },
    serviceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Service' },
    serviceName: { type: String, required: true },
    message: { type: String, required: false },
    status: { 
      type: String, 
      enum: ['new', 'in-progress', 'resolved', 'closed'], 
      default: 'new' 
    },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    whatsappThreadId: { type: String }, // To track WhatsApp conversation
    responseTime: { type: Number }, // Time to respond in minutes
    followupNeeded: { type: Boolean, default: false },
    followupDate: { type: Date },
  },
  { timestamps: true }
);

const Inquiry = mongoose.model('Inquiry', inquirySchema);
module.exports = Inquiry;