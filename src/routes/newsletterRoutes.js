const express = require('express')
const router = express.Router()
const Newsletter = require('../models/Newsletter')
const { protect, adminOnly } = require('../middleware/auth')

router.post('/', async (req, res, next) => {
  try {
    const { email } = req.body
    if (!email) return res.status(400).json({ success: false, message: 'Email is required' })

    const existing = await Newsletter.findOne({ email: email.toLowerCase().trim() })
    if (existing) {
      if (!existing.isActive) {
        existing.isActive = true
        await existing.save()
      }
      return res.json({ success: true, message: 'Already subscribed' })
    }

    await Newsletter.create({ email })
    res.status(201).json({ success: true, message: 'Subscribed successfully' })
  } catch (error) {
    next(error)
  }
})

router.get('/', protect, adminOnly, async (req, res, next) => {
  try {
    const subscribers = await Newsletter.find({ isActive: true }).sort({ createdAt: -1 })
    res.json({ success: true, count: subscribers.length, subscribers })
  } catch (error) {
    next(error)
  }
})

module.exports = router
