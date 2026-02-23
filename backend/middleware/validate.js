const { validationResult } = require('express-validator')

function validate(req, res, next){
  const errors = validationResult(req)
  if(!errors.isEmpty()){
    const mappedErrors = errors.array().map((item) => ({
      field: item.path,
      message: item.msg,
    }))
    return res.status(400).json({
      success: false,
      message: mappedErrors[0]?.message || 'Validation error',
      errors: mappedErrors,
    })
  }

  return next()
}

module.exports = validate
