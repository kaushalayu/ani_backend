const express = require('express')
const router = express.Router()
const {
  submitContact,
  getAllContacts,
  getContact,
  updateContact,
  deleteContact,
} = require('../controllers/contactController')
const { protect, adminOnly } = require('../middleware/auth')

// Public
router.post('/', submitContact)

// Admin
router.get('/', protect, adminOnly, getAllContacts)
router.get('/:id', protect, adminOnly, getContact)
router.put('/:id', protect, adminOnly, updateContact)
router.delete('/:id', protect, adminOnly, deleteContact)

module.exports = router
