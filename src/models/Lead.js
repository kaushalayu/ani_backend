const mongoose = require('mongoose')

const leadSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, 'Name is required'],
    },
    mobile: {
      type: String,
      trim: true,
      required: [true, 'Mobile number is required'],
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email'],
    },
    source: {
      type: String,
      default: 'popup',
    },
  },
  { timestamps: true }
)

module.exports = mongoose.model('Lead', leadSchema)
