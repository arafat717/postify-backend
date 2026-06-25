import { NextFunction, Request, Response, Router } from "express";
import { authController } from "./auth.controller";
import { jwtUtils } from "../../utils/jwt";
import config from "../../config";
import { Role } from "../../../generated/prisma/enums";

const router = Router();

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        name: string;
        email: string;
        role: Role;
      };
    }
  }
}

router.post("/login", authController.loginUser);
router.get(
  "/me",
  (req: Request, res: Response, next: NextFunction) => {
    const { accessToken } = req.cookies;

    const verifiedToken = jwtUtils.verifyToken(
      accessToken,
      config.jwt_access_secret,
    );

    if (typeof verifiedToken === "string") {
      throw new Error(verifiedToken);
    }

    const { email, name, role, id } = verifiedToken;

    const reqireRoles = [Role.ADMIN, Role.USER, Role.AUTHOR];

    if (!reqireRoles.includes(role)) {
      return res.status(403).json({
        success: false,
        statusCode: 403,
        message:
          "Frobidden. You don't have permission to access this resource.",
      });
    }

    req.user = {
      id,
      name,
      email,
      role,
    };

    next();
  },
  authController.getMyProfile,
);

export const authRoute = router;
