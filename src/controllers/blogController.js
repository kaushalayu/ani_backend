const Blog = require('../models/Blog')

// @desc    Get all blogs (with filters & pagination)
// @route   GET /api/blogs
// @access  Public
const getBlogs = async (req, res, next) => {
  try {
    const { category, page = 1, limit = 10, search } = req.query
    const query = { isPublished: true }

    if (category && category !== 'All') {
      query.category = category
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { excerpt: { $regex: search, $options: 'i' } },
      ]
    }

    const skip = (Number(page) - 1) * Number(limit)
    const total = await Blog.countDocuments(query)

    const blogs = await Blog.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit))

    res.json({
      success: true,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
      blogs,
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Get single blog by id or slug
// @route   GET /api/blogs/:id
// @access  Public
const getBlog = async (req, res, next) => {
  try {
    const { id } = req.params
    let blog

    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      blog = await Blog.findById(id)
    } else {
      blog = await Blog.findOne({ slug: id })
    }

    if (!blog || !blog.isPublished) {
      return res.status(404).json({ success: false, message: 'Blog not found' })
    }

    // Increment views
    blog.views += 1
    await blog.save()

    res.json({ success: true, blog })
  } catch (error) {
    next(error)
  }
}

// @desc    Create blog (Admin)
// @route   POST /api/blogs
// @access  Admin
const createBlog = async (req, res, next) => {
  try {
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : req.body.image || ''
    const blogData = { ...req.body, image: imageUrl }

    if (typeof blogData.isPublished === 'string') {
      blogData.isPublished = blogData.isPublished === 'true'
    }

    const blog = await Blog.create(blogData)
    res.status(201).json({ success: true, message: 'Blog created', blog })
  } catch (error) {
    next(error)
  }
}

// @desc    Update blog (Admin)
// @route   PUT /api/blogs/:id
// @access  Admin
const updateBlog = async (req, res, next) => {
  try {
    const blog = await Blog.findById(req.params.id)
    if (!blog) return res.status(404).json({ success: false, message: 'Blog not found' })

    const updateData = { ...req.body }
    if (req.file) updateData.image = `/uploads/${req.file.filename}`
    if (typeof updateData.isPublished === 'string') {
      updateData.isPublished = updateData.isPublished === 'true'
    }

    const updated = await Blog.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    })

    res.json({ success: true, message: 'Blog updated', blog: updated })
  } catch (error) {
    next(error)
  }
}

// @desc    Delete blog (Admin)
// @route   DELETE /api/blogs/:id
// @access  Admin
const deleteBlog = async (req, res, next) => {
  try {
    const blog = await Blog.findByIdAndDelete(req.params.id)
    if (!blog) return res.status(404).json({ success: false, message: 'Blog not found' })
    res.json({ success: true, message: 'Blog deleted' })
  } catch (error) {
    next(error)
  }
}

// @desc    Get all distinct blog categories
// @route   GET /api/blogs/categories
// @access  Public
const getBlogCategories = async (req, res, next) => {
  try {
    const categories = await Blog.distinct('category', { isPublished: true })
    res.json({ success: true, categories: ['All', ...categories.filter(c => c !== 'All')] })
  } catch (error) {
    next(error)
  }
}

module.exports = { getBlogs, getBlog, createBlog, updateBlog, deleteBlog, getBlogCategories }
