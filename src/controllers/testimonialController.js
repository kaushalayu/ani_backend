const Testimonial = require('../models/Testimonial')
const { saveFile, deleteFile } = require('../utils/storage')

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
    let imageUrl = req.body.image || ''
    let imagePublicId = ''
    if (req.file) {
      const resFile = await saveFile(req.file)
      imageUrl = resFile.url || ''
      imagePublicId = resFile.public_id || ''
    }
    const testimonial = await Testimonial.create({ ...req.body, image: imageUrl, imagePublicId })
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
    if (req.file) {
      try { await deleteFile(testimonial.imagePublicId || testimonial.image) } catch (e) {}
      const resFile = await saveFile(req.file)
      updateData.image = resFile.url || ''
      if (resFile.public_id) updateData.imagePublicId = resFile.public_id
    }
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
