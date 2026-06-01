import mongoose from 'mongoose'

const IdeaSchema = new mongoose.Schema({
  titleEncrypted: String,
  titleIv: String,
  titleTag: String,
  contentEncrypted: String,
  contentIv: String,
  contentTag: String,
  classificationLevel: { type: String, enum: ['low', 'restricted', 'top-secret'], default: 'low' },
  domain: String,
  status: { type: String, enum: ['raw', 'developing', 'ready-to-build', 'archived'], default: 'raw' },
}, { timestamps: true })

export default mongoose.model('Idea', IdeaSchema)