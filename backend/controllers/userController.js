const mongoose = require('mongoose')
const path = require('path')
const Insurance = require('../models/Insurance')
const Purchase = require('../models/Purchase')
const Claim = require('../models/Claim')

function ok(res, status, message, data = null){
  return res.status(status).json({ success: true, message, data })
}

function fail(res, status, message){
  return res.status(status).json({ success: false, message })
}

// @desc    Get user dashboard metrics
// @route   GET /api/user/dashboard
// @access  Private (User/Admin Authenticated)
async function getDashboard(req, res){
  try {
    const [purchaseCountAgg, claimCountAgg, coverageAgg] = await Promise.all([
      Purchase.aggregate([
        { $match: { user: req.user._id } },
        { $group: { _id: null, total: { $sum: 1 } } },
      ]),
      Claim.aggregate([
        { $match: { userId: req.user._id } },
        { $group: { _id: null, total: { $sum: 1 } } },
      ]),
      Purchase.aggregate([
        { $match: { user: req.user._id } },
        {
          $lookup: {
            from: 'insurances',
            localField: 'insurance',
            foreignField: '_id',
            as: 'insurance',
          },
        },
        { $unwind: '$insurance' },
        { $group: { _id: null, totalCoverage: { $sum: '$insurance.coverage' } } },
      ]),
    ])

    return ok(res, 200, 'User dashboard fetched successfully.', {
      totalPurchases: purchaseCountAgg[0]?.total || 0,
      totalClaims: claimCountAgg[0]?.total || 0,
      totalCoverage: coverageAgg[0]?.totalCoverage || 0,
    })
  } catch (error) {
    return fail(res, 500, error.message || 'Failed to fetch user dashboard.')
  }
}

function calculateEndDate(startDate, durationText){
  const endDate = new Date(startDate)
  const duration = String(durationText || '').toLowerCase().trim()

  const match = duration.match(/(\d+)\s*(year|years|month|months)/)
  if(match){
    const value = Number(match[1])
    const unit = match[2]
    if(unit.startsWith('year')){
      endDate.setFullYear(endDate.getFullYear() + value)
      return endDate
    }
    endDate.setMonth(endDate.getMonth() + value)
    return endDate
  }

  // Fallback: if duration format is unexpected, default to 12 months.
  endDate.setMonth(endDate.getMonth() + 12)
  return endDate
}

function activePolicyFilter(extra = {}){
  return {
    ...extra,
    // Treat only explicit "disabled" as hidden to support legacy status values.
    status: { $ne: 'disabled' },
  }
}

// @desc    Get all active insurance policies
// @route   GET /api/user/insurance
// @access  Private (User/Admin Authenticated)
async function getInsurance(req, res){
  try {
    const policies = await Insurance.find(activePolicyFilter()).sort({ createdAt: -1 })
    return ok(res, 200, 'Policies fetched successfully.', policies)
  } catch (error) {
    return fail(res, 500, error.message || 'Failed to fetch policies.')
  }
}

// @desc    Get single active insurance policy by id
// @route   GET /api/user/insurance/:id
// @access  Private (User/Admin Authenticated)
async function getInsuranceById(req, res){
  try {
    const { id } = req.params
    if(!mongoose.Types.ObjectId.isValid(id)){
      return fail(res, 400, 'Invalid insurance id.')
    }

    const policy = await Insurance.findOne(activePolicyFilter({ _id: id }))
    if(!policy){
      return fail(res, 404, 'Active insurance policy not found.')
    }

    return ok(res, 200, 'Policy fetched successfully.', policy)
  } catch (error) {
    return fail(res, 500, error.message || 'Failed to fetch policy.')
  }
}

// @desc    Purchase an insurance policy
// @route   POST /api/user/purchase
// @access  Private (User/Admin Authenticated)
async function purchaseInsurance(req, res){
  try {
    const insuranceId = req.body.insuranceId || req.body.policyId || req.body.id

    if(!insuranceId || !mongoose.Types.ObjectId.isValid(insuranceId)){
      return fail(res, 400, 'Valid insuranceId is required.')
    }

    const insurance = await Insurance.findOne(activePolicyFilter({ _id: insuranceId }))
    if(!insurance){
      return fail(res, 404, 'Active insurance policy not found.')
    }

    const existingPurchase = await Purchase.findOne({
      user: req.user._id,
      insurance: insuranceId,
      status: 'active',
    })

    if(existingPurchase){
      return fail(res, 400, 'Policy already purchased and active.')
    }

    const startDate = new Date()
    const endDate = calculateEndDate(startDate, insurance.duration)

    const purchase = await Purchase.create({
      user: req.user._id,
      insurance: insuranceId,
      startDate,
      endDate,
      status: 'active',
    })

    const populated = await Purchase.findById(purchase._id)
      .populate('insurance')
      .populate('user', '-password')

    return ok(res, 201, 'Policy purchased successfully.', populated)
  } catch (error) {
    return fail(res, 500, error.message || 'Failed to purchase policy.')
  }
}

// @desc    Get all purchases for logged-in user
// @route   GET /api/user/purchases
// @access  Private (User/Admin Authenticated)
async function getPurchases(req, res){
  try {
    const purchases = await Purchase.find({ user: req.user._id })
      .populate('insurance')
      .sort({ createdAt: -1 })

    return ok(res, 200, 'Purchases fetched successfully.', purchases)
  } catch (error) {
    return fail(res, 500, error.message || 'Failed to fetch purchases.')
  }
}

// @desc    Create a new claim for a purchased policy
// @route   POST /api/user/claims
// @access  Private (User/Admin Authenticated)
async function createClaim(req, res){
  try {
    const { insuranceId, amount, description } = req.body

    if(!insuranceId || !mongoose.Types.ObjectId.isValid(insuranceId)){
      return fail(res, 400, 'Valid insuranceId is required.')
    }

    if(amount === undefined || Number(amount) <= 0){
      return fail(res, 400, 'Valid claim amount is required.')
    }

    const purchase = await Purchase.findOne({
      user: req.user._id,
      insurance: insuranceId,
      status: 'active',
    })

    if(!purchase){
      return fail(res, 400, 'You can only claim for purchased policies.')
    }

    const documentPath = req.file ? `/uploads/claims/${path.basename(req.file.path)}` : ''

    const claim = await Claim.create({
      userId: req.user._id,
      insuranceId,
      amount: Number(amount),
      description: description || '',
      documents: documentPath,
      status: 'pending',
      adminRemarks: '',
    })

    const populated = await Claim.findById(claim._id)
      .populate('insuranceId')
      .populate('userId', '-password')

    return ok(res, 201, 'Claim created successfully.', populated)
  } catch (error) {
    return fail(res, 500, error.message || 'Failed to create claim.')
  }
}

// @desc    Get all claims for logged-in user
// @route   GET /api/user/claims
// @access  Private (User/Admin Authenticated)
async function getClaims(req, res){
  try {
    const claims = await Claim.find({ userId: req.user._id })
      .populate('insuranceId')
      .sort({ createdAt: -1 })

    return ok(res, 200, 'Claims fetched successfully.', claims)
  } catch (error) {
    return fail(res, 500, error.message || 'Failed to fetch claims.')
  }
}

module.exports = {
  getDashboard,
  getInsurance,
  getInsuranceById,
  purchaseInsurance,
  getPurchases,
  createClaim,
  getClaims,
}
