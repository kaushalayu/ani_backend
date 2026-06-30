const Category = require('../models/Category')
const { saveFile, deleteFile } = require('../utils/storage')

// @desc    Get all categories
// @route   GET /api/categories
// @access  Public
const getCategories = async (req, res, next) => {
  try {
    const isAdminRequest = req.user?.role === 'admin'
    const query = isAdminRequest ? {} : { isActive: true }
    const limit = parseInt(req.query.limit) || 0
    let cats = Category.find(query).sort({ name: 1 })
    if (limit > 0) cats = cats.limit(limit)
    const categories = await cats
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
    let image = req.body.image || ''
    let imagePublicId = ''
    if (req.file) {
      const resFile = await saveFile(req.file)
      image = resFile.url || ''
      imagePublicId = resFile.public_id || ''
    }

    const category = await Category.create({ name, description, image, imagePublicId })
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
    if (req.file) {
      const existing = await Category.findById(req.params.id)
      try { await deleteFile(existing.imagePublicId || existing.image) } catch (e) {}
      const resFile = await saveFile(req.file)
      updateData.image = resFile.url || ''
      if (resFile.public_id) updateData.imagePublicId = resFile.public_id
    }
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
