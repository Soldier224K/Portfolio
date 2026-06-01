import { Router } from 'express'
import { opsAuthenticate } from '../middleware/authMiddleware.js'
import { getAll, create, update, deleteIdea } from '../controllers/ideaController.js'

const router = Router()

router.get('/', opsAuthenticate, getAll)
router.post('/', opsAuthenticate, create)
router.put('/:id', opsAuthenticate, update)
router.delete('/:id', opsAuthenticate, deleteIdea)

export default router
