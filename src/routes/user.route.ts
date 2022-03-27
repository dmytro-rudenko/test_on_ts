import { UserController } from "../controllers";
import { Router } from "express";
import { isAuthenticated } from "../middlewares";

const router = Router();

router.post("/login", UserController.signIn);
router.post("/register", UserController.signUp);
router.get("/logout", UserController.signOut);
router.get("/user", isAuthenticated, UserController.getUser);

export const UserRoute = router;