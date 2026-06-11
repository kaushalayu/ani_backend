const Seo = require('../models/Seo')
const fs = require('fs')
const path = require('path')

const getDefaultSeo = () => ({
  siteTitle: 'Pharmez - Online Pharmacy',
  siteDescription: 'Buy genuine medicines and healthcare products online at Pharmez. Fast delivery, best prices, and trusted quality.',
  siteKeywords: 'pharmacy, online pharmacy, medicines, healthcare, pharmez',
  siteIcon: '',
  ogImage: '',
  ogTitle: '',
  ogDescription: '',
  footerText: '',
})

// @desc    Get SEO settings (public)
// @route   GET /api/seo
// @access  Public
const getSeo = async (req, res, next) => {
  try {
    let seo = await Seo.findOne()
    if (!seo) {
      seo = getDefaultSeo()
    }
    res.json({ success: true, seo })
  } catch (error) {
    next(error)
  }
}

// @desc    Update SEO settings (admin only)
// @route   PUT /api/admin/seo
// @access  Admin
const updateSeo = async (req, res, next) => {
  try {
    const { siteTitle, siteDescription, siteKeywords, ogTitle, ogDescription, footerText } = req.body

    let seo = await Seo.findOne()
    if (!seo) {
      seo = new Seo()
    }

    if (siteTitle !== undefined) seo.siteTitle = siteTitle
    if (siteDescription !== undefined) seo.siteDescription = siteDescription
    if (siteKeywords !== undefined) seo.siteKeywords = siteKeywords
    if (ogTitle !== undefined) seo.ogTitle = ogTitle
    if (ogDescription !== undefined) seo.ogDescription = ogDescription
    if (footerText !== undefined) seo.footerText = footerText

    await seo.save()

    res.json({ success: true, message: 'SEO settings updated', seo })
  } catch (error) {
    next(error)
  }
}

// @desc    Upload site icon / favicon (admin only)
// @route   POST /api/admin/seo/upload-icon
// @access  Admin
const uploadIcon = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' })
    }

    let seo = await Seo.findOne()
    if (!seo) {
      seo = new Seo()
    }

    // Delete old icon file if exists
    if (seo.siteIcon) {
      const oldPath = path.join(__dirname, '../../', seo.siteIcon)
      if (fs.existsSync(oldPath)) {
        fs.unlinkSync(oldPath)
      }
    }

    seo.siteIcon = '/uploads/' + req.file.filename
    await seo.save()

    res.json({ success: true, message: 'Site icon uploaded', seo })
  } catch (error) {
    next(error)
  }
}

// @desc    Upload OG image (admin only)
// @route   POST /api/admin/seo/upload-og-image
// @access  Admin
const uploadOgImage = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' })
    }

    let seo = await Seo.findOne()
    if (!seo) {
      seo = new Seo()
    }

    if (seo.ogImage) {
      const oldPath = path.join(__dirname, '../../', seo.ogImage)
      if (fs.existsSync(oldPath)) {
        fs.unlinkSync(oldPath)
      }
    }

    seo.ogImage = '/uploads/' + req.file.filename
    await seo.save()

    res.json({ success: true, message: 'OG image uploaded', seo })
  } catch (error) {
    next(error)
  }
}

module.exports = { getSeo, updateSeo, uploadIcon, uploadOgImage }
