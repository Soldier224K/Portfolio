import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import User from '../models/User.js'

const JWT_SECRET = process.env.JWT_SECRET || 'secret'
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'refresh-secret'
const OPS_PASSPHRASE_HASH = process.env.OPS_PASSPHRASE_HASH || ''

export const register = async (req, res) => {
  try {
    const { name, email, password, company } = req.body
    const passwordHash = await bcrypt.hash(password, 12)
    const user = await User.create({ name, email, passwordHash, company })
    res.status(201).json({ message: 'Registered successfully' })
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

export const login = async (req, res) => {
  try {
    const { email, password } = req.body
    const user = await User.findOne({ email })
    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      return res.status(401).json({ message: 'Invalid credentials' })
    }
    user.lastLogin = new Date()
    await user.save()
    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '15m' })
    const refreshToken = jwt.sign({ userId: user._id }, JWT_REFRESH_SECRET, { expiresIn: '7d' })
    res.json({ token, refreshToken, user: { id: user._id, name: user.name, email: user.email } })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const opsLogin = async (req, res) => {
  try {
    const { passphrase } = req.body
    const isValid = await bcrypt.compare(passphrase, OPS_PASSPHRASE_HASH)
    if (!isValid) {
      return res.status(401).json({ message: 'ACCESS DENIED' })
    }
    const token = jwt.sign({ ops: true }, JWT_SECRET, { expiresIn: '15m' })
    res.json({ token })
  } catch {
    res.status(401).json({ message: 'ACCESS DENIED' })
  }
}

export const refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body
    const decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET)
    const token = jwt.sign({ userId: decoded.userId }, JWT_SECRET, { expiresIn: '15m' })
    res.json({ token })
  } catch {
    res.status(401).json({ message: 'Invalid refresh token' })
  }
}

export const logout = (req, res) => {
  res.json({ message: 'Logged out' })
}