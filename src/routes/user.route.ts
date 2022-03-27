import { UserController } from '../controllers'
import { Router } from 'express'
import { isAuthenticated } from '../middlewares'

const router = Router()

router.post('/login', UserController.signIn)
router.post('/register', UserController.signUp)
router.get('/logout', isAuthenticated, UserController.signOut)

export const UserRoute = router