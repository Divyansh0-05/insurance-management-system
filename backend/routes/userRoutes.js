const express = require('express')
const authMiddleware = require('../middleware/authMiddleware')
const validate = require('../middleware/validate')
const upload = require('../middleware/uploadMiddleware')
const { createPurchaseValidation } = require('../validations/purchaseValidation')
const { createClaimValidation } = require('../validations/claimValidation')
const {
  getDashboard,
  getInsurance,
  getInsuranceById,
  purchaseInsurance,
  getPurchases,
  createClaim,
  getClaims,
} = require('../controllers/userController')

const router = express.Router()

router.get('/health', (_req, res) => {
  res.status(200).json({
    success: true,
    message: 'User routes ready.',
    data: null,
  })
})

router.get('/dashboard', authMiddleware, getDashboard)
router.get('/insurance', authMiddleware, getInsurance)
router.get('/insurance/:id', authMiddleware, getInsuranceById)
router.post('/purchase', authMiddleware, createPurchaseValidation, validate, purchaseInsurance)
router.get('/purchases', authMiddleware, getPurchases)
router.post('/claims', authMiddleware, upload.single('document'), createClaimValidation, validate, createClaim)
router.get('/claims', authMiddleware, getClaims)

module.exports = router
