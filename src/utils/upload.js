const multer = require('multer')
const path = require('path')
const fs = require('fs')

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, '../../uploads')
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true })
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir)
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9)
    cb(null, uniqueSuffix + path.extname(file.originalname))
  },
})

const fileFilter = (req, file, cb) => {
  const imageTypes = /jpeg|jpg|png|webp/
  const videoTypes = /mp4|webm|mov|avi|mkv/
  const extname = path.extname(file.originalname).toLowerCase()
  const isImage = imageTypes.test(extname) && imageTypes.test(file.mimetype)
  const isVideo = videoTypes.test(extname)

  if (isImage || isVideo) {
    cb(null, true)
  } else {
    cb(new Error('Only image (jpeg, jpg, png, webp) and video (mp4, webm, mov) files are allowed'), false)
  }
}

const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB limit (videos need more space)
  fileFilter,
})

module.exports = upload
