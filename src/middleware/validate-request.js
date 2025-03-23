const { validationResult } = require('express-validator');
const { badRequestResponse } = require('../utils/custom_response/responses');

// exports.validateRequest = (req, res, next) => {
//   const errors = validationResult(req);
  
//   if (!errors.isEmpty()) {
//     const errorMessages = errors.array().map(error => error.msg);
//     return badRequestResponse(errorMessages, 'VALIDATION_ERROR', 400, res);
//   }
  
//   next();
// };


// Custom validation middleware
exports.validateRequest = (req, res, next) => {
  // Get validation errors
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    // Transform errors into a key-value format
    const formattedErrors = errors.array().reduce((acc, error) => {
      // Only add errors where the field name (error.param) is defined
      console.log(error) 
      if (error.path) {
        acc[error.path] = error.msg;
      }
      return acc;
    }, {});

    // // If we have no valid errors (in case of undefined), send a generic error
    // if (Object.keys(formattedErrors).length === 0) {
    //   formattedErrors['general'] = 'Invalid value';
    // }

    // Return a structured error response
    return res.status(400).json({
      status: false,
      group: 'VALIDATION_ERROR',
      errors: formattedErrors,
      message: 'Validation failed for one or more fields',
    });
  }

  // Proceed if no errors
  next();
};


