const express = require('express')
const router = express.Router()
const Lead = require('../models/Lead')
const { protect, adminOnly } = require('../middleware/auth')

router.post('/', async (req, res, next) => {
  try {
    const { name, mobile, email, source } = req.body
    if (!name || !mobile) {
      return res.status(400).json({ success: false, message: 'Name and mobile number are required' })
    }

    await Lead.create({ name, mobile, email, source })
    res.status(201).json({ success: true, message: 'Thank you! We will contact you soon.' })
  } catch (error) {
    next(error)
  }
})

router.get('/', protect, adminOnly, async (req, res, next) => {
  try {
    const leads = await Lead.find().sort({ createdAt: -1 })
    res.json({ success: true, count: leads.length, leads })
  } catch (error) {
    next(error)
  }
})

router.get('/:id', protect, adminOnly, async (req, res, next) => {
  try {
    const lead = await Lead.findById(req.params.id)
    if (!lead) return res.status(404).json({ success: false, message: 'Lead not found' })
    res.json({ success: true, lead })
  } catch (error) {
    next(error)
  }
})

router.put('/:id', protect, adminOnly, async (req, res, next) => {
  try {
    const { isRead, isStarred, notes } = req.body
    const lead = await Lead.findById(req.params.id)
    if (!lead) return res.status(404).json({ success: false, message: 'Lead not found' })

    if (isRead !== undefined) lead.isRead = isRead
    if (isStarred !== undefined) lead.isStarred = isStarred
    if (notes !== undefined) lead.notes = notes

    await lead.save()
    res.json({ success: true, message: 'Lead updated', lead })
  } catch (error) {
    next(error)
  }
})

router.delete('/:id', protect, adminOnly, async (req, res, next) => {
  try {
    const lead = await Lead.findByIdAndDelete(req.params.id)
    if (!lead) return res.status(404).json({ success: false, message: 'Lead not found' })
    res.json({ success: true, message: 'Lead deleted' })
  } catch (error) {
    next(error)
  }
})

module.exports = router
