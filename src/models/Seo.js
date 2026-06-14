const mongoose = require('mongoose')

const seoSchema = new mongoose.Schema({
  siteTitle: { type: String, default: 'Pharmez - Online Pharmacy' },
  siteDescription: { type: String, default: 'Buy genuine medicines and healthcare products online at Pharmez. Fast delivery, best prices, and trusted quality.' },
  siteKeywords: { type: String, default: 'pharmacy, online pharmacy, medicines, healthcare, pharmez' },
  siteIcon: { type: String, default: '' },
  ogImage: { type: String, default: '' },
  ogTitle: { type: String, default: '' },
  ogDescription: { type: String, default: '' },
  footerText: { type: String, default: '' },
  whatsappNumber: { type: String, default: '61383766284' },
  supportEmail: { type: String, default: 'support@pharmez.com' },
  contactPhone: { type: String, default: '+61 3 8376 6284' },
  address: { type: String, default: '21 King Street, Melbourne, 3000, Australia' },
  businessHours: { type: String, default: 'Mon - Sat: 9:00 am to 6:00 pm' },
  socialLinks: {
    facebook: { type: String, default: 'https://www.facebook.com/' },
    instagram: { type: String, default: 'https://instagram.com/' },
    linkedin: { type: String, default: 'https://www.linkedin.com/' },
  },
  mapEmbedUrl: { type: String, default: '' },
}, { timestamps: true })

module.exports = mongoose.model('Seo', seoSchema)
