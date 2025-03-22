// src/routes/course.routes.js
const express = require('express');
const courseController = require('../controllers/course.controller');
const { authenticate, isAdmin } = require('../middleware/auth.middleware');

const router = express.Router();

// Public routes
router.get('/', courseController.getAllCourses);
router.get('/:id', courseController.getCourseById);

// Protected routes
router.post('/', [authenticate, isAdmin], courseController.createCourse);
router.put('/:id', [authenticate, isAdmin], courseController.updateCourse);
router.delete('/:id', [authenticate, isAdmin], courseController.deleteCourse);
router.post('/:courseId/enroll', authenticate, courseController.enrollInCourse);
router.get('/user/enrolled', authenticate, courseController.getUserCourses);
router.post('/lesson/:lessonId/progress', authenticate, courseController.trackProgress);

module.exports = router;