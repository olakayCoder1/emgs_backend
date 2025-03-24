const { body, validationResult } = require('express-validator');
const { badRequestResponse } = require('../utils/custom_response/responses');


const faqValidator = [
  body('question')
    .trim()
    .notEmpty()
    .withMessage('Question is required')
    .isLength({ min: 10, max: 200 })
    .withMessage('Question must be between 10 and 200 characters'),
  
  body('answer')
    .trim()
    .notEmpty()
    .withMessage('Answer is required')
    .isLength({ min: 10, max: 2000 })
    .withMessage('Answer must be between 10 and 2000 characters'),
  
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return badRequestResponse(
        'Validation failed',
        'VALIDATION_ERROR',
        400,
        res,
        errors.array()
      );
    }
    next();
  }
];

module.exports = {
  faqValidator
};