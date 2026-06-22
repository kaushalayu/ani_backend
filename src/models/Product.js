const mongoose = require('mongoose')

const reviewSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true },
  },
  { timestamps: true }
)

const pillsOptionSchema = new mongoose.Schema({
  count: { type: Number, required: true },       // e.g. 15, 30, 60
  price: { type: Number, required: true },
  oldPrice: { type: Number, default: 0 },
  stock: { type: Number, default: 0 },
})

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    shortDescription: {
      type: String,
      default: '',
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'Category is required'],
    },
    brand: {
      type: String,
      default: 'Pharmez Healthcare',
    },
    sku: {
      type: String,
      unique: true,
      sparse: true,
    },
    // Main image
    image: {
      type: String,
      required: [true, 'Product image is required'],
    },
    imagePublicId: { type: String, default: '' },
    // Extra images
    images: [{ type: String }],
    // Pricing — either simple or pills-based
    price: {
      type: Number,
      default: 0,
    },
    oldPrice: {
      type: Number,
      default: 0,
    },
    stock: {
      type: Number,
      default: 0,
    },
    // For pill-based products (like medicines with 15/30/60/90 pills options)
    hasPillsOptions: {
      type: Boolean,
      default: false,
    },
    pillsOptions: [pillsOptionSchema],
    // Badges / tags
    badge: {
      type: String,
      default: '',  // e.g. "Vitamin", "Herbal", "Cream", etc.
    },
    tags: [{ type: String }],
    rating: {
      type: Number,
      default: 0,
    },
    numReviews: {
      type: Number,
      default: 0,
    },
    reviews: [reviewSchema],
    isFeatured: {
      type: Boolean,
      default: false,
    },
    isNewArrival: {
      type: Boolean,
      default: false,
    },
    isBestSeller: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    // Extra info sections (for SingleProduct page)
    howToUse: { type: String, default: '' },
    sideEffects: { type: String, default: '' },
    ingredients: { type: String, default: '' },
    additionalInfo: { type: String, default: '' },
  },
  { timestamps: true }
)

// Auto-generate slug from name
productSchema.pre('save', function (next) {
  if (this.isModified('name')) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
  }
  next()
})

module.exports = mongoose.model('Product', productSchema)
