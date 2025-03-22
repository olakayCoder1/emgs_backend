const mongoose = require('mongoose');

const certificateSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    issueDate: { type: Date, default: Date.now },
    certificateNumber: { type: String, required: true, unique: true },
    certificateUrl: { type: String }, // PDF link
  },
  { timestamps: true }
);

const Certificate = mongoose.model('Certificate', certificateSchema);
module.exports = Certificate;