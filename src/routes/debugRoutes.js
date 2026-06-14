const express = require('express')
const router = express.Router()
const User = require('../models/User')

router.get('/check-admin', async (req, res) => {
  try {
    const admin = await User.findOne({ role: 'admin' }).select('+password')
    if (!admin) {
      return res.json({ exists: false, message: 'No admin user found' })
    }

    const { password, ...safe } = admin.toObject()

    res.json({
      exists: true,
      name: safe.name,
      email: safe.email,
      role: safe.role,
      isActive: safe.isActive,
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

module.exports = router
