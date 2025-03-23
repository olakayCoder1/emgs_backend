const Lesson = require('../models/lesson.model');
const Course = require('../models/course.model');
const { 
  successResponse, 
  badRequestResponse, 
  internalServerErrorResponse 
} = require('../utils/custom_response/responses');

// Get lessons for a course
exports.getLessonsForCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    
    const lessons = await Lesson.find({ 
      courseId,
      isPublished: true 
    }).sort({ order: 1 });
    
    return successResponse(lessons, res);
  } catch (error) {
    return internalServerErrorResponse(error.message, res);
  }
};

// Get single lesson
exports.getLessonById = async (req, res) => {
  try {
    const lesson = await Lesson.findById(req.params.id);
    
    if (!lesson) {
      return badRequestResponse('Lesson not found', 'NOT_FOUND', 404, res);
    }
    
    return successResponse(lesson, res);
  } catch (error) {
    return internalServerErrorResponse(error.message, res);
  }
};

// Create new lesson (admin only)
exports.createLesson = async (req, res) => {
  try {
    const { title, description, courseId, videoUrl, duration, order, resources } = req.body;
    
    // Check if course exists
    const course = await Course.findById(courseId);
    if (!course) {
      return badRequestResponse('Course not found', 'NOT_FOUND', 404, res);
    }
    
    const lesson = new Lesson({
      title,
      description,
      courseId,
      videoUrl,
      duration,
      order,
      resources,
      isPublished: false
    });
    
    await lesson.save();
    
    // Add lesson to course
    await Course.findByIdAndUpdate(
      courseId,
      { $push: { lessons: lesson._id } }
    );
    
    return successResponse({
      message: 'Lesson created successfully',
      lessonId: lesson._id
    }, res, 201);
  } catch (error) {
    return internalServerErrorResponse(error.message, res);
  }
};

// Update lesson (admin only)
exports.updateLesson = async (req, res) => {
  try {
    const { title, description, videoUrl, duration, order, resources, isPublished } = req.body;
    
    const lesson = await Lesson.findByIdAndUpdate(
      req.params.id,
      {
        title,
        description,
        videoUrl,
        duration,
        order,
        resources,
        isPublished
      },
      { new: true }
    );
    
    if (!lesson) {
      return badRequestResponse('Lesson not found', 'NOT_FOUND', 404, res);
    }
    
    return successResponse({ lesson }, res, 200,
      'Lesson updated successfully'
    );
  } catch (error) {
    return internalServerErrorResponse(error.message, res);
  }
};

// Delete lesson (admin only)
exports.deleteLesson = async (req, res) => {
  try {
    const lesson = await Lesson.findById(req.params.id);
    
    if (!lesson) {
      return badRequestResponse('Lesson not found', 'NOT_FOUND', 404, res);
    }
    
    // Remove lesson from course
    await Course.findByIdAndUpdate(
      lesson.courseId,
      { $pull: { lessons: lesson._id } }
    );
    
    await Lesson.findByIdAndDelete(req.params.id);
    
    return successResponse(null, res,204,'Lesson deleted successfully');
  } catch (error) {
    return internalServerErrorResponse(error.message, res);
  }
};