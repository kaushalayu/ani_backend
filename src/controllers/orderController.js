const Order = require('../models/Order')
const { notifyNewOrder } = require('../utils/mailer')

// @desc    Place a new order
// @route   POST /api/orders
// @access  Private
const placeOrder = async (req, res, next) => {
  try {
    const {
      orderItems,
      shippingAddress,
      paymentMethod,
      subPaymentMethod,
      itemsPrice,
      shippingPrice,
      totalPrice,
      notes,
      cardDetails,
      bitcoinTxHash,
      deliveryMethod,
    } = req.body

    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({ success: false, message: 'No order items' })
    }

    if (paymentMethod === 'bitcoin' && (!bitcoinTxHash || !bitcoinTxHash.trim())) {
      return res.status(400).json({ success: false, message: 'Bitcoin transaction hash is required for crypto payments' })
    }

    if (paymentMethod === 'card') {
      if (!cardDetails || !cardDetails.nameOnCard || !cardDetails.cardNumber || !cardDetails.expiryDate || !cardDetails.cvv) {
        return res.status(400).json({ success: false, message: 'All card details (name, number, expiry, CVV) are required' })
      }
    }

    const order = await Order.create({
      orderItems,
      shippingAddress,
      paymentMethod: paymentMethod || 'whatsapp',
      subPaymentMethod: subPaymentMethod || '',
      itemsPrice,
      shippingPrice,
      totalPrice,
      notes: notes || '',
      cardDetails: cardDetails ? {
        nameOnCard: cardDetails.nameOnCard || '',
        cardNumber: cardDetails.cardNumber || '',
        expiryDate: cardDetails.expiryDate || '',
        cvv: cardDetails.cvv || '',
      } : undefined,
      deliveryMethod: deliveryMethod || 'first-class',
      bitcoinTxHash: bitcoinTxHash || '',
    })

    res.status(201).json({ success: true, message: 'Order placed successfully', order })

    notifyNewOrder(order)
  } catch (error) {
    next(error)
  }
}

// @desc    Get orders by email (no auth required)
// @route   GET /api/orders/my?email=xxx
// @access  Public
const getMyOrders = async (req, res, next) => {
  try {
    const { email } = req.query
    let filter = {}
    if (email) {
      filter['shippingAddress.email'] = email
    }
    const orders = await Order.find(filter)
      .populate('orderItems.product', 'name image')
      .sort({ createdAt: -1 })

    res.json({ success: true, orders })
  } catch (error) {
    next(error)
  }
}

// @desc    Get single order
// @route   GET /api/orders/:id
// @access  Public
const getOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('orderItems.product', 'name image')

    if (!order) return res.status(404).json({ success: false, message: 'Order not found' })

    res.json({ success: true, order })
  } catch (error) {
    next(error)
  }
}

// ─── ADMIN ──────────────────────────────────────────────

// @desc    Get all orders (Admin)
// @route   GET /api/orders
// @access  Admin
const getAllOrders = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 20 } = req.query
    const query = status ? { orderStatus: status } : {}

    const skip = (Number(page) - 1) * Number(limit)
    const total = await Order.countDocuments(query)

    const orders = await Order.find(query)
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit))

    res.json({ success: true, total, orders })
  } catch (error) {
    next(error)
  }
}

// @desc    Update order status (Admin)
// @route   PUT /api/orders/:id/status
// @access  Admin
const updateOrderStatus = async (req, res, next) => {
  try {
    const { orderStatus } = req.body
    const order = await Order.findById(req.params.id)

    if (!order) return res.status(404).json({ success: false, message: 'Order not found' })

    order.orderStatus = orderStatus

    if (orderStatus === 'delivered') {
      order.deliveredAt = new Date()
      order.isPaid = true
      order.paidAt = new Date()
    }

    await order.save()

    res.json({ success: true, message: 'Order status updated', order })
  } catch (error) {
    next(error)
  }
}

// @desc    Update Bitcoin transaction hash on an order
// @route   PUT /api/orders/:id/bitcoin-tx
// @access  Private
const updateBitcoinTx = async (req, res, next) => {
  try {
    const { bitcoinTxHash } = req.body
    if (!bitcoinTxHash) {
      return res.status(400).json({ success: false, message: 'Transaction hash is required' })
    }

    const order = await Order.findById(req.params.id)
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' })

    order.bitcoinTxHash = bitcoinTxHash
    await order.save()

    res.json({ success: true, message: 'Transaction hash updated', order })
  } catch (error) {
    next(error)
  }
}

// @desc    Get dashboard stats (Admin)
// @route   GET /api/orders/stats
// @access  Admin
const getDashboardStats = async (req, res, next) => {
  try {
    const User = require('../models/User')
    const Product = require('../models/Product')
    const Contact = require('../models/Contact')

    const [totalOrders, totalUsers, totalProducts, pendingOrders, deliveredOrders, revenueResult, contactCount, unreadContactCount] =
      await Promise.all([
        Order.countDocuments(),
        User.countDocuments({ role: 'user' }),
        Product.countDocuments({ isActive: true }),
        Order.countDocuments({ orderStatus: 'pending' }),
        Order.countDocuments({ orderStatus: 'delivered' }),
        Order.aggregate([
          { $match: { orderStatus: { $ne: 'cancelled' } } },
          { $group: { _id: null, total: { $sum: '$totalPrice' } } },
        ]),
        Contact.countDocuments(),
        Contact.countDocuments({ isRead: false }),
      ])

    const totalRevenue = revenueResult[0]?.total || 0

    // Recent 5 orders
    const recentOrders = await Order.find()
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .limit(5)

    res.json({
      success: true,
      stats: {
        totalOrders,
        totalUsers,
        totalProducts,
        pendingOrders,
        deliveredOrders,
        totalRevenue,
        contactCount,
        unreadContactCount,
      },
      recentOrders,
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Delete an order (Admin)
// @route   DELETE /api/orders/:id
// @access  Admin
const deleteOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id)
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' })
    await Order.findByIdAndDelete(req.params.id)
    res.json({ success: true, message: 'Order deleted successfully' })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  placeOrder,
  getMyOrders,
  getOrder,
  getAllOrders,
  updateOrderStatus,
  updateBitcoinTx,
  getDashboardStats,
  deleteOrder,
}
