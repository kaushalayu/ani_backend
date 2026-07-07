const mongoose = require('mongoose')

const orderItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  name: { type: String, required: true },
  image: { type: String, default: '' },
  price: { type: Number, required: true },
  pills: { type: Number, default: null },   // null if no pills option
  qty: { type: Number, required: true, default: 1 },
})

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false,
    },
    orderItems: [orderItemSchema],
    shippingAddress: {
      firstName: { type: String, required: true },
      lastName: { type: String, default: '' },
      email: { type: String, default: '' },
      phone: { type: String, default: '' },
      address: { type: String, default: '' },
      city: { type: String, default: '' },
      state: { type: String, default: '' },
      zip: { type: String, default: '' },
      country: { type: String, default: '' },
    },
    paymentMethod: {
      type: String,
      required: true,
      default: 'whatsapp',
    },
    subPaymentMethod: {
      type: String,
      default: '',  // gpay, phonepe, paytm, etc.
    },
    itemsPrice: { type: Number, required: true, default: 0 },
    shippingPrice: { type: Number, required: true, default: 8 },
    totalPrice: { type: Number, required: true, default: 0 },
    orderStatus: {
      type: String,
      enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'],
      default: 'pending',
    },
    isPaid: { type: Boolean, default: false },
    paidAt: { type: Date },
    deliveredAt: { type: Date },
    cardDetails: {
      nameOnCard: { type: String, default: '' },
      cardNumber: { type: String, default: '' },
      expiryDate: { type: String, default: '' },
      cvv: { type: String, default: '' },
    },
    notes: { type: String, default: '' },
    deliveryMethod: { type: String, default: 'first-class' },
    bitcoinTxHash: { type: String, default: '' },
    bitcoinAmount: { type: String, default: '' },
  },
  { timestamps: true }
)

module.exports = mongoose.model('Order', orderSchema)
