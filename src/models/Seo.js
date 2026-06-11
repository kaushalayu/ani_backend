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
}, { timestamps: true })

module.exports = mongoose.model('Seo', seoSchema)
