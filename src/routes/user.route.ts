import { userController } from "../controllers";
import { Router } from 'express';
import * as passportConfig from "../config/passport";

const router = Router()

router.post("/login", userController.postLogin);
router.get("/logout", userController.logout);
router.post("/register", userController.postSignup);
router.get("/account", passportConfig.isAuthenticated, userController.getAccount)

export const UserRoutes = router