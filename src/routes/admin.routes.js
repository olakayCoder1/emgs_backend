// src/routes/admin.routes.js
const express = require('express');
const adminController = require('../controllers/admin.controller');
const { authenticate, isAdmin } = require('../middleware/auth.middleware');

const router = express.Router();

// All routes require admin access
router.use(authenticate, isAdmin);

// Dashboard and analytics
router.get('/dashboard', adminController.getDashboardStats);
router.get('/analytics', adminController.getSystemAnalytics);

// User management
router.get('/users', adminController.getAllUsers);
router.get('/users/:id', adminController.getUserById);
router.put('/users/:id', adminController.updateUser);
router.delete('/users/:id', adminController.deleteUser);

// Payment management
router.get('/payments', adminController.getAllPayments);
router.put('/payments/:id', adminController.updatePaymentStatus);

// Notifications
router.post('/notifications', adminController.sendNotification);

module.exports = router;