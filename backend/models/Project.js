import mongoose from 'mongoose'

const ProjectSchema = new mongoose.Schema({
  title: String,
  problem: String,
  solution: String,
  techStack: [String],
  outcome: String,
  detailContent: String,
  status: { type: String, enum: ['active', 'completed', 'shelved'], default: 'active' },
  missionPriority: { type: String, enum: ['low', 'medium', 'high', 'critical'], default: 'medium' },
  startDate: Date,
  endDate: Date,
  isPublic: { type: Boolean, default: true },
}, { timestamps: true })

export default mongoose.model('Project', ProjectSchema)