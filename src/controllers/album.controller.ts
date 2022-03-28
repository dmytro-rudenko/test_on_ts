import { AlbumModel, AlbumDocument } from '../models/album.model'
import { Request, Response, NextFunction } from 'express'
import { ChangeAlbumTitleRequest } from '../requests'
import { STATUS, MESSAGE } from '../constants'
/**
 * Sign in using email and password.
 * @route POST /change-album-title
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

export const AlbumController = { changeAlbumTitle }
