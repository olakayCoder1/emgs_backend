const mongoose = require('mongoose');
const Quiz = require('../models/quiz.model');

const courseSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: { 
      type: String, 
      enum: ['IELTS', 'CV', 'NCLEX', 'CBT', 'OET', 'OSCE'], 
      required: true 
    },
    thumbnail: { type: String },
    lessons: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Lesson' }],
    quizzes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Quiz' }],
    assignments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Assignment' }],
    enrolledUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    isFree: { type: Boolean, default: false },
    price: { type: Number, default: 0 },
    isPublished: { type: Boolean, default: false },
    ratings: [{
      userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
      rating: { type: Number, required: true, min: 1, max: 5 },
      review: { type: String },
      createdAt: { type: Date, default: Date.now }
    }],
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

const Course = mongoose.model('Course', courseSchema);
module.exports = Course;