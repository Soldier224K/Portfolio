import mongoose from 'mongoose'

const MetricsSchema = new mongoose.Schema({
  githubCommitsThisWeek: { type: Number, default: 0 },
  hoursCoded: { type: Number, default: 0 },
  currentObsession: String,
  status: { type: String, enum: ['building', 'thinking', 'resting'], default: 'building' },
})

export default mongoose.models.Metrics || mongoose.model('Metrics', MetricsSchema)