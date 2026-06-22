const mongoose = require('mongoose')

const testimonialSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    role: {
      type: String,
      default: 'Happy Customer',
    },
    text: {
      type: String,
      required: [true, 'Testimonial text is required'],
    },
    rating: {
      type: Number,
      default: 5,
      min: 1,
      max: 5,
    },
    image: {
      type: String,
      default: '',
    },
    imagePublicId: { type: String, default: '' },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
)

module.exports = mongoose.model('Testimonial', testimonialSchema)
