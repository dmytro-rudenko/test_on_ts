import { AlbumModel, AlbumDocument } from '../models/album.model'
import { PhotoModel } from '../models/photo.model'
import { Request, Response, NextFunction } from 'express'
import { ChangeAlbumTitleRequest } from '../requests'
import { STATUS, MESSAGE } from '../constants'
/**
 * Sign in using email and password.
 * @route PUT /change-album-title
 */

const changeAlbumTitle = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { albumId, newAlbumName } = req.body as ChangeAlbumTitleRequest

    if (!newAlbumName) {
      res.status(400).json({ status: STATUS.FAILED, message: MESSAGE.NEW_ALBUM_IS_REQUIRED })
    }

    const album = (await AlbumModel.findOneAndUpdate({ albumId }, { title: newAlbumName })) as AlbumDocument

    res.status(200).json({ status: STATUS.SUCCESS, album })
  } catch (err) {
    res.status(503).json({
      status: STATUS.FAILED,
      message: err.message,
    })
  }
}

/**
 * Delete album with photos by albumid list
 * @route DELETE /delete-album
 */
 const deleteAlbum = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { albumId } = req.body
    const albumIdList = albumId.includes(', ') ? albumId.split(', ') : [albumId]

    const searchParams = {
      albumId: {
        $in: albumIdList
      }
    }

    const { deletedCount } = await AlbumModel.deleteMany(searchParams)

    if (deletedCount > 0) {
      await PhotoModel.deleteMany(searchParams)

      res.status(200).json({ status: STATUS.SUCCESS, message: MESSAGE.ALBUM_DELETED })
    } else {
      res.status(400).json({ status: STATUS.FAILED, message: MESSAGE.ALBUM_NOT_FOUNDED })
    }

  } catch (err) {
    res.status(503).json({
      status: STATUS.FAILED,
      message: err.message,
    })
  }
}

export const AlbumController = { changeAlbumTitle, deleteAlbum }
