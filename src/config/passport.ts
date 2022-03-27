import passport from "passport";
import passportLocal from "passport-local";

import { UserModel, UserDocument } from "../models/user.model";
import { NativeError } from "mongoose";

type userSearchParamsType = {
    email: string;
    login: string;
};

const LocalStrategy = passportLocal.Strategy;

passport.serializeUser<any, any>((req, user, done) => {
    done(undefined, user);
});

passport.deserializeUser((id, done) => {
    UserModel.findById(id, (err: NativeError, user: UserDocument) => done(err, user));
});

/**
 * Sign in using Email and Password.
 */
passport.use(
    new LocalStrategy(
        {
            usernameField: "userIdentificator",
            passReqToCallback: true
        },
        (req, userIdentificator, password, done) => {
            const { login, email } = req.body;
            
            // req.session.cookie.expires = new Date(Date.now() + 60 * 1000);

            const userSearchParams = {} as userSearchParamsType;
            userSearchParams[email ? "email": "login"] = userIdentificator;

            UserModel.findOne(userSearchParams, (err: NativeError, user: UserDocument) => {
                if (err) return done(err);
                
                if (!user) {
                    const message = email ? `User with email ${email} not found.` : `User with Login ${login} not found.`;
                    return done(undefined, false, { message });
                }
                
                user.comparePassword(password, (err: Error, isMatch: boolean) => {
                    if (err) { return done(err); }
                    if (isMatch) {
                        return done(undefined, user);
                    }
                    return done(undefined, false, { message: `Invalid ${email ? "email": "login"} or password.` });
                });
            });
        }
    )
);


/**
 * OAuth Strategy Overview
 *
 * - User is already logged in.
 *   - Check if there is an existing account with a provider id.
 *     - If there is, return an error message. (Account merging not supported)
 *     - Else link new OAuth account with currently logged-in user.
 * - User is not logged in.
 *   - Check if it's a returning user.
 *     - If returning user, sign in and we are done.
 *     - Else check if there is an existing account with user's email.
 *       - If there is, return an error message.
 *       - Else create a new account.
 */



