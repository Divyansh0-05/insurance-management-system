const express = require('express')
const authMiddleware = require('../middleware/authMiddleware')
const roleMiddleware = require('../middleware/roleMiddleware')
const validate = require('../middleware/validate')
const { createInsuranceValidation } = require('../validations/insuranceValidation')
const {
  getDashboard,
  getReports,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  createInsurance,
  getInsurance,
  updateInsurance,
  deleteInsurance,
  getClaims,
  approveClaim,
  rejectClaim,
} = require('../controllers/adminController')

const router = express.Router()

router.get('/health', (_req, res) => {
  res.status(200).json({
    success: true,
    message: 'Admin routes ready.',
    data: null,
  })
})

router.get('/dashboard', authMiddleware, roleMiddleware, getDashboard)
router.get('/reports', authMiddleware, roleMiddleware, getReports)
router.get('/users', authMiddleware, roleMiddleware, getUsers)
router.get('/users/:id', authMiddleware, roleMiddleware, getUserById)
router.put('/users/:id', authMiddleware, roleMiddleware, updateUser)
router.delete('/users/:id', authMiddleware, roleMiddleware, deleteUser)

router.post('/insurance', authMiddleware, roleMiddleware, createInsuranceValidation, validate, createInsurance)
router.get('/insurance', authMiddleware, roleMiddleware, getInsurance)
router.put('/insurance/:id', authMiddleware, roleMiddleware, updateInsurance)
router.delete('/insurance/:id', authMiddleware, roleMiddleware, deleteInsurance)
router.get('/claims', authMiddleware, roleMiddleware, getClaims)
router.put('/claims/:id/approve', authMiddleware, roleMiddleware, approveClaim)
router.put('/claims/:id/reject', authMiddleware, roleMiddleware, rejectClaim)

module.exports = router
