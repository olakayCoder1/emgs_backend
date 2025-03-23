const mongoose = require('mongoose');

const progressSchema = new mongoose.Schema(
  {
    userId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User', 
      required: true 
    },
    courseId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Course', 
      required: true 
    },
    completedLessons: [{ 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Lesson' 
    }],
    isCompleted: { 
      type: Boolean, 
      default: false 
    },
    lastAccessedLesson: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Lesson' 
    },
    progress: { 
      type: Number, 
      default: 0 
    }, // Percentage of course completed
  },
  { timestamps: true }
);

// Create compound index for userId and courseId to ensure uniqueness
progressSchema.index({ userId: 1, courseId: 1 }, { unique: true });

const Progress = mongoose.model('Progress', progressSchema);
module.exports = Progress;