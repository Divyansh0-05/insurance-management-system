const mongoose = require('mongoose')
const Insurance = require('../models/Insurance')
const User = require('../models/User')
const Purchase = require('../models/Purchase')
const Claim = require('../models/Claim')

function ok(res, status, message, data = null){
  return res.status(status).json({ success: true, message, data })
}

function fail(res, status, message){
  return res.status(status).json({ success: false, message })
}

// @desc    Get admin dashboard metrics
// @route   GET /api/admin/dashboard
// @access  Private (Admin)
async function getDashboard(req, res){
  try {
    const [totalUsers, totalPolicies, totalClaims, revenueAgg, claimStatusAgg] = await Promise.all([
      User.countDocuments(),
      Insurance.countDocuments(),
      Claim.aggregate([{ $group: { _id: null, total: { $sum: 1 } } }]),
      Purchase.aggregate([
        {
          $lookup: {
            from: 'insurances',
            localField: 'insurance',
            foreignField: '_id',
            as: 'insurance',
          },
        },
        { $unwind: '$insurance' },
        { $group: { _id: null, revenue: { $sum: '$insurance.premium' } } },
      ]),
      Claim.aggregate([
        {
          $group: {
            _id: '$status',
            count: { $sum: 1 },
          },
        },
      ]),
    ])

    const claimStatus = {
      approved: 0,
      pending: 0,
      rejected: 0,
    }

    for(const item of claimStatusAgg){
      claimStatus[item._id] = item.count
    }

    return ok(res, 200, 'Admin dashboard fetched successfully.', {
      totalUsers,
      totalPolicies,
      totalClaims: totalClaims[0]?.total || 0,
      revenue: revenueAgg[0]?.revenue || 0,
      claimStatus,
    })
  } catch (error) {
    return fail(res, 500, error.message || 'Failed to fetch admin dashboard.')
  }
}

// @desc    Get monthly reports analytics
// @route   GET /api/admin/reports
// @access  Private (Admin)
async function getReports(req, res){
  try {
    const revenueByMonth = await Purchase.aggregate([
      {
        $lookup: {
          from: 'insurances',
          localField: 'insurance',
          foreignField: '_id',
          as: 'insurance',
        },
      },
      { $unwind: '$insurance' },
      {
        $group: {
          _id: { $month: '$createdAt' },
          revenue: { $sum: '$insurance.premium' },
        },
      },
    ])

    const claimsByMonth = await Claim.aggregate([
      {
        $group: {
          _id: { $month: '$createdAt' },
          claims: { $sum: 1 },
        },
      },
    ])

    const monthLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

    const revenueMap = Object.fromEntries(revenueByMonth.map((item) => [item._id, item.revenue]))
    const claimsMap = Object.fromEntries(claimsByMonth.map((item) => [item._id, item.claims]))

    const reports = monthLabels.map((month, index) => {
      const monthNumber = index + 1
      return {
        month,
        revenue: revenueMap[monthNumber] || 0,
        claims: claimsMap[monthNumber] || 0,
      }
    })

    return ok(res, 200, 'Reports fetched successfully.', reports)
  } catch (error) {
    return fail(res, 500, error.message || 'Failed to fetch reports.')
  }
}

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private (Admin)
async function getUsers(req, res){
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 })
    return ok(res, 200, 'Users fetched successfully.', users)
  } catch (error) {
    return fail(res, 500, error.message || 'Failed to fetch users.')
  }
}

// @desc    Get single user with purchase/claim stats
// @route   GET /api/admin/users/:id
// @access  Private (Admin)
async function getUserById(req, res){
  try {
    const { id } = req.params
    if(!mongoose.Types.ObjectId.isValid(id)){
      return fail(res, 400, 'Invalid user id.')
    }

    const user = await User.findById(id).select('-password')
    if(!user){
      return fail(res, 404, 'User not found.')
    }

    const [totalPolicies, totalClaims] = await Promise.all([
      Purchase.countDocuments({ user: user._id }),
      Claim.countDocuments({ userId: user._id }),
    ])

    return ok(res, 200, 'User details fetched successfully.', {
      ...user.toObject(),
      totalPolicies,
      totalClaims,
    })
  } catch (error) {
    return fail(res, 500, error.message || 'Failed to fetch user.')
  }
}

// @desc    Update user role or active status
// @route   PUT /api/admin/users/:id
// @access  Private (Admin)
async function updateUser(req, res){
  try {
    const { id } = req.params
    if(!mongoose.Types.ObjectId.isValid(id)){
      return fail(res, 400, 'Invalid user id.')
    }

    const updates = {}
    if(req.body.role !== undefined){
      updates.role = req.body.role
    }
    if(req.body.isActive !== undefined){
      updates.isActive = req.body.isActive
    }

    const user = await User.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
      fields: { password: 0 },
    })

    if(!user){
      return fail(res, 404, 'User not found.')
    }

    return ok(res, 200, 'User updated successfully.', user)
  } catch (error) {
    return fail(res, 500, error.message || 'Failed to update user.')
  }
}

// @desc    Soft delete user (set isActive=false)
// @route   DELETE /api/admin/users/:id
// @access  Private (Admin)
async function deleteUser(req, res){
  try {
    const { id } = req.params
    if(!mongoose.Types.ObjectId.isValid(id)){
      return fail(res, 400, 'Invalid user id.')
    }

    const user = await User.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true, runValidators: true, fields: { password: 0 } }
    )

    if(!user){
      return fail(res, 404, 'User not found.')
    }

    return ok(res, 200, 'User deactivated successfully.', user)
  } catch (error) {
    return fail(res, 500, error.message || 'Failed to deactivate user.')
  }
}

// @desc    Create a new insurance policy
// @route   POST /api/admin/insurance
// @access  Private (Admin)
async function createInsurance(req, res){
  try {
    const { title, category, coverage, premium, duration, description, status } = req.body

    if(!title || !category || coverage === undefined || premium === undefined || !duration){
      return fail(res, 400, 'title, category, coverage, premium, and duration are required.')
    }

    const insurance = await Insurance.create({
      title,
      category,
      coverage,
      premium,
      duration,
      description: description || '',
      status: status || 'active',
    })

    return ok(res, 201, 'Insurance policy created successfully.', insurance)
  } catch (error) {
    return fail(res, 500, error.message || 'Failed to create insurance.')
  }
}

// @desc    Get all insurance policies
// @route   GET /api/admin/insurance
// @access  Private (Admin)
async function getInsurance(req, res){
  try {
    const items = await Insurance.find().sort({ createdAt: -1 })
    return ok(res, 200, 'Insurance policies fetched successfully.', items)
  } catch (error) {
    return fail(res, 500, error.message || 'Failed to fetch insurance.')
  }
}

// @desc    Update an insurance policy
// @route   PUT /api/admin/insurance/:id
// @access  Private (Admin)
async function updateInsurance(req, res){
  try {
    const { id } = req.params
    const updates = req.body

    const insurance = await Insurance.findByIdAndUpdate(id, updates, { new: true, runValidators: true })

    if(!insurance){
      return fail(res, 404, 'Insurance policy not found.')
    }

    return ok(res, 200, 'Insurance policy updated successfully.', insurance)
  } catch (error) {
    return fail(res, 500, error.message || 'Failed to update insurance.')
  }
}

// @desc    Delete an insurance policy
// @route   DELETE /api/admin/insurance/:id
// @access  Private (Admin)
async function deleteInsurance(req, res){
  try {
    const { id } = req.params
    const insurance = await Insurance.findByIdAndDelete(id)

    if(!insurance){
      return fail(res, 404, 'Insurance policy not found.')
    }

    return ok(res, 200, 'Insurance policy deleted.')
  } catch (error) {
    return fail(res, 500, error.message || 'Failed to delete insurance.')
  }
}

// @desc    Get all submitted claims
// @route   GET /api/admin/claims
// @access  Private (Admin)
async function getClaims(req, res){
  try {
    const claims = await Claim.find()
      .populate('userId', '-password')
      .populate('insuranceId')
      .sort({ createdAt: -1 })

    return ok(res, 200, 'Claims fetched successfully.', claims)
  } catch (error) {
    return fail(res, 500, error.message || 'Failed to fetch claims.')
  }
}

// @desc    Approve a claim
// @route   PUT /api/admin/claims/:id/approve
// @access  Private (Admin)
async function approveClaim(req, res){
  try {
    const { id } = req.params
    if(!mongoose.Types.ObjectId.isValid(id)){
      return fail(res, 400, 'Invalid claim id.')
    }

    const claim = await Claim.findByIdAndUpdate(
      id,
      { status: 'approved', adminRemarks: '' },
      { new: true, runValidators: true }
    )
      .populate('userId', '-password')
      .populate('insuranceId')

    if(!claim){
      return fail(res, 404, 'Claim not found.')
    }

    return ok(res, 200, 'Claim approved successfully.', claim)
  } catch (error) {
    return fail(res, 500, error.message || 'Failed to approve claim.')
  }
}

// @desc    Reject a claim with remarks
// @route   PUT /api/admin/claims/:id/reject
// @access  Private (Admin)
async function rejectClaim(req, res){
  try {
    const { id } = req.params
    const { adminRemarks } = req.body

    if(!mongoose.Types.ObjectId.isValid(id)){
      return fail(res, 400, 'Invalid claim id.')
    }

    if(!adminRemarks || !String(adminRemarks).trim()){
      return fail(res, 400, 'adminRemarks is required for rejection.')
    }

    const claim = await Claim.findByIdAndUpdate(
      id,
      { status: 'rejected', adminRemarks: String(adminRemarks).trim() },
      { new: true, runValidators: true }
    )
      .populate('userId', '-password')
      .populate('insuranceId')

    if(!claim){
      return fail(res, 404, 'Claim not found.')
    }

    return ok(res, 200, 'Claim rejected successfully.', claim)
  } catch (error) {
    return fail(res, 500, error.message || 'Failed to reject claim.')
  }
}

module.exports = {
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
}
