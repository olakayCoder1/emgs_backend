const mongoose = require('mongoose');

const quizSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    questions: [
      {
        question: { type: String, required: true },
        options: [
          {
            option: { type: String, required: true },
            isCorrect: { type: Boolean, required: true },
          }
        ]
      }
    ],
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  },
  { timestamps: true }
);

// Register the model
const Quiz = mongoose.model('Quiz', quizSchema);

module.exports = Quiz;
