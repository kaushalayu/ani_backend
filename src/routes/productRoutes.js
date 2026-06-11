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
const { protect, adminOnly } = require('../middleware/auth')
const upload = require('../utils/upload')

// Public
router.get('/', getProducts)
router.get('/:id', getProduct)

// Private
router.post('/:id/reviews', protect, addReview)

// Admin
router.post('/', protect, adminOnly, upload.single('image'), createProduct)
router.put('/:id', protect, adminOnly, upload.single('image'), updateProduct)
router.delete('/:id', protect, adminOnly, deleteProduct)

module.exports = router
