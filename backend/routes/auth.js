import { Router } from 'express'
import { register, login, opsLogin, refreshToken, logout } from '../controllers/authController.js'

const router = Router()

router.post('/register', register)
router.post('/login', login)
router.post('/ops-login', opsLogin)
router.post('/refresh', refreshToken)
router.post('/logout', logout)

export default router