// src/controllers/course.controller.js
const Course = require('../models/course.model');
const User = require('../models/user.model');
const Notification = require('../models/notification.model');

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
    
    res.status(200).json(courses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get single course by ID
exports.getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate('lessons')
      .populate('quizzes')
      .populate('assignments');
    
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    
    res.status(200).json(course);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create new course (admin only)
exports.createCourse = async (req, res) => {
  try {
    const { title, description, category, isFree, price } = req.body;
    
    const course = new Course({
      title,
      description,
      category,
      isFree,
      price,
      createdBy: req.user.id,
      isPublished: false
    });
    
    await course.save();
    
    res.status(201).json({
      message: 'Course created successfully',
      courseId: course._id
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
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
      return res.status(404).json({ message: 'Course not found' });
    }
    
    res.status(200).json({
      message: 'Course updated successfully',
      course
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete course (admin only)
exports.deleteCourse = async (req, res) => {
  try {
    const course = await Course.findByIdAndDelete(req.params.id);
    
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    
    res.status(200).json({ message: 'Course deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
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
      return res.status(404).json({ message: 'Course not found' });
    }
    
    // Check if user is already enrolled
    const user = await User.findById(userId);
    if (user.enrolledCourses.includes(courseId)) {
      return res.status(400).json({ message: 'User already enrolled in this course' });
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
    
    res.status(200).json({ message: 'Enrolled in course successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get user's enrolled courses
exports.getUserCourses = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const user = await User.findById(userId)
      .populate('enrolledCourses');
    
    res.status(200).json(user.enrolledCourses);
  } catch (error) {
    res.status(500).json({ message: error.message });
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
    
    res.status(200).json({ message: 'Progress tracked successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};




