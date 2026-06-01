import Document from '../models/Document.js'
import { encrypt, decrypt } from '../utils/encryption.js'

export const upload = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' })
    }

    const { originalname, mimetype, size, buffer } = req.file
    const { linkedProjectId } = req.body

    // Encrypt filename
    const encFilename = encrypt(originalname)

    // Encrypt file content as base64 string
    const base64Content = buffer.toString('base64')
    const encContent = encrypt(base64Content)

    const doc = await Document.create({
      filenameEncrypted: encFilename.encrypted,
      contentEncrypted: encContent.encrypted,
      // Store both ivs and tags as JSON since the schema has single iv/tag fields
      iv: JSON.stringify({ filename: encFilename.iv, content: encContent.iv }),
      tag: JSON.stringify({ filename: encFilename.tag, content: encContent.tag }),
      mimeType: mimetype,
      fileSize: size,
      linkedProjectId: linkedProjectId || null,
    })

    res.status(201).json({ message: 'Document uploaded', id: doc._id })
  } catch (err) {
    res.status(500).json({ message: 'Failed to upload document', error: err.message })
  }
}

export const getAll = async (req, res) => {
  try {
    const docs = await Document.find().sort({ createdAt: -1 }).select('-contentEncrypted')

    const result = docs.map((doc) => {
      const obj = doc.toObject()
      try {
        const ivs = JSON.parse(obj.iv)
        const tags = JSON.parse(obj.tag)
        obj.filename = decrypt({
          encrypted: obj.filenameEncrypted,
          iv: ivs.filename,
          tag: tags.filename,
        })
      } catch {
        obj.filename = '[Decryption failed]'
      }
      delete obj.filenameEncrypted
      delete obj.iv
      delete obj.tag
      return obj
    })

    res.json(result)
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch documents', error: err.message })
  }
}

export const getOne = async (req, res) => {
  try {
    const doc = await Document.findById(req.params.id)
    if (!doc) return res.status(404).json({ message: 'Document not found' })

    const obj = doc.toObject()
    const ivs = JSON.parse(obj.iv)
    const tags = JSON.parse(obj.tag)

    const filename = decrypt({
      encrypted: obj.filenameEncrypted,
      iv: ivs.filename,
      tag: tags.filename,
    })

    const base64Content = decrypt({
      encrypted: obj.contentEncrypted,
      iv: ivs.content,
      tag: tags.content,
    })

    res.json({
      _id: obj._id,
      filename,
      content: base64Content,
      mimeType: obj.mimeType,
      fileSize: obj.fileSize,
      linkedProjectId: obj.linkedProjectId,
      createdAt: obj.createdAt,
      updatedAt: obj.updatedAt,
    })
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch document', error: err.message })
  }
}

export const deleteDoc = async (req, res) => {
  try {
    const doc = await Document.findByIdAndDelete(req.params.id)
    if (!doc) return res.status(404).json({ message: 'Document not found' })

    res.json({ message: 'Document deleted' })
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete document', error: err.message })
  }
}
