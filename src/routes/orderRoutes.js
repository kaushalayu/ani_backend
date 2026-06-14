const express = require('express')
const router = express.Router()
const {
  placeOrder,
  getMyOrders,
  getOrder,
  getAllOrders,
  updateOrderStatus,
} = require('../controllers/orderController')
const { protect, adminOnly } = require('../middleware/auth')

// Private
router.post('/', protect, placeOrder)
router.get('/my', protect, getMyOrders)
router.get('/:id', protect, getOrder)

// Admin
router.get('/', protect, adminOnly, getAllOrders)
// Note: /admin/stats is in adminRoutes.js — this duplicate is removed
router.put('/:id/status', protect, adminOnly, updateOrderStatus)

module.exports = router
