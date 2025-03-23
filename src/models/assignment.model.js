const mongoose = require('mongoose');

const assignmentSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    lessonId: { type: mongoose.Schema.Types.ObjectId, ref: 'Lesson', required: false },
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

const Assignment = mongoose.model('Assignment', assignmentSchema);
module.exports = Assignment;