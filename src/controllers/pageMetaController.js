const PageMeta = require('../models/PageMeta')
const { saveFile, deleteFile } = require('../utils/storage')

exports.getAll = async (req, res, next) => {
  try {
    const pages = await PageMeta.find().sort({ page: 1 })
    res.json({ success: true, data: pages })
  } catch (err) { next(err) }
}

exports.getByPage = async (req, res, next) => {
  try {
    const meta = await PageMeta.findOne({ page: req.params.page })
    res.json({ success: true, data: meta || {} })
  } catch (err) { next(err) }
}

exports.upsert = async (req, res, next) => {
  try {
    const { page, title, description, keywords, ogImage, aboutVideoUrl } = req.body
    let meta = await PageMeta.findOne({ page })
    if (meta) {
      if (title !== undefined) meta.title = title
      if (description !== undefined) meta.description = description
      if (keywords !== undefined) meta.keywords = keywords
      if (ogImage !== undefined) meta.ogImage = ogImage
      if (aboutVideoUrl !== undefined) meta.aboutVideoUrl = aboutVideoUrl
      await meta.save()
    } else {
      meta = await PageMeta.create({ page, title, description, keywords, ogImage, aboutVideoUrl })
    }
    res.json({ success: true, data: meta })
  } catch (err) { next(err) }
}

exports.remove = async (req, res, next) => {
  try {
    await PageMeta.findOneAndDelete({ page: req.params.page })
    res.json({ success: true, message: 'Deleted' })
  } catch (err) { next(err) }
}

exports.uploadBanner = async (req, res, next) => {
  try {
    const { page } = req.body
    if (!page) return res.status(400).json({ success: false, message: 'Page is required' })
    if (!req.file) return res.status(400).json({ success: false, message: 'No file uploaded' })

    const { url, public_id } = await saveFile(req.file)

    let meta = await PageMeta.findOne({ page })
    if (meta) {
      if (meta.bannerImage) {
        try { await deleteFile(meta.bannerImagePublicId || meta.bannerImage) } catch (e) {}
      }
      meta.bannerImage = url
      meta.bannerImagePublicId = public_id || ''
      await meta.save()
    } else {
      meta = await PageMeta.create({ page, bannerImage: url, bannerImagePublicId: public_id || '' })
    }

    res.json({ success: true, data: { bannerImage: meta.bannerImage } })
  } catch (err) { next(err) }
}
