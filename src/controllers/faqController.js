const Faq = require('../models/Faq')

const getFaqs = async (req, res, next) => {
  try {
    const query = req.query.admin === 'true' ? {} : { isActive: true }
    const faqs = await Faq.find(query).sort({ order: 1, createdAt: -1 })
    res.json({ success: true, faqs })
  } catch (error) {
    next(error)
  }
}

const getFaq = async (req, res, next) => {
  try {
    const faq = await Faq.findById(req.params.id)
    if (!faq) return res.status(404).json({ success: false, message: 'FAQ not found' })
    res.json({ success: true, faq })
  } catch (error) {
    next(error)
  }
}

const createFaq = async (req, res, next) => {
  try {
    const faq = await Faq.create(req.body)
    res.status(201).json({ success: true, message: 'FAQ created', faq })
  } catch (error) {
    next(error)
  }
}

const updateFaq = async (req, res, next) => {
  try {
    const faq = await Faq.findById(req.params.id)
    if (!faq) return res.status(404).json({ success: false, message: 'FAQ not found' })

    const updateData = { ...req.body }
    if (typeof updateData.isActive === 'string') {
      updateData.isActive = updateData.isActive === 'true'
    }

    const updated = await Faq.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    })
    res.json({ success: true, message: 'FAQ updated', faq: updated })
  } catch (error) {
    next(error)
  }
}

const deleteFaq = async (req, res, next) => {
  try {
    const faq = await Faq.findByIdAndDelete(req.params.id)
    if (!faq) return res.status(404).json({ success: false, message: 'FAQ not found' })
    res.json({ success: true, message: 'FAQ deleted' })
  } catch (error) {
    next(error)
  }
}

module.exports = { getFaqs, getFaq, createFaq, updateFaq, deleteFaq }
