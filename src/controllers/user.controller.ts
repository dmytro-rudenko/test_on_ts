import passport from "passport";
import { UserModel, UserDocument } from "../models/user.model";
import { Request, Response, NextFunction } from "express";
import { IVerifyOptions } from "passport-local";
import { body, check, validationResult } from "express-validator";
import "../config/passport";
import { NativeError } from "mongoose";

/**
 * Sign in using email and password.
 * @route POST /login
 */
const signIn = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    if (req.body.email) {
        await check("email", "Email is not valid")
            .isEmail()
            .run(req);

        await body("email")
            .normalizeEmail({ gmail_remove_dots: false })
            .run(req);
        req.body.userIdentificator = req.body.email;
    } else {
        await check("login", "Login cannot be blank")
            .isLength({ min: 1 })
            .run(req);
        req.body.userIdentificator = req.body.login;
    }

    await check("password", "Password cannot be blank").isLength({ min: 1 }).run(req);

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        res.status(403).json({ errors: errors.array() });
        return;
    }

    passport.authenticate("local", (err: Error, user: UserDocument, info: IVerifyOptions) => {
        if (err) { return next(err); }
        if (!user) {
            res.status(400).json({ message: info.message });
            return;
        }
        req.logIn(user, (err) => {
            if (err) {
                return next(err);
            }

            res.status(200).json(user);
        });
    })(req, res, next);
};

/**
 * Log out.
 * @route GET /logout
 */
const signOut = (req: Request, res: Response): void => {
    req.logout();
    res.status(200).json({ message: "Logged out" });
};

/**
 * Create a new local account.
 * @route POST /signup
 */
const signUp = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { email, login, password } = req.body;

    if (email) {
        await check("email", "Email is not valid")
            .isEmail()
            .run(req);
        await body("email").normalizeEmail({ gmail_remove_dots: false }).run(req);
    } else {
        await check("login", "Login cannot be blank")
            .isLength({ min: 1 })
            .run(req);
    }
    await check("password", "Password must be at least 8 characters long").isLength({ min: 8 }).run(req);
    // await check("confirmPassword", "Passwords do not match").equals(req.body.password).run(req);
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        res.status(403).json({ errors: errors.array() });
        return;
    }

    const newUserData = email ? { email, password } : { login, password };

    const user = new UserModel(newUserData);

    UserModel.findOne({ $or: [{ email }, { login }] }, (err: NativeError, existingUser: UserDocument) => {
        if (err) { return next(err); }
        if (existingUser) {
            return res.status(403).json({
                message: "Account with that email address or login already exists."
            });
        }
        user.save((err) => {
            if (err) { return next(err); }
            req.logIn(user, (err) => {
                if (err) {
                    return next(err);
                }
                res.status(200).json(user);
            });
        });
    });
};

/**
 * Profile page.
 * @route GET /user
 */
const getUser = (req: Request, res: Response): void => {
    res.status(200).json({
        user: req.user
    });
};

export const UserController = { signIn, signUp, signOut, getUser };