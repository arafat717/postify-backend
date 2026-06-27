import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sentResponse } from "../../utils/sentResponse";
import httpsStatus from "http-status-codes";
import { postService } from "./post.service";

const createPost = catchAsync(async (req: Request, res: Response) => {
  const id = req.user?.id;
  const payload = req.body;

  const result = await postService.createPostIntoDb(id as string, payload);

  sentResponse(res, {
    success: true,
    statusCode: httpsStatus.CREATED,
    message: "Post created successfully!",
    data: result,
  });
});
const getAllPost = catchAsync(async (req: Request, res: Response) => {
  const user = await postService.getAllPostFromDb();
  sentResponse(res, {
    success: true,
    statusCode: httpsStatus.CREATED,
    message: "Posts retrived successfully!",
    data: user,
  });
}); 

const getSinglePost = catchAsync(async (req: Request, res: Response) => {
  const user = await postService.getSinglePostAndIncremetViewCountFromDb();

  sentResponse(res, {
    success: true,
    statusCode: httpsStatus.CREATED,
    message: "User register successfully!",
    data: user,
  });
});
const getStats = catchAsync(async (req: Request, res: Response) => {
  const user = await postService.getAllStatsFromDb();

  sentResponse(res, {
    success: true,
    statusCode: httpsStatus.CREATED,
    message: "User register successfully!",
    data: user,
  });
});

const updatePost = catchAsync(async (req: Request, res: Response) => {
  const user = await postService.updatePostIntoDb();

  sentResponse(res, {
    success: true,
    statusCode: httpsStatus.CREATED,
    message: "User register successfully!",
    data: user,
  });
});

const deletePost = catchAsync(async (req: Request, res: Response) => {
  const user = await postService.deletePostFromDb();

  sentResponse(res, {
    success: true,
    statusCode: httpsStatus.CREATED,
    message: "User register successfully!",
    data: user,
  });
});

const getMyposts = catchAsync(async (req: Request, res: Response) => {
  const user = await postService.getMyPostsFromDb();

  sentResponse(res, {
    success: true,
    statusCode: httpsStatus.CREATED,
    message: "User register successfully!",
    data: user,
  });
});

export const postController = {
  createPost,
  getAllPost,
  getSinglePost,
  getStats,
  updatePost,
  deletePost,
  getMyposts,
};
