const { body } = require('express-validator')

const createClaimValidation = [
  body('amount')
    .isFloat({ gt: 0 })
    .withMessage('Amount must be greater than 0.'),
  body('description')
    .trim()
    .notEmpty()
    .withMessage('Description is required.'),
]

module.exports = {
  createClaimValidation,
}
