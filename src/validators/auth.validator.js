const { body, param } = require('express-validator');
const { validateRequest } = require('../middleware/validate-request');

exports.registerValidator = [
  body('fullName').notEmpty().withMessage('Full name is required'),
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  body('phone').optional().isMobilePhone().withMessage('Please provide a valid phone number'),
  validateRequest
];

exports.loginValidator = [
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password').notEmpty().withMessage('Password is required'),
  validateRequest
];

exports.forgotPasswordValidator = [
  body('email').isEmail().withMessage('Please provide a valid email'),
  validateRequest
];

exports.resetPasswordValidator = [
  param('token').notEmpty().withMessage('Token is required'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('New password must be at least 6 characters long'),
  validateRequest
];