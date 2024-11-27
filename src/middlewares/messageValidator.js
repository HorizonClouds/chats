import { body, validationResult } from 'express-validator';
import { ValidationError } from '../utils/customErrors.js';

// Validation middleware for MessageModel
export const validateCreateMessage = [
  body('messageStatus')
    .not()
    .exists()
    .withMessage('messageStatus should not be provided'),
  
  body('shippingDate')
    .not()
    .exists()
    .withMessage('shippingDate should not be provided'),

  body('writerUserId')
    .exists({ checkNull: true })
    .withMessage('writerUserId is required'),
    
  body('receiverUserId')
    .exists({ checkNull: true })
    .withMessage('receiverUserId is required'),

  body('messageContent')
    .exists({ checkNull: true })
    .withMessage('messageContent is required')
    .isLength({ min: 1 })
    .withMessage('messageContent must be at least 1 characters long')
    .isLength({ max: 500 })
    .withMessage('messageContent must be at most 500 characters long'),


  // Middleware to handle validation errors
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      next(new ValidationError('Error found in request body when trying to create message', errors.array()));
    }
    next();
  },
];