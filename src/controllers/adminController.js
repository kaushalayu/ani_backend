const User = require('../models/User')

// @desc    Get all users (Admin)
// @route   GET /api/admin/users
// @access  Admin
const getAllUsers = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, search } = req.query
    const query = {}

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ]
    }

    const skip = (Number(page) - 1) * Number(limit)
    const total = await User.countDocuments(query)

    const users = await User.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit))

    res.json({ success: true, total, users })
  } catch (error) {
    next(error)
  }
}

// @desc    Get single user (Admin)
// @route   GET /api/admin/users/:id
// @access  Admin
const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id)
    if (!user) return res.status(404).json({ success: false, message: 'User not found' })
    res.json({ success: true, user })
  } catch (error) {
    next(error)
  }
}

// @desc    Update user role / status (Admin)
// @route   PUT /api/admin/users/:id
// @access  Admin
const updateUser = async (req, res, next) => {
  try {
    const { role, isActive } = req.body

    const user = await User.findById(req.params.id)
    if (!user) return res.status(404).json({ success: false, message: 'User not found' })

    // Prevent admin from changing their own role/status
    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({ success: false, message: 'Cannot modify your own account here' })
    }

    if (role !== undefined) user.role = role
    if (isActive !== undefined) user.isActive = isActive

    await user.save()

    res.json({ success: true, message: 'User updated', user })
  } catch (error) {
    next(error)
  }
}

// @desc    Delete user (Admin)
// @route   DELETE /api/admin/users/:id
// @access  Admin
const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id)
    if (!user) return res.status(404).json({ success: false, message: 'User not found' })

    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({ success: false, message: 'Cannot delete your own account' })
    }

    await User.findByIdAndDelete(req.params.id)
    res.json({ success: true, message: 'User deleted' })
  } catch (error) {
    next(error)
  }
}

module.exports = { getAllUsers, getUser, updateUser, deleteUser }
