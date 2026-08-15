const mongoose = require('mongoose')

const settingsSchema = new mongoose.Schema(
  {
    key: { type: String, default: 'site', unique: true },
    siteName: { type: String, trim: true, default: 'Painomed' },
    adminEmail: { type: String, trim: true, lowercase: true, default: '' },
    smtp: {
      host: { type: String, trim: true, default: '' },
      port: { type: Number, default: 587 },
      secure: { type: Boolean, default: false },
      user: { type: String, trim: true, default: '' },
      pass: { type: String, trim: true, default: '' },
      from: { type: String, trim: true, default: '' },
    },
  },
  { timestamps: true }
)

module.exports = mongoose.model('Settings', settingsSchema)
