const User = require('../models/User')
const generateToken = require('../utils/generateToken')

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide name, email and password' })
    }

    const userExists = await User.findOne({ email })
    if (userExists) {
      return res.status(400).json({ success: false, message: 'Email already registered' })
    }

    const user = await User.create({ name, email, password })

    const token = generateToken(user._id)

    res.status(201).json({
      success: true,
      message: 'Account created successfully',
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' })
    }

    // Include password field (it's select: false by default)
    const user = await User.findOne({ email }).select('+password')

    if (!user) {
      console.log(`[LOGIN FAIL] No user found for email: ${email}`)
      return res.status(401).json({ success: false, message: 'Invalid email or password' })
    }

    const isMatch = await user.matchPassword(password)
    if (!isMatch) {
      console.log(`[LOGIN FAIL] Wrong password for email: ${email}`)
      return res.status(401).json({ success: false, message: 'Invalid email or password' })
    }

    if (!user.isActive) {
      return res.status(401).json({ success: false, message: 'Your account has been deactivated' })
    }

    const token = generateToken(user._id)

    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Get current logged-in user
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id)
    res.json({ success: true, user })
  } catch (error) {
    next(error)
  }
}

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
const updateProfile = async (req, res, next) => {
  try {
    const { name, phone, address } = req.body

    const user = await User.findById(req.user._id)
    if (!user) return res.status(404).json({ success: false, message: 'User not found' })

    if (name) user.name = name
    if (phone !== undefined) user.phone = phone
    if (address) user.address = { ...user.address, ...address }

    await user.save()

    res.json({ success: true, message: 'Profile updated', user })
  } catch (error) {
    next(error)
  }
}

// @desc    Change password
// @route   PUT /api/auth/change-password
// @access  Private
const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ success: false, message: 'Please provide current and new password' })
    }

    const user = await User.findById(req.user._id).select('+password')
    if (!(await user.matchPassword(currentPassword))) {
      return res.status(401).json({ success: false, message: 'Current password is incorrect' })
    }

    user.password = newPassword
    await user.save()

    res.json({ success: true, message: 'Password changed successfully' })
  } catch (error) {
    next(error)
  }
}

module.exports = { register, login, getMe, updateProfile, changePassword }
