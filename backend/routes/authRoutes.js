const express = require('express')
const { register, login, me } = require('../controllers/authController')
const authMiddleware = require('../middleware/authMiddleware')
const validate = require('../middleware/validate')
const { registerValidation, loginValidation } = require('../validations/authValidation')

const router = express.Router()

router.post('/register', registerValidation, validate, register)
router.post('/login', loginValidation, validate, login)
router.get('/me', authMiddleware, me)

module.exports = router
