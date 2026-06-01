import Idea from '../models/Idea.js'
import { encrypt, decrypt } from '../utils/encryption.js'

export const getAll = async (req, res) => {
  try {
    const ideas = await Idea.find().sort({ createdAt: -1 })

    const decryptedIdeas = ideas.map((idea) => {
      const doc = idea.toObject()
      try {
        doc.title = decrypt({
          encrypted: doc.titleEncrypted,
          iv: doc.titleIv,
          tag: doc.titleTag,
        })
        doc.content = decrypt({
          encrypted: doc.contentEncrypted,
          iv: doc.contentIv,
          tag: doc.contentTag,
        })
      } catch {
        doc.title = '[Decryption failed]'
        doc.content = '[Decryption failed]'
      }
      // Remove encrypted fields from response
      delete doc.titleEncrypted
      delete doc.titleIv
      delete doc.titleTag
      delete doc.contentEncrypted
      delete doc.contentIv
      delete doc.contentTag
      return doc
    })

    res.json(decryptedIdeas)
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch ideas', error: err.message })
  }
}

export const create = async (req, res) => {
  try {
    const { title, content, classificationLevel, domain, status } = req.body

    if (!title || !content) {
      return res.status(400).json({ message: 'Title and content are required' })
    }

    const encTitle = encrypt(title)
    const encContent = encrypt(content)

    const idea = await Idea.create({
      titleEncrypted: encTitle.encrypted,
      titleIv: encTitle.iv,
      titleTag: encTitle.tag,
      contentEncrypted: encContent.encrypted,
      contentIv: encContent.iv,
      contentTag: encContent.tag,
      classificationLevel,
      domain,
      status,
    })

    res.status(201).json({ message: 'Idea created', id: idea._id })
  } catch (err) {
    res.status(500).json({ message: 'Failed to create idea', error: err.message })
  }
}

export const update = async (req, res) => {
  try {
    const { title, content, classificationLevel, domain, status } = req.body
    const updateFields = {}

    if (title) {
      const encTitle = encrypt(title)
      updateFields.titleEncrypted = encTitle.encrypted
      updateFields.titleIv = encTitle.iv
      updateFields.titleTag = encTitle.tag
    }

    if (content) {
      const encContent = encrypt(content)
      updateFields.contentEncrypted = encContent.encrypted
      updateFields.contentIv = encContent.iv
      updateFields.contentTag = encContent.tag
    }

    if (classificationLevel) updateFields.classificationLevel = classificationLevel
    if (domain) updateFields.domain = domain
    if (status) updateFields.status = status

    const idea = await Idea.findByIdAndUpdate(req.params.id, updateFields, { new: true })
    if (!idea) return res.status(404).json({ message: 'Idea not found' })

    res.json({ message: 'Idea updated', id: idea._id })
  } catch (err) {
    res.status(500).json({ message: 'Failed to update idea', error: err.message })
  }
}

export const deleteIdea = async (req, res) => {
  try {
    const idea = await Idea.findByIdAndDelete(req.params.id)
    if (!idea) return res.status(404).json({ message: 'Idea not found' })

    res.json({ message: 'Idea deleted' })
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete idea', error: err.message })
  }
}
