import { Router } from 'express'
import multer from 'multer'
import { opsAuthenticate } from '../middleware/authMiddleware.js'
import { getAll, getOne, upload, deleteDoc } from '../controllers/documentController.js'

const router = Router()
const storage = multer.memoryStorage()
const uploadMiddleware = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 } }) // 10MB limit

router.get('/', opsAuthenticate, getAll)
router.get('/:id', opsAuthenticate, getOne)
router.post('/upload', opsAuthenticate, uploadMiddleware.single('file'), upload)
router.delete('/:id', opsAuthenticate, deleteDoc)

export default router
