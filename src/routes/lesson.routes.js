// src/routes/lesson.routes.js
const express = require('express');
const lessonController = require('../controllers/lesson.controller');
const { authenticate, isAdmin } = require('../middleware/auth.middleware');

const router = express.Router();

// Public routes
router.get('/course/:courseId', lessonController.getLessonsForCourse);
router.get('/:id', lessonController.getLessonById);

// Protected routes
router.post('/', [authenticate, isAdmin], lessonController.createLesson);
router.put('/:id', [authenticate, isAdmin], lessonController.updateLesson);
router.delete('/:id', [authenticate, isAdmin], lessonController.deleteLesson);

module.exports = router;