import mongoose from 'mongoose'
export type AlbumDocument = mongoose.Document & {
    albumId: number;
    title: string;
    owner: mongoose.Schema.Types.ObjectId;
};

const albumSchema = new mongoose.Schema<AlbumDocument>(
    {
        albumId: { type: Number, unique: true },
        title: { type: String },
        owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    },
    { timestamps: true },
)
export const AlbumModel = mongoose.model<AlbumDocument>('Album', albumSchema)
