const express = require('express')
const router = express.Router()
const {
  placeOrder,
  getMyOrders,
  getOrder,
  getAllOrders,
  updateOrderStatus,
  updateBitcoinTx,
  deleteOrder,
} = require('../controllers/orderController')
const { protect, adminOnly } = require('../middleware/auth')

// Public (no auth required for customer order endpoints)
router.post('/', placeOrder)
router.get('/my', getMyOrders)
router.get('/:id', getOrder)
router.put('/:id/bitcoin-tx', updateBitcoinTx)

// Admin
router.get('/', protect, adminOnly, getAllOrders)
// Note: /admin/stats is in adminRoutes.js — this duplicate is removed
router.put('/:id/status', protect, adminOnly, updateOrderStatus)
router.delete('/:id', protect, adminOnly, deleteOrder)

module.exports = router
