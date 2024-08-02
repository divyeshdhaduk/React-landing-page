const { body } = require('express-validator');

exports.validatePackage = [
    body('name').notEmpty().withMessage('Name is required'),
    body('type').notEmpty().withMessage('Type is required'),
    body('cost').isNumeric().withMessage('Cost must be a number'),
    body('status').notEmpty().withMessage('Status is required'),
    body('isPopuler').isBoolean().withMessage('IsPopuler must be a boolean')
];
