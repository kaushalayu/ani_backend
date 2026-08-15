const Contact = require('../models/Contact')
const { notifyNewContact } = require('../utils/mailer')

const submitContact = async (req, res, next) => {
  try {
    const { name, email, phone, subject, subjectOther, message } = req.body

    if (!name || !email || !message) {
      return res.status(400).json({ success: false, message: 'Name, email and message are required' })
    }

    const contact = await Contact.create({ name, email, phone, subject, subjectOther, message })

    res.status(201).json({ success: true, message: 'Message sent successfully', contact })

    notifyNewContact(contact)
  } catch (error) {
    next(error)
  }
}

const getAllContacts = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, search, status } = req.query
    const query = {}

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { message: { $regex: search, $options: 'i' } },
      ]
    }

    if (status === 'read') query.isRead = true
    if (status === 'unread') query.isRead = false
    if (status === 'starred') query.isStarred = true

    const skip = (Number(page) - 1) * Number(limit)
    const total = await Contact.countDocuments(query)

    const contacts = await Contact.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit))

    const unreadCount = await Contact.countDocuments({ isRead: false })

    res.json({ success: true, total, unreadCount, contacts })
  } catch (error) {
    next(error)
  }
}

const getContact = async (req, res, next) => {
  try {
    const contact = await Contact.findById(req.params.id)
    if (!contact) return res.status(404).json({ success: false, message: 'Message not found' })
    res.json({ success: true, contact })
  } catch (error) {
    next(error)
  }
}

const updateContact = async (req, res, next) => {
  try {
    const { isRead, isStarred, notes } = req.body
    const contact = await Contact.findById(req.params.id)
    if (!contact) return res.status(404).json({ success: false, message: 'Message not found' })

    if (isRead !== undefined) contact.isRead = isRead
    if (isStarred !== undefined) contact.isStarred = isStarred
    if (notes !== undefined) contact.notes = notes

    await contact.save()
    res.json({ success: true, message: 'Message updated', contact })
  } catch (error) {
    next(error)
  }
}

const deleteContact = async (req, res, next) => {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.id)
    if (!contact) return res.status(404).json({ success: false, message: 'Message not found' })
    res.json({ success: true, message: 'Message deleted' })
  } catch (error) {
    next(error)
  }
}

module.exports = { submitContact, getAllContacts, getContact, updateContact, deleteContact }
