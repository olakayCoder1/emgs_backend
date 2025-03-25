const { body, param } = require('express-validator');
const { validateRequest } = require('../middleware/validate-request');

exports.inquiryStatusValidator = [
  body('status').isIn(['new', 'in-progress', 'resolved', 'closed']).withMessage(
      'status is invalid'
    ),
  validateRequest
];
