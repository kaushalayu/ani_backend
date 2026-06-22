const Team = require('../models/Team')
const { saveFile, deleteFile } = require('../utils/storage')

const getTeamMembers = async (req, res, next) => {
  try {
    const query = req.query.admin === 'true' ? {} : { isActive: true }
    const members = await Team.find(query).sort({ order: 1, createdAt: -1 })
    res.json({ success: true, members })
  } catch (error) {
    next(error)
  }
}

const getTeamMember = async (req, res, next) => {
  try {
    const member = await Team.findById(req.params.id)
    if (!member) return res.status(404).json({ success: false, message: 'Team member not found' })
    res.json({ success: true, member })
  } catch (error) {
    next(error)
  }
}

const createTeamMember = async (req, res, next) => {
  try {
    let imageUrl = req.body.image || ''
    let imagePublicId = ''
    if (req.file) {
      const resFile = await saveFile(req.file)
      imageUrl = resFile.url || ''
      imagePublicId = resFile.public_id || ''
    }
    if (req.body.socialLinks && typeof req.body.socialLinks === 'string') {
      try { req.body.socialLinks = JSON.parse(req.body.socialLinks) } catch { return res.status(400).json({ success: false, message: 'Invalid socialLinks format' }) }
    }
    const member = await Team.create({ ...req.body, image: imageUrl, imagePublicId })
    res.status(201).json({ success: true, message: 'Team member created', member })
  } catch (error) {
    next(error)
  }
}

const updateTeamMember = async (req, res, next) => {
  try {
    const member = await Team.findById(req.params.id)
    if (!member) return res.status(404).json({ success: false, message: 'Team member not found' })

    const updateData = { ...req.body }
    if (req.file) {
      try { await deleteFile(member.imagePublicId || member.image) } catch (e) {}
      const resFile = await saveFile(req.file)
      updateData.image = resFile.url || ''
      if (resFile.public_id) updateData.imagePublicId = resFile.public_id
    }
    if (typeof updateData.isActive === 'string') updateData.isActive = updateData.isActive === 'true'
    if (updateData.socialLinks && typeof updateData.socialLinks === 'string') {
      try { updateData.socialLinks = JSON.parse(updateData.socialLinks) } catch { return res.status(400).json({ success: false, message: 'Invalid socialLinks format' }) }
    }

    const updated = await Team.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    })
    res.json({ success: true, message: 'Team member updated', member: updated })
  } catch (error) {
    next(error)
  }
}

const deleteTeamMember = async (req, res, next) => {
  try {
    const member = await Team.findByIdAndDelete(req.params.id)
    if (!member) return res.status(404).json({ success: false, message: 'Team member not found' })
    res.json({ success: true, message: 'Team member deleted' })
  } catch (error) {
    next(error)
  }
}

module.exports = { getTeamMembers, getTeamMember, createTeamMember, updateTeamMember, deleteTeamMember }
