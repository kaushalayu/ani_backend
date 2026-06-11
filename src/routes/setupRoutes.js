const express = require('express')
const router = express.Router()
const { getSetupStatus, createFirstAdmin } = require('../controllers/setupController')

// GET  /api/setup/status       → check karo admin hai ya nahi
// POST /api/setup/create-admin → pehla admin banao (sirf ek baar kaam karega)
router.get('/status', getSetupStatus)
router.post('/create-admin', createFirstAdmin)

module.exports = router
