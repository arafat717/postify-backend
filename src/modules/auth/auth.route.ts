import { Router } from "express";
import { authController } from "./auth.controller";

const router = Router();

router.post("/login", authController.loginUser);
router.get("/me",  authController.getMyProfile);

export const authRoute = router;
