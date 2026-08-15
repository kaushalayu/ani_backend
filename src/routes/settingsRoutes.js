const express = require('express')
const router = express.Router()
const { getSettings, updateSettings, testEmail } = require('../controllers/settingsController')
const { protect, adminOnly } = require('../middleware/auth')

router.use(protect, adminOnly)

router.get('/', getSettings)
router.put('/', updateSettings)
router.post('/test', testEmail)

module.exports = router
