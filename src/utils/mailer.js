const SETTINGS_CACHE_TTL = 30 * 1000

let settingsCache = null
let settingsCacheTime = 0

const escapeHtml = (value) =>
  String(value == null ? '' : value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')

// Read SMTP / admin settings from DB with env fallback.
// Empty DB values fall back to process.env.
const getSettings = async () => {
  if (settingsCache && Date.now() - settingsCacheTime < SETTINGS_CACHE_TTL) {
    return settingsCache
  }

  settingsCache = null
  try {
    const Settings = require('../models/Settings')
    const doc = await Settings.findOne({ key: 'site' })
    const smtp = (doc && doc.smtp) || {}

    settingsCache = {
      smtp: {
        host: smtp.host || process.env.SMTP_HOST || '',
        port: Number(smtp.port) || Number(process.env.SMTP_PORT) || 587,
        secure: smtp.secure === undefined ? Number(process.env.SMTP_PORT) === 465 : !!smtp.secure,
        user: smtp.user || process.env.SMTP_USER || '',
        pass: smtp.pass || process.env.SMTP_PASS || '',
        from: smtp.from || process.env.SMTP_FROM || '',
      },
      adminEmail: (doc && doc.adminEmail) || process.env.ADMIN_EMAIL || '',
      siteName: (doc && doc.siteName) || process.env.SITE_NAME || 'Painomed',
    }
    settingsCacheTime = Date.now()
  } catch (error) {
    console.warn('[mailer] Failed to load settings from DB:', error.message)
  }

  return settingsCache
}

const invalidateSettingsCache = () => {
  settingsCache = null
  settingsCacheTime = 0
}

const getAdminEmail = async () => {
  const s = await getSettings()
  return (s && s.adminEmail) || process.env.ADMIN_EMAIL || ''
}

const getSiteName = async () => {
  const s = await getSettings()
  return (s && s.siteName) || process.env.SITE_NAME || 'Painomed'
}

const sendMail = async (to, subject, html) => {
  const s = await getSettings()
  const smtp = (s && s.smtp) || {}
  const host = smtp.host
  const user = smtp.user
  const pass = smtp.pass

  if (!host || !user || !pass || !to) {
    console.warn('[mailer] SMTP not configured, skipping email:', subject)
    return { skipped: true }
  }

  try {
    const nodemailer = require('nodemailer')
    const transporter = nodemailer.createTransport({
      host,
      port: Number(smtp.port) || 587,
      secure: !!smtp.secure,
      auth: { user, pass },
    })

    await transporter.sendMail({
      from: smtp.from ? `"${s.siteName}" <${smtp.from}>` : `"${s.siteName}" <${user}>`,
      to,
      subject,
      html,
    })
    return { skipped: false }
  } catch (error) {
    console.error('[mailer] Failed to send email:', error.message)
    return { error: error.message }
  }
}

const notifyNewOrder = async (order) => {
  const adminEmail = await getAdminEmail()
  if (!adminEmail) {
    console.warn('[mailer] No admin email configured, skipping new order notification')
    return
  }

  const items = (order.orderItems || [])
    .map((it) => {
      const name = (it.product && it.product.name) || it.name || 'Item'
      return `${it.name || name} x ${it.qty} — $${it.price}`
    })
    .join('<br/>')

  const address = order.shippingAddress || {}
  const siteName = await getSiteName()
  const html = `
    <h2>New Order Received</h2>
    <p><strong>Order ID:</strong> ${order._id}</p>
    <p><strong>Placed at:</strong> ${new Date(order.createdAt).toLocaleString()}</p>
    <h3>Items</h3>
    <p>${items || 'No items listed'}</p>
    <p><strong>Total:</strong> $${order.totalPrice}</p>
    <p><strong>Payment:</strong> ${order.paymentMethod}${order.subPaymentMethod ? ' / ' + order.subPaymentMethod : ''}</p>
    <h3>Shipping</h3>
    <p>${address.fullName || address.name || ''}<br/>
       ${address.address || ''}<br/>
       ${address.city || ''} ${address.state || ''} ${address.zip || address.postalCode || ''}<br/>
       ${address.country || ''}</p>
    <p><strong>Phone:</strong> ${address.phone || address.mobile || ''}<br/>
       <strong>Email:</strong> ${address.email || ''}</p>
    <p><strong>Notes:</strong> ${order.notes || '—'}</p>
  `

  await sendMail(adminEmail, `New Order #${order._id} — ${siteName}`, html)
}

const notifyNewContact = async (contact) => {
  const adminEmail = await getAdminEmail()
  if (!adminEmail) {
    console.warn('[mailer] No admin email configured, skipping contact notification')
    return
  }

  const subjectMap = {
    order: 'Order',
    prescription: 'Prescription',
    delivery: 'Delivery',
    product: 'Product',
    other: 'Other',
    '': 'General',
  }
  const subjectLabel = subjectMap[contact.subject] || 'General'
  const subjectDetail = contact.subjectOther ? ` — ${escapeHtml(contact.subjectOther)}` : ''
  const siteName = await getSiteName()

  const html = `
    <h2>New Contact Message Received</h2>
    <p><strong>Received at:</strong> ${new Date(contact.createdAt).toLocaleString()}</p>
    <table>
      <tr><td><strong>Name:</strong></td><td>${escapeHtml(contact.name)}</td></tr>
      <tr><td><strong>Email:</strong></td><td>${escapeHtml(contact.email)}</td></tr>
      <tr><td><strong>Phone:</strong></td><td>${escapeHtml(contact.phone || '—')}</td></tr>
      <tr><td><strong>Subject:</strong></td><td>${escapeHtml(subjectLabel)}${subjectDetail}</td></tr>
    </table>
    <h3>Message</h3>
    <p>${escapeHtml(contact.message).replace(/\n/g, '<br/>')}</p>
  `

  await sendMail(adminEmail, `New Contact Message — ${contact.name} — ${siteName}`, html)
}

const notifyNewLead = async (lead) => {
  const adminEmail = await getAdminEmail()
  if (!adminEmail) {
    console.warn('[mailer] No admin email configured, skipping lead notification')
    return
  }

  const siteName = await getSiteName()
  const html = `
    <h2>New Call-back Request / Lead</h2>
    <p><strong>Received at:</strong> ${new Date(lead.createdAt).toLocaleString()}</p>
    <p><strong>Name:</strong> ${escapeHtml(lead.name)}</p>
    <p><strong>Mobile:</strong> ${escapeHtml(lead.mobile)}</p>
    <p><strong>Email:</strong> ${escapeHtml(lead.email || '—')}</p>
    <p><strong>Source:</strong> ${escapeHtml(lead.source || '—')}</p>
  `

  await sendMail(adminEmail, `New Call-back Request — ${lead.name} — ${siteName}`, html)
}

module.exports = {
  sendMail,
  notifyNewOrder,
  notifyNewContact,
  notifyNewLead,
  getSettings,
  getAdminEmail,
  getSiteName,
  invalidateSettingsCache,
}
