import Booking from '../models/Booking.js'

export const create = async (req, res) => {
  try {
    const { name, email, company, requestType, message, preferredDate } = req.body

    if (!name || !email || !requestType) {
      return res.status(400).json({ message: 'Name, email, and request type are required' })
    }

    const booking = await Booking.create({
      visitorId: req.userId,
      name,
      email,
      company,
      requestType,
      message,
      preferredDate,
    })

    res.status(201).json({ message: 'Booking created', id: booking._id })
  } catch (err) {
    res.status(500).json({ message: 'Failed to create booking', error: err.message })
  }
}

export const getAll = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate('visitorId', 'name email')
      .sort({ createdAt: -1 })

    res.json(bookings)
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch bookings', error: err.message })
  }
}

export const update = async (req, res) => {
  try {
    const { status } = req.body

    if (!status || !['pending', 'confirmed', 'declined'].includes(status)) {
      return res.status(400).json({ message: 'Valid status is required (pending, confirmed, declined)' })
    }

    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true },
    )

    if (!booking) return res.status(404).json({ message: 'Booking not found' })

    res.json({ message: 'Booking updated', booking })
  } catch (err) {
    res.status(500).json({ message: 'Failed to update booking', error: err.message })
  }
}
