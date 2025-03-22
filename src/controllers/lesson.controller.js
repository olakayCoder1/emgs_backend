// src/controllers/lesson.controller.js
const Lesson = require('../models/lesson.model');
const Course = require('../models/course.model');

// Get lessons for a course
exports.getLessonsForCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    
    const lessons = await Lesson.find({ 
      courseId,
      isPublished: true 
    }).sort({ order: 1 });
    
    res.status(200).json(lessons);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get single lesson
exports.getLessonById = async (req, res) => {
  try {
    const lesson = await Lesson.findById(req.params.id);
    
    if (!lesson) {
      return res.status(404).json({ message: 'Lesson not found' });
    }
    
    res.status(200).json(lesson);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create new lesson (admin only)
exports.createLesson = async (req, res) => {
  try {
    const { title, description, courseId, videoUrl, duration, order, resources } = req.body;
    
    // Check if course exists
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
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
    
    res.status(201).json({
      message: 'Lesson created successfully',
      lessonId: lesson._id
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
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
      return res.status(404).json({ message: 'Lesson not found' });
    }
    
    res.status(200).json({
      message: 'Lesson updated successfully',
      lesson
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete lesson (admin only)
exports.deleteLesson = async (req, res) => {
  try {
    const lesson = await Lesson.findById(req.params.id);
    
    if (!lesson) {
      return res.status(404).json({ message: 'Lesson not found' });
    }
    
    // Remove lesson from course
    await Course.findByIdAndUpdate(
      lesson.courseId,
      { $pull: { lessons: lesson._id } }
    );
    
    await Lesson.findByIdAndDelete(req.params.id);
    
    res.status(200).json({ message: 'Lesson deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
