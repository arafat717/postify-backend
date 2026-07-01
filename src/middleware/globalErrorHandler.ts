import { NextFunction, Request, Response } from "express";
import httpsStatus from "http-status-codes";

export const globalErrorHandler = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  res.status(httpsStatus.INTERNAL_SERVER_ERROR).json({
    success: false,
    statusCode: httpsStatus.INTERNAL_SERVER_ERROR,
    message: error.message,
    data: error.stack,
  });
};
