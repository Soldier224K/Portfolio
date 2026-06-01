import { Router } from 'express'
import { authenticate, opsAuthenticate } from '../middleware/authMiddleware.js'
import { getPublicProjects, getProjectDetail, createProject, updateProject, deleteProject } from '../controllers/projectController.js'

const router = Router()

router.get('/', getPublicProjects)
router.get('/:id', authenticate, getProjectDetail)
router.post('/', opsAuthenticate, createProject)
router.put('/:id', opsAuthenticate, updateProject)
router.delete('/:id', opsAuthenticate, deleteProject)

export default router