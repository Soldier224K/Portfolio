import Visitor from '../models/Visitor.js'

export const logVisit = async (req, res) => {
  try {
    const { name, email, company, purpose, pagesViewed, timeSpent } = req.body

    const visitor = await Visitor.create({
      userId: req.userId,
      name,
      email,
      company,
      purpose,
      pagesViewed,
      timeSpent,
      loginTimestamp: new Date(),
    })

    res.status(201).json({ message: 'Visit logged', id: visitor._id })
  } catch (err) {
    res.status(500).json({ message: 'Failed to log visit', error: err.message })
  }
}

export const getAll = async (req, res) => {
  try {
    const visitors = await Visitor.find()
      .populate('userId', 'name email')
      .sort({ loginTimestamp: -1 })

    res.json(visitors)
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch visitors', error: err.message })
  }
}
