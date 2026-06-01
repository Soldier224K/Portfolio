import mongoose from 'mongoose'

const VisitorSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  name: String,
  email: String,
  company: String,
  purpose: String,
  pagesViewed: [String],
  timeSpent: Number,
  loginTimestamp: Date,
}, { timestamps: true })

export default mongoose.model('Visitor', VisitorSchema)
