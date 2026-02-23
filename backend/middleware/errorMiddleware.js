function errorHandler(err, _req, res, _next){
  const statusCode = err.statusCode || err.status || 500
  const isProduction = process.env.NODE_ENV === 'production'

  return res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal Server Error',
    ...(isProduction ? {} : { stack: err.stack }),
  })
}

module.exports = errorHandler
