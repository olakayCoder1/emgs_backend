// src/routes/crm.routes.js
const express = require('express');
const crmController = require('../controllers/crm.controller');
const { authenticate, isAdmin } = require('../middleware/auth.middleware');

const router = express.Router();

// Admin routes
router.get('/inquiries', [authenticate, isAdmin], crmController.getAllInquiries);
router.get('/inquiries/:id', authenticate, crmController.getInquiryById);
router.put('/inquiries/:id', [authenticate, isAdmin], crmController.updateInquiryStatus);
router.post('/inquiries/:id/response', [authenticate, isAdmin], crmController.addInquiryResponse);
router.get('/followups', [authenticate, isAdmin], crmController.getFollowupInquiries);
router.get('/analytics', [authenticate, isAdmin], crmController.getCRMAnalytics);

// User routes
router.get('/user/inquiries', authenticate, crmController.getUserInquiries);

module.exports = router;