import mongoose from 'mongoose'

const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  passwordHash: String,
  company: String,
  role: String,
  purpose: String,
  lastLogin: Date,
  sessionsLog: [{
    page: String,
    duration: Number,
    timestamp: Date,
  }],
}, { timestamps: true })

export default mongoose.model('User', UserSchema)