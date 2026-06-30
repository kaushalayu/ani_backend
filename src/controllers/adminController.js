const User = require('../models/User')

// @desc    Get all users (Admin)
// @route   GET /api/admin/users
// @access  Admin
const getAllUsers = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, search } = req.query
    const query = {}

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ]
    }

    const skip = (Number(page) - 1) * Number(limit)
    const total = await User.countDocuments(query)

    const users = await User.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit))

    res.json({ success: true, total, users })
  } catch (error) {
    next(error)
  }
}

// @desc    Get single user (Admin)
// @route   GET /api/admin/users/:id
// @access  Admin
const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id)
    if (!user) return res.status(404).json({ success: false, message: 'User not found' })
    res.json({ success: true, user })
  } catch (error) {
    next(error)
  }
}

// @desc    Update user role / status (Admin)
// @route   PUT /api/admin/users/:id
// @access  Admin
const updateUser = async (req, res, next) => {
  try {
    const { role, isActive } = req.body

    const user = await User.findById(req.params.id)
    if (!user) return res.status(404).json({ success: false, message: 'User not found' })

    // Prevent admin from changing their own role/status
    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({ success: false, message: 'Cannot modify your own account here' })
    }

    if (role !== undefined) user.role = role
    if (isActive !== undefined) user.isActive = isActive

    await user.save()

    res.json({ success: true, message: 'User updated', user })
  } catch (error) {
    next(error)
  }
}

// @desc    Delete user (Admin)
// @route   DELETE /api/admin/users/:id
// @access  Admin
const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id)
    if (!user) return res.status(404).json({ success: false, message: 'User not found' })

    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({ success: false, message: 'Cannot delete your own account' })
    }

    await User.findByIdAndDelete(req.params.id)
    res.json({ success: true, message: 'User deleted' })
  } catch (error) {
    next(error)
  }
}

// @desc    Fix stored image URLs (localhost -> relative)
// @route   POST /api/admin/fix-image-urls
// @access  Admin
const fixImageUrls = async (req, res, next) => {
  try {
    const Product = require('../models/Product')
    const PageMeta = require('../models/PageMeta')
    const oldHost = 'http://localhost:5000'
    let totalFixed = 0

    // Fix Product images
    const products = await Product.find({
      $or: [
        { image: { $regex: oldHost } },
        { 'pillsOptions.image': { $regex: oldHost } },
      ]
    })
    for (const p of products) {
      if (p.image && p.image.startsWith(oldHost)) {
        p.image = p.image.replace(oldHost, '')
        totalFixed++
      }
      if (p.images && Array.isArray(p.images)) {
        p.images = p.images.map(img => img.startsWith(oldHost) ? (totalFixed++, img.replace(oldHost, '')) : img)
      }
      if (p.pillsOptions && Array.isArray(p.pillsOptions)) {
        for (const opt of p.pillsOptions) {
          if (opt.image && opt.image.startsWith(oldHost)) {
            opt.image = opt.image.replace(oldHost, '')
            totalFixed++
          }
        }
      }
      await p.save()
    }

    // Fix PageMeta banner images
    const pageMetas = await PageMeta.find({ bannerImage: { $regex: oldHost } })
    for (const pm of pageMetas) {
      pm.bannerImage = pm.bannerImage.replace(oldHost, '')
      totalFixed++
      await pm.save()
    }

    // Fix SEO images (ogImage, siteIcon)
    const Seo = require('../models/Seo')
    const seo = await Seo.findOne()
    if (seo) {
      if (seo.ogImage && seo.ogImage.startsWith(oldHost)) {
        seo.ogImage = seo.ogImage.replace(oldHost, '')
        totalFixed++
      }
      if (seo.siteIcon && seo.siteIcon.startsWith(oldHost)) {
        seo.siteIcon = seo.siteIcon.replace(oldHost, '')
        totalFixed++
      }
      if (seo.isModified()) await seo.save()
    }

    res.json({ success: true, message: `Fixed ${totalFixed} image URL(s)` })
  } catch (error) {
    next(error)
  }
}

module.exports = { getAllUsers, getUser, updateUser, deleteUser, fixImageUrls }
