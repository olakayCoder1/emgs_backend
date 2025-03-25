const { body, param } = require('express-validator');
const { validateRequest } = require('../middleware/validate-request');

exports.serviceCreateValidator = [
  body('name').notEmpty().withMessage('name is required'),
  body('description').notEmpty().withMessage('description is required'),
  body('category').isIn([
      'Job Application', 
      'IELTS Masterclass', 
      'Parcel Services', 
      'Flight Booking', 
      'Visa Booking', 
      'Loan Services', 
      'NCLEX Services', 
      'CBT Services', 
      'OET Services', 
      'OSCE Services',
      'Proof of Funds'
    ]).withMessage(
      'category is invalid'
    ),
  body('whatsappContact')
    .notEmpty()
    .withMessage('whatsappContact is required'),
  body('price').isNumeric().default(0),
  body('isActive').isBoolean().default(true),
  validateRequest
];
