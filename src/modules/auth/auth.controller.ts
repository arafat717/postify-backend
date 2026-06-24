import { Request, Response } from "express";
import { authService } from "./auth.service";
import { sentResponse } from "../../utils/sentResponse";
import httpsStatus from "http-status-codes";
import { catchAsync } from "../../utils/catchAsync";
import { jwtUtils } from "../../utils/jwt";
import config from "../../config";

const loginUser = async (req: Request, res: Response) => {
  const payload = req.body;
  const { accessToken, refreshToken } =
    await authService.loginUserIntoDb(payload);

  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    sameSite: "none",
    secure: false,
    maxAge: 1000 * 60 * 60 * 24,
  });

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    sameSite: "none",
    secure: false,
    maxAge: 1000 * 60 * 60 * 24 * 7,
  });

  sentResponse(res, {
    success: true,
    statusCode: httpsStatus.CREATED,
    message: "User login successfully!",
    data: { accessToken, refreshToken },
  });
};

const getMyProfile = catchAsync(async (req: Request, res: Response) => {
  
  const {accessToken} = req.cookies;

  const verifiedToken = jwtUtils.verifyToken(accessToken,config.jwt_access_secret)

  if(typeof verifiedToken === "string" ){
    throw new Error(verifiedToken)
  }

  const result = await authService.getMyProfileIntoDb(verifiedToken.id)

  sentResponse(res, {
    success: true,
    statusCode: httpsStatus.CREATED,
    message: "User register successfully!",
    data: result,
  });
});

export const authController = {
  loginUser,
  getMyProfile
};
