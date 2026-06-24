const Seo = require('../models/Seo')
const fs = require('fs')
const path = require('path')
const { saveFile, deleteFile } = require('../utils/storage')

const getDefaultSeo = () => ({
  siteTitle: 'Painomed - Online Pharmacy',
  siteDescription: 'Buy genuine medicines and healthcare products online at Painomed. Fast delivery, best prices, and trusted quality.',
  siteKeywords: 'pharmacy, online pharmacy, medicines, healthcare, painomed',
  siteIcon: '',
  ogImage: '',
  ogTitle: '',
  ogDescription: '',
  footerText: '',
  whatsappNumber: '61383766284',
  supportEmail: 'support@painomed.com',
  contactPhone: '+61 3 8376 6284',
  address: '21 King Street, Melbourne, 3000, Australia',
  businessHours: 'Mon - Sat: 9:00 am to 6:00 pm',
  socialLinks: {
    facebook: 'https://www.facebook.com/',
    instagram: 'https://instagram.com/',
    linkedin: 'https://www.linkedin.com/',
  },
  mapEmbedUrl: '',
  bitcoinAddress: '',
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
    const {
      siteTitle, siteDescription, siteKeywords, ogTitle, ogDescription, footerText,
      whatsappNumber, supportEmail, contactPhone, address, businessHours,
      socialLinks, mapEmbedUrl, bitcoinAddress,
    } = req.body

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
    if (whatsappNumber !== undefined) seo.whatsappNumber = whatsappNumber
    if (supportEmail !== undefined) seo.supportEmail = supportEmail
    if (contactPhone !== undefined) seo.contactPhone = contactPhone
    if (address !== undefined) seo.address = address
    if (businessHours !== undefined) seo.businessHours = businessHours
    if (mapEmbedUrl !== undefined) seo.mapEmbedUrl = mapEmbedUrl
    if (bitcoinAddress !== undefined) seo.bitcoinAddress = bitcoinAddress
    if (socialLinks !== undefined) {
      if (socialLinks.facebook !== undefined) seo.socialLinks.facebook = socialLinks.facebook
      if (socialLinks.instagram !== undefined) seo.socialLinks.instagram = socialLinks.instagram
      if (socialLinks.linkedin !== undefined) seo.socialLinks.linkedin = socialLinks.linkedin
    }

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

    if (seo.siteIcon || seo.siteIconPublicId) {
      try { await deleteFile(seo.siteIconPublicId || seo.siteIcon) } catch (e) {}
    }

    const resFile = await saveFile(req.file)
    seo.siteIcon = resFile.url || ''
    seo.siteIconPublicId = resFile.public_id || ''
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

    if (seo.ogImage || seo.ogImagePublicId) {
      try { await deleteFile(seo.ogImagePublicId || seo.ogImage) } catch (e) {}
    }

    const resFile2 = await saveFile(req.file)
    seo.ogImage = resFile2.url || ''
    seo.ogImagePublicId = resFile2.public_id || ''
    await seo.save()

    res.json({ success: true, message: 'OG image uploaded', seo })
  } catch (error) {
    next(error)
  }
}

module.exports = { getSeo, updateSeo, uploadIcon, uploadOgImage }
