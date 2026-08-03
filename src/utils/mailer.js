const sendMail = async (to, subject, html) => {
  const host = process.env.SMTP_HOST
  const user = process.env.SMTP_USER
  const pass = process.env.SMTP_PASS

  if (!host || !user || !pass || !to) {
    console.warn('[mailer] SMTP not configured, skipping email:', subject)
    return { skipped: true }
  }

  try {
    const nodemailer = require('nodemailer')
    const transporter = nodemailer.createTransport({
      host,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: Number(process.env.SMTP_PORT) === 465,
      auth: { user, pass },
    })

    await transporter.sendMail({
      from: `"${process.env.SITE_NAME || 'Painomed'}" <${process.env.SMTP_FROM || user}>`,
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
  const adminEmail = process.env.ADMIN_EMAIL
  if (!adminEmail) {
    console.warn('[mailer] ADMIN_EMAIL not set, skipping new order notification')
    return
  }

  const items = (order.orderItems || [])
    .map((it) => {
      const name = (it.product && it.product.name) || it.name || 'Item'
      return `${it.name || name} x ${it.qty} — $${it.price}`
    })
    .join('<br/>')

  const address = order.shippingAddress || {}
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

  await sendMail(adminEmail, `New Order #${order._id} — Painomed`, html)
}

module.exports = { sendMail, notifyNewOrder }
