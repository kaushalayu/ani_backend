const express = require('express')
const router = express.Router()
const {
  getTestimonials,
  getTestimonial,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
} = require('../controllers/testimonialController')
const { protect, adminOnly } = require('../middleware/auth')
const upload = require('../utils/upload')

router.get('/', getTestimonials)
router.get('/:id', getTestimonial)
router.post('/', protect, adminOnly, upload.single('image'), createTestimonial)
router.put('/:id', protect, adminOnly, upload.single('image'), updateTestimonial)
router.delete('/:id', protect, adminOnly, deleteTestimonial)

module.exports = router
