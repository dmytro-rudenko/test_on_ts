import { Router } from 'express'
import { PhotoController } from '../controllers'
import { isAuthenticated } from '../middlewares'

const router = Router()

router.post('/load-photos', isAuthenticated, PhotoController.loadPhotos)
router.get('/get-photos', PhotoController.getPhotos)
router.delete('/delete-photo', PhotoController.deletePhoto)

export const PhotoRoute = router