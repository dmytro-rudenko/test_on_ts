import { AlbumModel, AlbumDocument } from "../models/album.model";
import { Request, Response, NextFunction } from "express";
/**
 * Sign in using email and password.
 * @route POST /change-album-title
 */
const changeAlbumTitle = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  res.status(200).json({ text: "changeAlbumTitle" });
};

export const AlbumController = { changeAlbumTitle };
