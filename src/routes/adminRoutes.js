const express = require('express')
const router = express.Router()
const { getAllUsers, getUser, updateUser, deleteUser, fixImageUrls } = require('../controllers/adminController')
const { getDashboardStats } = require('../controllers/orderController')
const { updateSeo, uploadIcon, uploadOgImage } = require('../controllers/seoController')
const { getAll, upsert, remove, uploadBanner } = require('../controllers/pageMetaController')
const { protect, adminOnly } = require('../middleware/auth')
const upload = require('../utils/upload')

router.use(protect, adminOnly) // All admin routes protected

router.get('/stats', getDashboardStats)
router.get('/users', getAllUsers)
router.get('/users/:id', getUser)
router.put('/users/:id', updateUser)
router.delete('/users/:id', deleteUser)

// SEO
router.put('/seo', updateSeo)
router.post('/seo/upload-icon', upload.single('icon'), uploadIcon)
router.post('/seo/upload-og-image', upload.single('ogImage'), uploadOgImage)

// Fix old image URLs
router.post('/fix-image-urls', fixImageUrls)

// Page Meta
router.get('/page-meta', getAll)
router.put('/page-meta', upsert)
router.post('/page-meta/upload-banner', upload.single('bannerImage'), uploadBanner)
router.delete('/page-meta/:page', remove)

module.exports = router
