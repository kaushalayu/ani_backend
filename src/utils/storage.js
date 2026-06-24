const fs = require('fs')
const path = require('path')
let cloudinary
let useCloud = false

try {
  cloudinary = require('cloudinary').v2
  if (process.env.CLOUDINARY_URL || (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY)) {
    cloudinary.config({ secure: true })
    useCloud = true
  }
} catch (err) {
  // cloudinary not installed — fall back to local storage
}

const getLocalBase = () => {
  if (process.env.BACKEND_URL) return process.env.BACKEND_URL.replace(/\/$/, '')
  const port = process.env.PORT || 5000
  return `http://localhost:${port}`
}

const saveFile = async (file) => {
  if (!file) return { url: '', public_id: '' }
  // If Cloudinary configured, upload and remove local file
  if (useCloud) {
    try {
      const res = await cloudinary.uploader.upload(file.path, { folder: 'painomed' })
      try { fs.unlinkSync(file.path) } catch (e) {}
      return { url: res.secure_url || res.url || '', public_id: res.public_id || '' }
    } catch (err) {
      return { url: `${getLocalBase()}/uploads/${file.filename}`, public_id: '' }
    }
  }

  // Default: return absolute URL to local uploads so frontend can fetch after redeploys when using a stable backend
  return { url: `${getLocalBase()}/uploads/${file.filename}`, public_id: '' }
}

const deleteFile = async (info) => {
  // info can be a public_id (string) or a local URL/path
  if (!info) return
  // If cloud is used and info looks like a public_id, attempt cloud deletion
  if (useCloud && typeof info === 'string' && info && !info.startsWith('/uploads') && !info.startsWith('http')) {
    try { await cloudinary.uploader.destroy(info) } catch (e) {}
    return
  }

  // If info is a cloud URL, try to extract public_id if possible
  if (useCloud && typeof info === 'string' && info.includes('res.cloudinary.com')) {
    // best-effort: public_id is last part before extension
    try {
      const parts = info.split('/')
      const last = parts[parts.length - 1]
      const public_id = last.replace(/\.[a-zA-Z0-9]+(\?.*)?$/, '')
      if (public_id) await cloudinary.uploader.destroy(public_id)
    } catch (e) {}
    return
  }

  // Otherwise assume local uploads path or absolute URL pointing to /uploads/
  try {
    let filename = info
    if (typeof info === 'string') {
      if (info.startsWith('http')) {
        const urlPath = new URL(info).pathname
        filename = urlPath
      }
    }
    if (filename && filename.startsWith('/uploads/')) {
      const filePath = path.join(__dirname, '../../', filename)
      if (fs.existsSync(filePath)) {
        try { fs.unlinkSync(filePath) } catch (e) {}
      }
    }
  } catch (e) {}
}

module.exports = { saveFile, deleteFile }
