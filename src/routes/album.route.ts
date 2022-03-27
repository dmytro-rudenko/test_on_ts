import { AlbumController } from '../controllers'
import { Router } from 'express'
import { isAuthenticated } from '../middlewares'

const router = Router()

router.post('/change-album-title', isAuthenticated, AlbumController.changeAlbumTitle)

export const AlbumRoute = router