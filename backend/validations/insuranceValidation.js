const { body } = require('express-validator')

const createInsuranceValidation = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Title is required.'),
  body('premium')
    .isNumeric()
    .withMessage('Premium must be numeric.'),
  body('coverage')
    .isFloat({ gt: 0 })
    .withMessage('Coverage must be greater than 0.'),
  body('duration')
    .isNumeric()
    .withMessage('Duration must be numeric.'),
]

module.exports = {
  createInsuranceValidation,
}
