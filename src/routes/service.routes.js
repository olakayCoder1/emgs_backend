// src/routes/service.routes.js
const express = require('express');
const serviceController = require('../controllers/service.controller');
const { authenticate, isAdmin } = require('../middleware/auth.middleware');

const router = express.Router();

// Public routes
router.get('/', serviceController.getAllServices);
router.get('/:id', serviceController.getServiceById);
router.get('/category/:category', serviceController.getServicesByCategory);

// Protected routes
router.post('/', [authenticate, isAdmin], serviceController.createService);
router.put('/:id', [authenticate, isAdmin], serviceController.updateService);
router.delete('/:id', [authenticate, isAdmin], serviceController.deleteService);
router.post('/inquiry', authenticate, serviceController.createInquiry);

module.exports = router;