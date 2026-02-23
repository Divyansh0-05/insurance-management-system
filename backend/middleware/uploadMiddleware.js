const fs = require('fs')
const path = require('path')
const multer = require('multer')

const uploadDir = path.join(process.cwd(), 'uploads', 'claims')
if(!fs.existsSync(uploadDir)){
  fs.mkdirSync(uploadDir, { recursive: true })
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadDir)
  },
  filename: (_req, file, cb) => {
    const safeOriginal = file.originalname.replace(/\s+/g, '_')
    cb(null, `${Date.now()}-${safeOriginal}`)
  },
})

const allowedMimeTypes = ['image/jpeg', 'image/png', 'application/pdf']

const fileFilter = (_req, file, cb) => {
  if(!allowedMimeTypes.includes(file.mimetype)){
    const err = new Error('Invalid file type. Only jpg, png, and pdf are allowed.')
    err.status = 400
    return cb(err)
  }
  return cb(null, true)
}

const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 },
  fileFilter,
})

module.exports = upload
