import { Router } from 'express'
import { authenticate, opsAuthenticate } from '../middleware/authMiddleware.js'
import { logVisit, getAll } from '../controllers/visitorController.js'

const router = Router()

router.post('/log', authenticate, logVisit)
router.get('/', opsAuthenticate, getAll)

export default router
