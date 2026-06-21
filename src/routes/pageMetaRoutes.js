const express = require('express')
const router = express.Router()
const { getByPage } = require('../controllers/pageMetaController')

router.get('/:page', getByPage)

module.exports = router
