import { Router } from 'express'
import { getMetrics, updateMetrics } from '../controllers/metricsController.js'
import { opsAuthenticate } from '../middleware/authMiddleware.js'

const router = Router()

router.get('/', getMetrics)
router.put('/', opsAuthenticate, updateMetrics)

export default router