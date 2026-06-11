const express = require('express')
const router = express.Router()
const { getSeo } = require('../controllers/seoController')

// @route   GET /api/seo
// @access  Public
router.get('/', getSeo)

module.exports = router
