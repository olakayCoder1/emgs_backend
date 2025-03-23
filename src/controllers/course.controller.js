const Course = require('../models/course.model');
const User = require('../models/user.model');
const Notification = require('../models/notification.model');
const { successResponse, errorResponse, badRequestResponse } = require('../utils/custom_response/responses');


// Get all courses
exports.getAllCourses = async (req, res) => {
  try {
    const { category } = req.query;
    
    let query = { isPublished: true };
    
    // Filter by category if provided
    if (category) {
      query.category = category;
    }
    
    const courses = await Course.find(query)
      .select('title description category thumbnail isFree price')
      .sort({ createdAt: -1 });
    
    return successResponse(courses, res);
  } catch (error) {
    return errorResponse(error.message, 'INTERNAL_SERVER_ERROR', 500, res);
  }
};

// Get single course by ID
exports.getCourseById = async (req, res) => {
  try {
    console.log(req.params.id)
    console.log(req.params.id)
    console.log(req.params.id)
    console.log(req.params.id)
    const course = await Course.findById(req.params.id)
      .populate('lessons')
      .populate('quizzes')
      // .populate('assignments');
    
    if (!course) {
      return badRequestResponse('Course not found', 'NOT_FOUND', 404, res);
    }
    
    return successResponse(course, res);
  } catch (error) {
    return errorResponse(error.message, 'INTERNAL_SERVER_ERROR', 500, res);
  }
};

// Create new course (admin only)
exports.createCourse = async (req, res) => {
  try {
    const { title, description, category, isFree, price, isPublished } = req.body;
    
    const course = new Course({
      title,
      description,
      category,
      isFree,
      price,
      createdBy: req.user.id,
      isPublished: isPublished || false,
    });
    
    await course.save();
    
    return successResponse({
      message: 'Course created successfully',
      courseId: course._id
    }, res, 201);
  } catch (error) {
    return errorResponse(error.message, 'INTERNAL_SERVER_ERROR', 500, res);
  }
};

// Update course (admin only)
exports.updateCourse = async (req, res) => {
  try {
    const { title, description, category, isFree, price, isPublished } = req.body;
    
    const course = await Course.findByIdAndUpdate(
      req.params.id,
      {
        title,
        description,
        category,
        isFree,
        price,
        isPublished
      },
      { new: true }
    );
    
    if (!course) {
      return badRequestResponse('Course not found', 'NOT_FOUND', 404, res);
    }
    
    return successResponse({
      message: 'Course updated successfully',
      course
    }, res);
  } catch (error) {
    return errorResponse(error.message, 'INTERNAL_SERVER_ERROR', 500, res);
  }
};

// Delete course (admin only)
exports.deleteCourse = async (req, res) => {
  try {
    const course = await Course.findByIdAndDelete(req.params.id);
    
    if (!course) {
      return badRequestResponse('Course not found', 'NOT_FOUND', 404, res);
    }
    
    return successResponse({ message: 'Course deleted successfully' }, res);
  } catch (error) {
    return errorResponse(error.message, 'INTERNAL_SERVER_ERROR', 500, res);
  }
};

// Enroll user in course
exports.enrollInCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.user.id;
    
    // Find course
    const course = await Course.findById(courseId);
    if (!course) {
      return badRequestResponse('Course not found', 'NOT_FOUND', 404, res);
    }
    
    // Check if user is already enrolled
    const user = await User.findById(userId);
    if (user.enrolledCourses.includes(courseId)) {
      return badRequestResponse('User already enrolled in this course', 'BAD_REQUEST', 400, res);
    }
    
    // Check if course is free or payment has been made
    if (!course.isFree) {
      // You would check payment status here
      // For now, just allow enrollment
    }
    
    // Update user and course
    await User.findByIdAndUpdate(
      userId,
      { $push: { enrolledCourses: courseId } }
    );
    
    await Course.findByIdAndUpdate(
      courseId,
      { $push: { enrolledUsers: userId } }
    );
    
    // Create notification
    const notification = new Notification({
      userId,
      title: 'Course Enrollment',
      message: `You have successfully enrolled in ${course.title}`,
      type: 'course',
      relatedItemId: courseId
    });
    
    await notification.save();
    
    return successResponse({ message: 'Enrolled in course successfully' }, res);
  } catch (error) {
    return errorResponse(error.message, 'INTERNAL_SERVER_ERROR', 500, res);
  }
};

// Get user's enrolled courses
exports.getUserCourses = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const user = await User.findById(userId)
      .populate('enrolledCourses');
    
    return successResponse(user.enrolledCourses, res);
  } catch (error) {
    return errorResponse(error.message, 'INTERNAL_SERVER_ERROR', 500, res);
  }
};

// Track course progress
exports.trackProgress = async (req, res) => {
  try {
    const { lessonId } = req.params;
    const userId = req.user.id;
    
    // Add lesson to completed lessons
    await User.findByIdAndUpdate(
      userId,
      { $addToSet: { completedLessons: lessonId } }
    );
    
    return successResponse({ message: 'Progress tracked successfully' }, res);
  } catch (error) {
    return errorResponse(error.message, 'INTERNAL_SERVER_ERROR', 500, res);
  }
};