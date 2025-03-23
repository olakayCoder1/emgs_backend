const { body, param } = require('express-validator');
const { validateRequest } = require('../middleware/validate-request');

exports.createCourseValidator = [
  body('title').notEmpty().withMessage(
    'Title is required'
  ),
  body('description').notEmpty().withMessage(
    'Description is required'
  ),
  body('category')
    .notEmpty()
    .withMessage(
      'Category is required'
    ),
  body('isFree').isBoolean().default(true),
  body('isPublished').isBoolean().default(true),
  body('price').isNumeric().default(0),
  validateRequest
];

