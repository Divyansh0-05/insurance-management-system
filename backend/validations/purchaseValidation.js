const { body } = require('express-validator')

const createPurchaseValidation = [
  body('insuranceId')
    .isMongoId()
    .withMessage('insuranceId must be a valid Mongo ObjectId.'),
]

module.exports = {
  createPurchaseValidation,
}
