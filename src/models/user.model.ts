import bcrypt from 'bcrypt-nodejs'
import mongoose from 'mongoose'
export type UserDocument = mongoose.Document & {
    login: string;
    email: string;
    password: string;
    comparePassword: comparePasswordFunction;
};

type comparePasswordFunction = (candidatePassword: string, cb: (err: any, isMatch: any) => void) => void;

const userSchema = new mongoose.Schema<UserDocument>(
    {
        email: { type: String, unique: true },
        login: { type: String, unique: true },
        password: String,
    },
    { timestamps: true },
)

/**
 * Password hash middleware.
 */

userSchema.pre('save', function save(next) {
    const user = this as UserDocument
    if (!user.isModified('password')) return next()

    bcrypt.genSalt(10, (err, salt) => {
        if (err) return next(err)

        bcrypt.hash(user.password, salt, undefined, (err: mongoose.Error, hash) => {
            if (err) return next(err)

            user.password = hash
            next()
        })
    })
})

const comparePassword: comparePasswordFunction = function (candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, (err: mongoose.Error, isMatch: boolean) => {
        cb(err, isMatch)
    })
}

userSchema.methods.comparePassword = comparePassword
export const UserModel = mongoose.model<UserDocument>('User', userSchema)
