const mongoose = require('mongoose')

const seoSchema = new mongoose.Schema({
  siteTitle: { type: String, default: 'Painomed - Online Pharmacy | Pain Relief & Anxiety Medicine Online in USA' },
  siteDescription: { type: String, default: 'Buy pain relief, anxiety and sleep medicines online in the USA. No prescription required. Fast, discreet delivery from Painomed — your trusted online pharmacy.' },
  siteKeywords: { type: String, default: 'online pharmacy usa, pain relief medicine online, anxiety medicine online, sleeping pills online, no prescription required, painomed' },
  siteIcon: { type: String, default: '' },
  siteIconPublicId: { type: String, default: '' },
  ogImage: { type: String, default: '' },
  ogImagePublicId: { type: String, default: '' },
  ogTitle: { type: String, default: '' },
  ogDescription: { type: String, default: '' },
  footerText: { type: String, default: '' },
  whatsappNumber: { type: String, default: '12125550134' },
  supportEmail: { type: String, default: 'support@painomed.com' },
  contactPhone: { type: String, default: '+1 212 555 0134' },
  address: { type: String, default: '350 5th Avenue, New York, NY 10118, United States' },
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
