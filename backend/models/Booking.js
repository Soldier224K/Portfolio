import mongoose from 'mongoose'

const BookingSchema = new mongoose.Schema({
  visitorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  name: String,
  email: String,
  company: String,
  requestType: { type: String, enum: ['hire', 'consult', 'collaborate'] },
  message: String,
  preferredDate: Date,
  status: { type: String, enum: ['pending', 'confirmed', 'declined'], default: 'pending' },
}, { timestamps: true })

export default mongoose.model('Booking', BookingSchema)
