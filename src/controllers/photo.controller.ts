import { AlbumModel, AlbumDocument } from '../models/album.model'
import { PhotoModel, PhotoDocument } from '../models/photo.model'
import { Request, Response, NextFunction } from 'express'
import { STATUS, MESSAGE } from '../constants'
import axios from 'axios'
/**
 * Save photo from jsonplaceholder
 * @route POST /load-photos
 */

const loadPhotos = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { data } = await axios.get('http://jsonplaceholder.typicode.com/photos')

    for (const photo of data) {
      const { albumId, title, url, thumbnailUrl } = photo
      // @ts-ignore
      const owner = req.user._id
      let album = await AlbumModel.findOne({ albumId })

      if (!album) {
        const albumData = {
          albumId,
          title: albumId,
          owner,
        } as AlbumDocument

        album = await AlbumModel.create(albumData)
      }

      const photoData = {
        title,
        url,
        thumbnailUrl,
        owner,
        album: album._id,
      } as PhotoDocument

      await PhotoModel.create(photoData)
    }

    res.status(200).json({ status: STATUS.SUCCESS, message: MESSAGE.PHOTOS_LOADED })
  } catch (err) {
    const statusCode = err?.response.status || 503

    res.status(statusCode).json({
      status: STATUS.FAILED,
      message: err.message,
    })
  }
}
/**
 * Return photos
 * @route GET /get-photos
 */


const getPhotos = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const page = req.body.page || 1
    const maxCount = req.body.maxCount || 10

    const skip = (page - 1) * maxCount

    const searchParams = {
      owner: req.body.ownerId,
    }

    const photos = await PhotoModel
      .find(searchParams)
      .limit(maxCount)
      .skip(skip)

    res.status(200).json({ status: STATUS.SUCCESS, photos })
  } catch (err) {
    res.status(503).json({
      status: STATUS.FAILED,
      message: err.message,
    })
  }
}
/**
 * Delete photo by id
 * @route DELETE /delete-photos/:id
 */
const deletePhoto = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    await PhotoModel.findByIdAndRemove(req.params.id)

    res.status(200).json({ status: STATUS.SUCCESS, message: MESSAGE.PHOTO_DELETED })
  } catch (err) {
    res.status(503).json({
      status: STATUS.FAILED,
      message: err.message,
    })
  }
}

export const PhotoController = { loadPhotos, getPhotos, deletePhoto }
