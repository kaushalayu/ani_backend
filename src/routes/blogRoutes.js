const express = require('express')
const router = express.Router()
const {
  getBlogs,
  getBlog,
  createBlog,
  updateBlog,
  deleteBlog,
  getBlogCategories,
} = require('../controllers/blogController')
const { protect, adminOnly } = require('../middleware/auth')
const upload = require('../utils/upload')

// Public
router.get('/categories', getBlogCategories)
router.get('/', getBlogs)
router.get('/:id', getBlog)

// Admin only
router.post('/', protect, adminOnly, upload.single('image'), createBlog)
router.put('/:id', protect, adminOnly, upload.single('image'), updateBlog)
router.delete('/:id', protect, adminOnly, deleteBlog)

module.exports = router
