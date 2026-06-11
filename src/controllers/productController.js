const Product = require('../models/Product')

// @desc    Get all products (with filters, search, pagination)
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res, next) => {
  try {
    const {
      search,
      category,
      badge,
      isFeatured,
      isNewArrival,
      isBestSeller,
      minPrice,
      maxPrice,
      sort,
      page = 1,
      limit = 12,
    } = req.query

    const query = { isActive: true }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { badge: { $regex: search, $options: 'i' } },
      ]
    }

    if (category) query.category = category
    if (badge) query.badge = { $regex: badge, $options: 'i' }
    if (isFeatured === 'true') query.isFeatured = true
    if (isNewArrival === 'true') query.isNewArrival = true
    if (isBestSeller === 'true') query.isBestSeller = true

    if (minPrice || maxPrice) {
      query.price = {}
      if (minPrice) query.price.$gte = Number(minPrice)
      if (maxPrice) query.price.$lte = Number(maxPrice)
    }

    // Sort options
    let sortOption = { createdAt: -1 }
    if (sort === 'price-asc') sortOption = { price: 1 }
    else if (sort === 'price-desc') sortOption = { price: -1 }
    else if (sort === 'rating') sortOption = { rating: -1 }
    else if (sort === 'name') sortOption = { name: 1 }

    const skip = (Number(page) - 1) * Number(limit)
    const total = await Product.countDocuments(query)

    const products = await Product.find(query)
      .populate('category', 'name slug')
      .sort(sortOption)
      .skip(skip)
      .limit(Number(limit))

    res.json({
      success: true,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
      products,
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Get single product by ID or slug
// @route   GET /api/products/:id
// @access  Public
const getProduct = async (req, res, next) => {
  try {
    const { id } = req.params
    let product

    // Try by ObjectId first, then by slug
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      product = await Product.findById(id).populate('category', 'name slug')
    } else {
      product = await Product.findOne({ slug: id }).populate('category', 'name slug')
    }

    if (!product || !product.isActive) {
      return res.status(404).json({ success: false, message: 'Product not found' })
    }

    res.json({ success: true, product })
  } catch (error) {
    next(error)
  }
}

// @desc    Create product (Admin)
// @route   POST /api/products
// @access  Admin
const createProduct = async (req, res, next) => {
  try {
    const imageUrl = req.file
      ? `/uploads/${req.file.filename}`
      : req.body.image || ''

    const productData = {
      ...req.body,
      image: imageUrl,
    }

    // Parse JSON fields if they come as strings (from FormData)
    if (typeof productData.pillsOptions === 'string') {
      productData.pillsOptions = JSON.parse(productData.pillsOptions)
    }
    if (typeof productData.tags === 'string') {
      productData.tags = JSON.parse(productData.tags)
    }
    if (typeof productData.hasPillsOptions === 'string') {
      productData.hasPillsOptions = productData.hasPillsOptions === 'true'
    }
    if (typeof productData.isFeatured === 'string') {
      productData.isFeatured = productData.isFeatured === 'true'
    }
    if (typeof productData.isNewArrival === 'string') {
      productData.isNewArrival = productData.isNewArrival === 'true'
    }
    if (typeof productData.isBestSeller === 'string') {
      productData.isBestSeller = productData.isBestSeller === 'true'
    }

    const product = await Product.create(productData)
    const populated = await product.populate('category', 'name slug')

    res.status(201).json({ success: true, message: 'Product created', product: populated })
  } catch (error) {
    next(error)
  }
}

// @desc    Update product (Admin)
// @route   PUT /api/products/:id
// @access  Admin
const updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id)
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' })
    }

    const updateData = { ...req.body }

    if (req.file) {
      updateData.image = `/uploads/${req.file.filename}`
    }

    // Parse JSON fields
    if (typeof updateData.pillsOptions === 'string') {
      updateData.pillsOptions = JSON.parse(updateData.pillsOptions)
    }
    if (typeof updateData.tags === 'string') {
      updateData.tags = JSON.parse(updateData.tags)
    }
    ;['hasPillsOptions', 'isFeatured', 'isNewArrival', 'isBestSeller', 'isActive'].forEach((key) => {
      if (typeof updateData[key] === 'string') {
        updateData[key] = updateData[key] === 'true'
      }
    })

    const updated = await Product.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    }).populate('category', 'name slug')

    res.json({ success: true, message: 'Product updated', product: updated })
  } catch (error) {
    next(error)
  }
}

// @desc    Delete product (Admin)
// @route   DELETE /api/products/:id
// @access  Admin
const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id)
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' })
    }

    await Product.findByIdAndDelete(req.params.id)
    res.json({ success: true, message: 'Product deleted' })
  } catch (error) {
    next(error)
  }
}

// @desc    Add product review
// @route   POST /api/products/:id/reviews
// @access  Private (logged in)
const addReview = async (req, res, next) => {
  try {
    const { rating, comment } = req.body
    const product = await Product.findById(req.params.id)

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' })
    }

    const alreadyReviewed = product.reviews.find(
      (r) => r.user.toString() === req.user._id.toString()
    )

    if (alreadyReviewed) {
      return res.status(400).json({ success: false, message: 'You have already reviewed this product' })
    }

    const review = {
      user: req.user._id,
      name: req.user.name,
      rating: Number(rating),
      comment,
    }

    product.reviews.push(review)
    product.numReviews = product.reviews.length
    product.rating =
      product.reviews.reduce((acc, r) => acc + r.rating, 0) / product.reviews.length

    await product.save()

    res.status(201).json({ success: true, message: 'Review added' })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  addReview,
}
