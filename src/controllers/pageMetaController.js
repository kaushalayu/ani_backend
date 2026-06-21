const PageMeta = require('../models/PageMeta')

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
    const { page, title, description, keywords, ogImage } = req.body
    let meta = await PageMeta.findOne({ page })
    if (meta) {
      if (title !== undefined) meta.title = title
      if (description !== undefined) meta.description = description
      if (keywords !== undefined) meta.keywords = keywords
      if (ogImage !== undefined) meta.ogImage = ogImage
      await meta.save()
    } else {
      meta = await PageMeta.create({ page, title, description, keywords, ogImage })
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
