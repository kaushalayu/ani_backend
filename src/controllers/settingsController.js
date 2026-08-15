const Settings = require('../models/Settings')
const { invalidateSettingsCache, sendMail, getAdminEmail, getSiteName } = require('../utils/mailer')

// @desc    Get site settings (admin)
// @route   GET /api/settings
// @access  Admin
const getSettings = async (req, res, next) => {
  try {
    let settings = await Settings.findOne({ key: 'site' })
    if (!settings) {
      settings = await Settings.create({ key: 'site' })
    }
    res.json({ success: true, settings })
  } catch (error) {
    next(error)
  }
}

// @desc    Update site settings (admin)
// @route   PUT /api/settings
// @access  Admin
const updateSettings = async (req, res, next) => {
  try {
    let settings = await Settings.findOne({ key: 'site' })
    if (!settings) settings = new Settings({ key: 'site' })

    const { siteName, adminEmail, smtp } = req.body

    if (siteName !== undefined) settings.siteName = String(siteName).trim()
    if (adminEmail !== undefined) settings.adminEmail = String(adminEmail).trim().toLowerCase()

    if (smtp) {
      if (smtp.host !== undefined) settings.smtp.host = String(smtp.host).trim()
      if (smtp.port !== undefined) settings.smtp.port = Number(smtp.port) || 587
      if (smtp.secure !== undefined) settings.smtp.secure = Boolean(smtp.secure)
      if (smtp.user !== undefined) settings.smtp.user = String(smtp.user).trim()
      if (smtp.pass !== undefined) settings.smtp.pass = smtp.pass
      if (smtp.from !== undefined) settings.smtp.from = String(smtp.from).trim()
    }

    await settings.save()
    invalidateSettingsCache()

    res.json({ success: true, message: 'Settings saved', settings })
  } catch (error) {
    next(error)
  }
}

// @desc    Send a test email using current settings (admin)
// @route   POST /api/settings/test
// @access  Admin
const testEmail = async (req, res, next) => {
  try {
    invalidateSettingsCache()

    const adminEmail = await getAdminEmail()
    if (!adminEmail) {
      return res.status(400).json({ success: false, message: 'No admin email configured. Set the notification email first.' })
    }

    const siteName = await getSiteName()
    const result = await sendMail(
      adminEmail,
      `${siteName} — SMTP Test`,
      '<h2>SMTP Test</h2><p>Your SMTP settings are working correctly. You are receiving this because a test email was requested from the admin panel.</p>'
    )

    if (result.skipped) {
      return res.status(400).json({ success: false, message: 'SMTP is not configured. Enter SMTP host, user and password first.' })
    }
    if (result.error) {
      return res.status(400).json({ success: false, message: `Failed to send test email: ${result.error}` })
    }

    res.json({ success: true, message: 'Test email sent successfully' })
  } catch (error) {
    next(error)
  }
}

module.exports = { getSettings, updateSettings, testEmail }
