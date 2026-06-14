const Service = require('../models/Service')

const getServices = async (req, res, next) => {
  try {
    const query = req.query.admin === 'true' ? {} : { isActive: true }
    const services = await Service.find(query).sort({ order: 1, createdAt: -1 })
    res.json({ success: true, services })
  } catch (error) {
    next(error)
  }
}

const getService = async (req, res, next) => {
  try {
    const service = await Service.findById(req.params.id)
    if (!service) return res.status(404).json({ success: false, message: 'Service not found' })
    res.json({ success: true, service })
  } catch (error) {
    next(error)
  }
}

const createService = async (req, res, next) => {
  try {
    const service = await Service.create(req.body)
    res.status(201).json({ success: true, message: 'Service created', service })
  } catch (error) {
    next(error)
  }
}

const updateService = async (req, res, next) => {
  try {
    const service = await Service.findById(req.params.id)
    if (!service) return res.status(404).json({ success: false, message: 'Service not found' })

    const updateData = { ...req.body }
    if (typeof updateData.isActive === 'string') updateData.isActive = updateData.isActive === 'true'

    const updated = await Service.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    })
    res.json({ success: true, message: 'Service updated', service: updated })
  } catch (error) {
    next(error)
  }
}

const deleteService = async (req, res, next) => {
  try {
    const service = await Service.findByIdAndDelete(req.params.id)
    if (!service) return res.status(404).json({ success: false, message: 'Service not found' })
    res.json({ success: true, message: 'Service deleted' })
  } catch (error) {
    next(error)
  }
}

module.exports = { getServices, getService, createService, updateService, deleteService }
