const mongoose = require('mongoose')

const pageMetaSchema = new mongoose.Schema({
  page: { type: String, required: true, unique: true },
  title: { type: String, default: '' },
  description: { type: String, default: '' },
  keywords: { type: String, default: '' },
  ogImage: { type: String, default: '' },
  bannerImage: { type: String, default: '' },
  bannerImagePublicId: { type: String, default: '' },
}, { timestamps: true })

module.exports = mongoose.model('PageMeta', pageMetaSchema)
