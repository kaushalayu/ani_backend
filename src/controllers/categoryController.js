const Category = require('../models/Category')

// @desc    Get all categories
// @route   GET /api/categories
// @access  Public
const getCategories = async (req, res, next) => {
  try {
    const isAdminRequest = req.user?.role === 'admin'
    const query = isAdminRequest ? {} : { isActive: true }
    const categories = await Category.find(query).sort({ name: 1 })
    res.json({ success: true, categories })
  } catch (error) {
    next(error)
  }
}

// @desc    Create category (Admin)
// @route   POST /api/categories
// @access  Admin
const createCategory = async (req, res, next) => {
  try {
    const { name, description } = req.body
    const image = req.file ? `/uploads/${req.file.filename}` : req.body.image || ''

    const category = await Category.create({ name, description, image })
    res.status(201).json({ success: true, message: 'Category created', category })
  } catch (error) {
    next(error)
  }
}

// @desc    Update category (Admin)
// @route   PUT /api/categories/:id
// @access  Admin
const updateCategory = async (req, res, next) => {
  try {
    const updateData = { ...req.body }
    if (req.file) updateData.image = `/uploads/${req.file.filename}`
    if (typeof updateData.isActive === 'string') {
      updateData.isActive = updateData.isActive === 'true'
    }

    const category = await Category.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    })

    if (!category) return res.status(404).json({ success: false, message: 'Category not found' })

    res.json({ success: true, message: 'Category updated', category })
  } catch (error) {
    next(error)
  }
}

// @desc    Delete category (Admin)
// @route   DELETE /api/categories/:id
// @access  Admin
const deleteCategory = async (req, res, next) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id)
    if (!category) return res.status(404).json({ success: false, message: 'Category not found' })

    res.json({ success: true, message: 'Category deleted' })
  } catch (error) {
    next(error)
  }
}

module.exports = { getCategories, createCategory, updateCategory, deleteCategory }
