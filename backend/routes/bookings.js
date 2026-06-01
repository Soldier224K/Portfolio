import { Router } from 'express'
import { authenticate, opsAuthenticate } from '../middleware/authMiddleware.js'
import { create, getAll, update } from '../controllers/bookingController.js'

const router = Router()

router.post('/', authenticate, create)
router.get('/', opsAuthenticate, getAll)
router.put('/:id', opsAuthenticate, update)

export default router
