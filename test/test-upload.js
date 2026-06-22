const fs = require('fs')
const path = require('path')
const { saveFile, deleteFile } = require('../src/utils/storage')

const uploadDir = path.join(__dirname, '../uploads')
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true })

const filename = `test-${Date.now()}.txt`
const filePath = path.join(uploadDir, filename)
fs.writeFileSync(filePath, 'hello world')

const fileObj = { path: filePath, filename }

;(async () => {
  console.log('File exists before save:', fs.existsSync(filePath))
  const res = await saveFile(fileObj)
  console.log('saveFile result:', res)
  // Now delete
  await deleteFile(res.public_id || res.url || `/uploads/${filename}`)
  console.log('File exists after delete:', fs.existsSync(filePath))
})().catch(err => { console.error(err); process.exit(1) })
