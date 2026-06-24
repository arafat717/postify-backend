import { Request, Response } from "express";
import { userService } from "./user.service";
import httpsStatus from "http-status-codes";
import { error } from "node:console";
import { catchAsync } from "../utils/catchAsync";

// const createUser = async (req: Request, res: Response) => {
//   try {
//     const payload = req.body;
//     const user = await userService.createUserIntoDb(payload);

//     res.status(httpsStatus.CREATED).json({
//       success: true,
//       statusCode: httpsStatus.CREATED,
//       message: "User registration successfully!",
//       data: user,
//     });
//   } catch (err: any) {
//     res.status(httpsStatus.INTERNAL_SERVER_ERROR).json({
//       success: false,
//       statusCode: httpsStatus.INTERNAL_SERVER_ERROR,
//       message: "Something went wrong!",
//       error: err.message,
//     });
//   }
// };

const createUser = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body;
  const user = await userService.createUserIntoDb(payload);

  res.status(httpsStatus.CREATED).json({
    success: true,
    statusCode: httpsStatus.CREATED,
    message: "User registration successfully!",
    data: user,
  });
});

export const userController = {
  createUser,
};
