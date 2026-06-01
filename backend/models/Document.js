import mongoose from 'mongoose'

const DocumentSchema = new mongoose.Schema({
  filenameEncrypted: String,
  contentEncrypted: String,
  iv: String,
  tag: String,
  mimeType: String,
  fileSize: Number,
  linkedProjectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project' },
}, { timestamps: true })

export default mongoose.model('Document', DocumentSchema)
