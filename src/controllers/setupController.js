const User = require('../models/User')
const generateToken = require('../utils/generateToken')

// @desc    Check if admin setup is needed
// @route   GET /api/setup/status
// @access  Public
const getSetupStatus = async (req, res, next) => {
  try {
    const adminExists = await User.findOne({ role: 'admin' })
    res.json({
      success: true,
      adminExists: !!adminExists,
      message: adminExists
        ? 'Admin already exists. Setup is complete.'
        : 'No admin found. You can create the first admin.',
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Create the FIRST and ONLY admin (one-time setup)
// @route   POST /api/setup/create-admin
// @access  Public — but only works if NO admin exists yet
const createFirstAdmin = async (req, res, next) => {
  try {
    // Block if admin already exists
    const adminExists = await User.findOne({ role: 'admin' })
    if (adminExists) {
      return res.status(403).json({
        success: false,
        message: 'Admin already exists. This setup endpoint is disabled.',
      })
    }

    const { name, email, password, setupKey } = req.body

    // Optional security key check (set ADMIN_SETUP_KEY in .env)
    if (process.env.ADMIN_SETUP_KEY) {
      if (setupKey !== process.env.ADMIN_SETUP_KEY) {
        return res.status(401).json({
          success: false,
          message: 'Invalid setup key.',
        })
      }
    }

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email and password.',
      })
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters.',
      })
    }

    const emailExists = await User.findOne({ email })
    if (emailExists) {
      return res.status(400).json({
        success: false,
        message: 'Email already registered.',
      })
    }

    const admin = await User.create({
      name,
      email,
      password,
      role: 'admin',
    })

    const token = generateToken(admin._id)

    res.status(201).json({
      success: true,
      message: '✅ Admin created successfully! This endpoint is now permanently disabled.',
      token,
      user: {
        _id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
      },
    })
  } catch (error) {
    next(error)
  }
}

module.exports = { getSetupStatus, createFirstAdmin }
