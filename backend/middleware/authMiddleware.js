const jwt = require('jsonwebtoken')
const User = require('../models/User')

async function authMiddleware(req, res, next){
  try {
    const authHeader = req.headers.authorization || ''
    const [scheme, token] = authHeader.split(' ')

    if(scheme !== 'Bearer' || !token){
      return res.status(401).json({ success: false, message: 'Unauthorized: token missing.' })
    }

    const secret = process.env.JWT_SECRET
    if(!secret){
      return res.status(500).json({ success: false, message: 'JWT configuration missing.' })
    }

    const decoded = jwt.verify(token, secret)
    const user = await User.findById(decoded.id).select('-password')

    if(!user || !user.isActive){
      return res.status(401).json({ success: false, message: 'Unauthorized: invalid user.' })
    }

    req.user = user
    next()
  } catch (_error) {
    return res.status(401).json({ success: false, message: 'Unauthorized: invalid token.' })
  }
}

module.exports = authMiddleware
