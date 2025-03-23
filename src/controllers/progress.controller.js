const Progress = require('../models/progress.model');
const Course = require('../models/course.model');
const Lesson = require('../models/lesson.model');
const { 
  successResponse, 
  badRequestResponse, 
  internalServerErrorResponse 
} = require('../utils/custom_response/responses');

// Get user progress for a specific course
exports.getUserCourseProgress = async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.user.id; // Assuming user info is added by authenticate middleware
    
    let progress = await Progress.findOne({ userId, courseId })
      .populate('lastAccessedLesson');
    
    if (!progress) {
      // If no progress record exists, create a new one
      const course = await Course.findById(courseId);
      if (!course) {
        return badRequestResponse('Course not found', 'NOT_FOUND', 404, res);
      }
      
      progress = new Progress({
        userId,
        courseId,
        completedLessons: [],
        isCompleted: false,
        progress: 0
      });
      
      await progress.save();
    }
    
    return successResponse(progress, res);
  } catch (error) {
    return internalServerErrorResponse(error.message, res);
  }
};

// Mark a lesson as completed
exports.markLessonCompleted = async (req, res) => {
  try {
    const { lessonId } = req.params;
    const userId = req.user.id;
    
    // Verify the lesson exists
    const lesson = await Lesson.findById(lessonId);
    if (!lesson) {
      return badRequestResponse('Lesson not found', 'NOT_FOUND', 404, res);
    }
    
    // Find the course for this lesson
    const courseId = lesson.courseId;
    
    // Get or create progress record
    let progress = await Progress.findOne({ userId, courseId });
    
    if (!progress) {
      progress = new Progress({
        userId,
        courseId,
        completedLessons: [lessonId],
        lastAccessedLesson: lessonId
      });
    } else {
      // Add lesson to completed lessons if not already there
      if (!progress.completedLessons.includes(lessonId)) {
        progress.completedLessons.push(lessonId);
      }
      progress.lastAccessedLesson = lessonId;
    }
    
    // Get total lessons for the course to calculate progress percentage
    const course = await Course.findById(courseId).populate('lessons');
    const totalLessons = course.lessons.length;
    
    // Calculate progress percentage
    progress.progress = (progress.completedLessons.length / totalLessons) * 100;
    
    // Check if course is completed (all lessons done)
    if (progress.completedLessons.length === totalLessons) {
      progress.isCompleted = true;
    }
    
    await progress.save();
    
    return successResponse({
      progress
    }, res,200,'Lesson marked as completed');
  } catch (error) {
    return internalServerErrorResponse(error.message, res);
  }
};

// Get all user's course progress
exports.getAllUserProgress = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const progressRecords = await Progress.find({ userId })
      .populate('courseId', 'title thumbnail category')
      .populate('lastAccessedLesson', 'title order');
    
    return successResponse(progressRecords, res);
  } catch (error) {
    return internalServerErrorResponse(error.message, res);
  }
};

// Reset progress for a course
exports.resetCourseProgress = async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.user.id;
    
    await Progress.findOneAndUpdate(
      { userId, courseId },
      {
        completedLessons: [],
        isCompleted: false,
        progress: 0
      },
      { new: true }
    );
    
    return successResponse({
      message: 'Course progress reset successfully'
    }, res);
  } catch (error) {
    return internalServerErrorResponse(error.message, res);
  }
};