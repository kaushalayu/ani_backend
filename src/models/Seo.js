const mongoose = require('mongoose')

const seoSchema = new mongoose.Schema({
  siteTitle: { type: String, default: 'Painomed - Online Pharmacy' },
  siteDescription: { type: String, default: 'Buy genuine medicines and healthcare products online at Painomed. Fast delivery, best prices, and trusted quality.' },
  siteKeywords: { type: String, default: 'pharmacy, online pharmacy, medicines, healthcare, painomed' },
  siteIcon: { type: String, default: '' },
  siteIconPublicId: { type: String, default: '' },
  ogImage: { type: String, default: '' },
  ogImagePublicId: { type: String, default: '' },
  ogTitle: { type: String, default: '' },
  ogDescription: { type: String, default: '' },
  footerText: { type: String, default: '' },
  whatsappNumber: { type: String, default: '61383766284' },
  supportEmail: { type: String, default: 'support@painomed.com' },
  contactPhone: { type: String, default: '+61 3 8376 6284' },
  address: { type: String, default: '21 King Street, Melbourne, 3000, Australia' },
  businessHours: { type: String, default: 'Mon - Sat: 9:00 am to 6:00 pm' },
  socialLinks: {
    facebook: { type: String, default: 'https://www.facebook.com/' },
    instagram: { type: String, default: 'https://instagram.com/' },
    linkedin: { type: String, default: 'https://www.linkedin.com/' },
  },
  mapEmbedUrl: { type: String, default: '' },
  bitcoinAddress: { type: String, default: '' },
  bitcoinQrCode: { type: String, default: '' },
  bitcoinQrCodePublicId: { type: String, default: '' },
  promoBanner1: { type: String, default: '' },
  promoBanner1PublicId: { type: String, default: '' },
  promoBanner2: { type: String, default: '' },
  promoBanner2PublicId: { type: String, default: '' },
  promoBanner3: { type: String, default: '' },
  promoBanner3PublicId: { type: String, default: '' },
}, { timestamps: true })

module.exports = mongoose.model('Seo', seoSchema)
