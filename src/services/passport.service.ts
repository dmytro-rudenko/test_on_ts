import passport from 'passport'
import passportLocal from 'passport-local'

import { UserModel, UserDocument } from '../models/user.model'
import { NativeError } from 'mongoose'

type userSearchParamsType = {
    email: string;
    login: string;
};

const LocalStrategy = passportLocal.Strategy

passport.serializeUser<any, any>((req, user, done) => {
    done(undefined, user as UserDocument)
})

passport.deserializeUser((id, done) => {
    UserModel.findById(id, (err: NativeError, user: UserDocument) => done(err, user))
})

/**
 * Sign in using Email and Password.
 */
passport.use(
    new LocalStrategy(
        {
            usernameField: 'userIdentificator',
            passReqToCallback: true
        },
        (req, userIdentificator, password, done) => {
            const { email, login } = req.body as userSearchParamsType
            // req.session.cookie.expires = new Date(Date.now() + 60 * 1000);
            const userSearchParams = {} as userSearchParamsType
            userSearchParams[email ? 'email' : 'login'] = userIdentificator

            UserModel.findOne(userSearchParams, (err: NativeError, user: UserDocument) => {
                if (err) return done(err)

                if (!user) {
                    const message = email ? `User with email ${email} not found.` : `User with Login ${login} not found.`
                    return done(undefined, false, { message })
                }

                user.comparePassword(password, (err: Error, isMatch: boolean) => {
                    if (err) { return done(err) }
                    if (isMatch) {
                        return done(undefined, user)
                    }
                    return done(undefined, false, { message: `Invalid ${email ? 'email' : 'login'} or password.` })
                })
            })
        }
    )
)




