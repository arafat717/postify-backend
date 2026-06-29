import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sentResponse } from "../../utils/sentResponse";
import httpsStatus from "http-status-codes";
import { commentService } from "./comment.service";

const changeCommentStatus = catchAsync(async (req: Request, res: Response) => {
  const user = await commentService.changeCommentStatusIntoDb();

  sentResponse(res, {
    success: true,
    statusCode: httpsStatus.CREATED,
    message: "User register successfully!",
    data: user,
  });
});

const createComment = catchAsync(async (req: Request, res: Response) => {
  const authorId = req.user?.id;
  const payload = req.body;
  const user = await commentService.createCommentIntoDb(
    authorId as string,
    payload,
  );

  sentResponse(res, {
    success: true,
    statusCode: httpsStatus.CREATED,
    message: "Comment created successfully!",
    data: user,
  });
});

const deleteComment = catchAsync(async (req: Request, res: Response) => {
  const user = await commentService.deleteUsersCommentFromDb();

  sentResponse(res, {
    success: true,
    statusCode: httpsStatus.CREATED,
    message: "User register successfully!",
    data: user,
  });
});
const getUserComment = catchAsync(async (req: Request, res: Response) => {
  const user = await commentService.getCommentFromSpecificUserFromDb();

  sentResponse(res, {
    success: true,
    statusCode: httpsStatus.CREATED,
    message: "User register successfully!",
    data: user,
  });
});
const getSingleCommentWithPost = catchAsync(
  async (req: Request, res: Response) => {
    const user = await commentService.getSingleCommentWithSpecificPostFromDb();

    sentResponse(res, {
      success: true,
      statusCode: httpsStatus.CREATED,
      message: "User register successfully!",
      data: user,
    });
  },
);
const updateComment = catchAsync(async (req: Request, res: Response) => {
  const user = await commentService.updateUserCommentIntoDb();

  sentResponse(res, {
    success: true,
    statusCode: httpsStatus.CREATED,
    message: "User register successfully!",
    data: user,
  });
});

export const commentController = {
  changeCommentStatus,
  updateComment,
  getSingleCommentWithPost,
  getUserComment,
  deleteComment,
  createComment,
};
