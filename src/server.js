require('dotenv').config()
const express = require('express')
const cors    = require('cors')
const morgan  = require('morgan')
const path    = require('path')

const connectDB        = require('./config/db')
const errorHandler     = require('./middleware/errorHandler')
const seedCategories   = require('./utils/seedCategories')
const User             = require('./models/User')

const app = express()

// ── Middleware ─────────────────────────────────────────
const allowedOrigins = [
  process.env.CLIENT_URL,
  'http://localhost:5173',
  'http://localhost:3000',
].filter(Boolean)

app.use(cors({
  origin: (origin, cb) => {
    if (!origin) return cb(null, true)
    if (allowedOrigins.includes(origin)) return cb(null, true)
    if (origin.startsWith('http://localhost:')) return cb(null, true)
    cb(null, false)
  },
  credentials: true,
}))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'))
}

// ── Static uploads ─────────────────────────────────────
app.use('/uploads', express.static(path.join(__dirname, '../uploads')))

// ── API Routes ─────────────────────────────────────────
app.use('/api/auth',       require('./routes/authRoutes'))
app.use('/api/products',   require('./routes/productRoutes'))
app.use('/api/categories', require('./routes/categoryRoutes'))
app.use('/api/orders',     require('./routes/orderRoutes'))
app.use('/api/blogs',      require('./routes/blogRoutes'))
app.use('/api/seo',        require('./routes/seoRoutes'))
app.use('/api/contact',      require('./routes/contactRoutes'))
app.use('/api/testimonials', require('./routes/testimonialRoutes'))
app.use('/api/faqs',         require('./routes/faqRoutes'))
app.use('/api/team',         require('./routes/teamRoutes'))
app.use('/api/services',     require('./routes/serviceRoutes'))
app.use('/api/admin',        require('./routes/adminRoutes'))
app.use('/api/newsletter',   require('./routes/newsletterRoutes'))

// Debug routes — development only (NEVER in production)
if (process.env.NODE_ENV === 'development') {
  app.use('/api/debug', require('./routes/debugRoutes'))
}

// ── Health check ───────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'Pharmez API is running 🚀', env: process.env.NODE_ENV })
})

// ── 404 ────────────────────────────────────────────────
app.use('*', (req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` })
})

// ── Global error handler ───────────────────────────────
app.use(errorHandler)

// ── Start server AFTER DB connects ────────────────────
const PORT = process.env.PORT || 5000

const start = async () => {
  try {
    await connectDB()
    await seedCategories()

    // Auto-create admin from env if not exists
    const adminEmail = process.env.SEED_ADMIN_EMAIL
    const adminPassword = process.env.SEED_ADMIN_PASSWORD
    if (adminEmail && adminPassword) {
      const existing = await User.findOne({ role: 'admin' })
      if (!existing) {
        await User.create({
          name: 'Admin',
          email: adminEmail,
          password: adminPassword,
          role: 'admin',
        })
        console.log(`✅ Admin created: ${adminEmail}`)
      } else {
        console.log(`ℹ️  Admin already exists: ${existing.email}`)
      }
    }

    app.listen(PORT, () => {
      console.log(`\n🚀 Server running on http://localhost:${PORT}`)
      console.log(`📦 Environment: ${process.env.NODE_ENV}\n`)
    })
  } catch (err) {
    console.error('❌ Failed to start server:', err.message)
    process.exit(1)
  }
}

start()
