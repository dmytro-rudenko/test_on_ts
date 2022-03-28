import { AlbumController } from '../controllers'
import { Router } from 'express'
import { isAuthenticated } from '../middlewares'

const router = Router()

router.put('/change-album-title', isAuthenticated, AlbumController.changeAlbumTitle)
router.delete('/delete-album', isAuthenticated, AlbumController.deleteAlbum)

export const AlbumRoute = router