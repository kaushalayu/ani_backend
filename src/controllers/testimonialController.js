const Testimonial = require('../models/Testimonial')

const getTestimonials = async (req, res, next) => {
  try {
    const query = req.query.admin === 'true' ? {} : { isActive: true }
    const testimonials = await Testimonial.find(query).sort({ createdAt: -1 })
    res.json({ success: true, testimonials })
  } catch (error) {
    next(error)
  }
}

const getTestimonial = async (req, res, next) => {
  try {
    const testimonial = await Testimonial.findById(req.params.id)
    if (!testimonial) return res.status(404).json({ success: false, message: 'Testimonial not found' })
    res.json({ success: true, testimonial })
  } catch (error) {
    next(error)
  }
}

const createTestimonial = async (req, res, next) => {
  try {
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : req.body.image || ''
    const testimonial = await Testimonial.create({ ...req.body, image: imageUrl })
    res.status(201).json({ success: true, message: 'Testimonial created', testimonial })
  } catch (error) {
    next(error)
  }
}

const updateTestimonial = async (req, res, next) => {
  try {
    const testimonial = await Testimonial.findById(req.params.id)
    if (!testimonial) return res.status(404).json({ success: false, message: 'Testimonial not found' })

    const updateData = { ...req.body }
    if (req.file) updateData.image = `/uploads/${req.file.filename}`
    if (typeof updateData.isActive === 'string') {
      updateData.isActive = updateData.isActive === 'true'
    }

    const updated = await Testimonial.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    })
    res.json({ success: true, message: 'Testimonial updated', testimonial: updated })
  } catch (error) {
    next(error)
  }
}

const deleteTestimonial = async (req, res, next) => {
  try {
    const testimonial = await Testimonial.findByIdAndDelete(req.params.id)
    if (!testimonial) return res.status(404).json({ success: false, message: 'Testimonial not found' })
    res.json({ success: true, message: 'Testimonial deleted' })
  } catch (error) {
    next(error)
  }
}

module.exports = { getTestimonials, getTestimonial, createTestimonial, updateTestimonial, deleteTestimonial }
