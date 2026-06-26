const mongoose = require('mongoose')

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Blog title is required'],
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
    },
    content: {
      type: String,
      required: [true, 'Blog content is required'],
    },
    excerpt: {
      type: String,
      default: '',
      maxlength: 300,
    },
    category: {
      type: String,
      default: 'All',
      // e.g. Advices, Announcements, News, Consultation, Development
    },
    image: {
      type: String,
      default: '',
    },
    imagePublicId: { type: String, default: '' },
    author: {
      type: String,
      default: 'Admin',
    },
    isPublished: {
      type: Boolean,
      default: true,
    },
    metaTitle: {
      type: String,
      default: '',
    },
    metaDescription: {
      type: String,
      default: '',
    },
    views: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
)

// Auto-generate slug from title
blogSchema.pre('save', function (next) {
  if (this.isModified('title')) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
      + '-' + Date.now()
  }
  next()
})

module.exports = mongoose.model('Blog', blogSchema)
