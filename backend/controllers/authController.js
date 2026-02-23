const bcrypt = require('bcryptjs')
const User = require('../models/User')
const generateToken = require('../utils/generateToken')

function ok(res, status, message, data = null){
  return res.status(status).json({ success: true, message, data })
}

function fail(res, status, message){
  return res.status(status).json({ success: false, message })
}

// @desc    Register a new user account
// @route   POST /api/auth/register
// @access  Public
async function register(req, res){
  try {
    const { name, email, password } = req.body

    if(!name || !email || !password){
      return fail(res, 400, 'Name, email and password are required.')
    }

    const existing = await User.findOne({ email: email.toLowerCase() })
    if(existing){
      return fail(res, 400, 'User already exists with this email.')
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: 'user',
    })

    const token = generateToken({ id: user._id, role: user.role })

    return ok(res, 201, 'User registered successfully.', {
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isActive: user.isActive,
        createdAt: user.createdAt,
      },
    })
  } catch (error) {
    return fail(res, 500, error.message || 'Registration failed.')
  }
}

// @desc    Authenticate user and return JWT token
// @route   POST /api/auth/login
// @access  Public
async function login(req, res){
  try {
    const { email, password } = req.body
    if(!email || !password){
      return fail(res, 400, 'Email and password are required.')
    }

    const user = await User.findOne({ email: email.toLowerCase() })
    if(!user){
      return fail(res, 401, 'Invalid credentials.')
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if(!isMatch){
      return fail(res, 401, 'Invalid credentials.')
    }

    if(!user.isActive){
      return fail(res, 403, 'Account is disabled.')
    }

    const token = generateToken({ id: user._id, role: user.role })

    return ok(res, 200, 'Login successful.', {
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isActive: user.isActive,
        createdAt: user.createdAt,
      },
    })
  } catch (error) {
    return fail(res, 500, error.message || 'Login failed.')
  }
}

// @desc    Get currently authenticated user profile
// @route   GET /api/auth/me
// @access  Private
async function me(req, res){
  try {
    return ok(res, 200, 'Profile fetched successfully.', {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role,
      isActive: req.user.isActive,
      createdAt: req.user.createdAt,
    })
  } catch (error) {
    return fail(res, 500, error.message || 'Failed to fetch profile.')
  }
}

module.exports = {
  register,
  login,
  me,
}
