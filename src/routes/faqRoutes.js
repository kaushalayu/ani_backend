const express = require('express')
const router = express.Router()
const {
  getFaqs,
  getFaq,
  createFaq,
  updateFaq,
  deleteFaq,
} = require('../controllers/faqController')
const { protect, adminOnly } = require('../middleware/auth')

router.get('/', getFaqs)
router.get('/:id', getFaq)
router.post('/', protect, adminOnly, createFaq)
router.put('/:id', protect, adminOnly, updateFaq)
router.delete('/:id', protect, adminOnly, deleteFaq)

module.exports = router
