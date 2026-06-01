import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import dotenv from 'dotenv'
import connectDB from './config/db.js'
import { rateLimiter } from './middleware/rateLimiter.js'
import authRoutes from './routes/auth.js'
import projectRoutes from './routes/projects.js'
import metricsRoutes from './routes/metrics.js'
import ideaRoutes from './routes/ideas.js'
import documentRoutes from './routes/documents.js'
import bookingRoutes from './routes/bookings.js'
import visitorRoutes from './routes/visitors.js'

dotenv.config()
connectDB()

const app = express()

app.use(cors({ origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173' }))
app.use(helmet())
app.use(express.json())

// Apply rate limiter to auth routes (5 attempts per 15 minutes per IP)
const authRateLimiter = rateLimiter(5, 15 * 60 * 1000)
app.use('/api/auth', authRateLimiter, authRoutes)

app.use('/api/projects', projectRoutes)
app.use('/api/metrics', metricsRoutes)
app.use('/api/ideas', ideaRoutes)
app.use('/api/documents', documentRoutes)
app.use('/api/bookings', bookingRoutes)
app.use('/api/visitors', visitorRoutes)

app.get('/', (req, res) => {
  res.json({ message: 'Portfolio API' })
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))