import mongoose from 'mongoose'
import { NextFunction } from 'express'
export type PhotoDocument = mongoose.Document & {
  album: mongoose.Schema.Types.ObjectId;
  title: string;
  url: string;
  thumbnailUrl: string;
  owner: mongoose.Schema.Types.ObjectId;
  albumId: string;
};

const photoSchema = new mongoose.Schema<PhotoDocument>(
  {
    album: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Album',
    },
    title: {
      type: String
    },
    url: {
      type: String,
    },
    thumbnailUrl: {
      type: String,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    albumId: { 
      type: Number 
    }
  },
  {
    timestamps: true,
  },
)

photoSchema.pre(/^find/, function (next: NextFunction) {
  this.populate({
    path: 'owner',
  }).populate({
    path: 'album',
  })
  next()
})
export const PhotoModel = mongoose.model<PhotoDocument>('Photo', photoSchema)