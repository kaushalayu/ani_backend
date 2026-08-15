const Seo = require('../models/Seo')
const fs = require('fs')
const path = require('path')
const { saveFile, deleteFile } = require('../utils/storage')

const getDefaultSeo = () => ({
  siteTitle: 'Painomed - Online Pharmacy | Pain Relief & Anxiety Medicine Online in USA',
  siteDescription: 'Buy pain relief, anxiety and sleep medicines online in the USA. No prescription required. Fast, discreet delivery from Painomed — your trusted online pharmacy.',
  siteKeywords: 'online pharmacy usa, pain relief medicine online, anxiety medicine online, sleeping pills online, no prescription required, painomed',
  siteIcon: '',
  ogImage: '',
  ogTitle: '',
  ogDescription: '',
  footerText: '',
  whatsappNumber: '12125550134',
  supportEmail: 'support@painomed.com',
  contactPhone: '+1 212 555 0134',
  address: '350 5th Avenue, New York, NY 10118, United States',
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
      socialLinks, mapEmbedUrl, bitcoinAddress, bitcoinQrCode,
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
    if (bitcoinQrCode !== undefined) seo.bitcoinQrCode = bitcoinQrCode
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

// @desc    Upload a promotion banner image (admin only)
// @route   POST /api/admin/seo/upload-promo-banner/:index
// @access  Admin
const uploadPromoBanner = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' })
    }

    const index = req.params.index
    if (!['1', '2', '3'].includes(index)) {
      return res.status(400).json({ success: false, message: 'Invalid banner index (1, 2, or 3)' })
    }

    const urlField = `promoBanner${index}`
    const publicIdField = `promoBanner${index}PublicId`

    let seo = await Seo.findOne()
    if (!seo) {
      seo = new Seo()
    }

    if (seo[urlField] || seo[publicIdField]) {
      try { await deleteFile(seo[publicIdField] || seo[urlField]) } catch (e) {}
    }

    const result = await saveFile(req.file)
    seo[urlField] = result.url || ''
    seo[publicIdField] = result.public_id || ''
    await seo.save()

    res.json({ success: true, message: `Promo banner ${index} uploaded`, seo })
  } catch (error) {
    next(error)
  }
}

// @desc    Upload Bitcoin QR code image (admin only)
// @route   POST /api/admin/seo/upload-bitcoin-qr
// @access  Admin
const uploadBitcoinQr = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' })
    }

    let seo = await Seo.findOne()
    if (!seo) {
      seo = new Seo()
    }

    if (seo.bitcoinQrCode || seo.bitcoinQrCodePublicId) {
      try { await deleteFile(seo.bitcoinQrCodePublicId || seo.bitcoinQrCode) } catch (e) {}
    }

    const result = await saveFile(req.file)
    seo.bitcoinQrCode = result.url || ''
    seo.bitcoinQrCodePublicId = result.public_id || ''
    await seo.save()

    res.json({ success: true, message: 'Bitcoin QR code uploaded', seo })
  } catch (error) {
    next(error)
  }
}

module.exports = { getSeo, updateSeo, uploadIcon, uploadOgImage, uploadPromoBanner, uploadBitcoinQr }
