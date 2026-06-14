const express = require('express')
const router = express.Router()
const {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  addReview,
} = require('../controllers/productController')
const { protect, adminOnly, optionalAuth } = require('../middleware/auth')
const upload = require('../utils/upload')

// Public (with optional auth for admin visibility)
router.get('/', optionalAuth, getProducts)
router.get('/:id', optionalAuth, getProduct)

// Private
router.post('/:id/reviews', protect, addReview)

// Admin
router.post('/', protect, adminOnly, upload.single('image'), createProduct)
router.put('/:id', protect, adminOnly, upload.single('image'), updateProduct)
router.delete('/:id', protect, adminOnly, deleteProduct)

module.exports = router
