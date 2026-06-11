require('dotenv').config()
const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const path = require('path')
const connectDB = require('./config/db')
const errorHandler = require('./middleware/errorHandler')

// Connect to MongoDB
connectDB()

const app = express()

// Middleware
const allowedOrigins = [
  process.env.CLIENT_URL,
  'http://localhost:5173',
  'http://localhost:3000',
].filter(Boolean)

app.use(cors({
  origin: (origin, cb) => {
    // Allow requests with no origin (mobile apps, curl, etc.)
    if (!origin) return cb(null, true)
    if (allowedOrigins.includes(origin)) return cb(null, true)
    // Allow any sub-origin on localhost for dev
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

// Serve uploaded images as static files
app.use('/uploads', express.static(path.join(__dirname, '../uploads')))

// ─── API Routes ───────────────────────────────────────────
app.use('/api/setup', require('./routes/setupRoutes'))       // First-time admin setup
app.use('/api/auth', require('./routes/authRoutes'))
app.use('/api/products', require('./routes/productRoutes'))
app.use('/api/categories', require('./routes/categoryRoutes'))
app.use('/api/orders', require('./routes/orderRoutes'))
app.use('/api/blogs', require('./routes/blogRoutes'))        // Blog
app.use('/api/seo', require('./routes/seoRoutes'))           // SEO (public)
app.use('/api/admin', require('./routes/adminRoutes'))

// Health check
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'Pharmez API is running 🚀', env: process.env.NODE_ENV })
})

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` })
})

// Global error handler
app.use(errorHandler)

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`)
  console.log(`📦 Environment: ${process.env.NODE_ENV}`)
  console.log(`\n📋 Setup Admin: POST http://localhost:${PORT}/api/setup/create-admin`)
  console.log(`📋 Check Status: GET  http://localhost:${PORT}/api/setup/status\n`)
})
