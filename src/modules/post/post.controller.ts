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
  const id = req.params.postId;
  if (!id) {
    throw new Error("Params id is missing!");
  }
  const user = await postService.getSinglePostAndIncremetViewCountFromDb(
    id as string,
  );

  sentResponse(res, {
    success: true,
    statusCode: httpsStatus.CREATED,
    message: "Post retrived successfully!",
    data: user,
  });
});


const getStats = catchAsync(async (req: Request, res: Response) => {
  const user = await postService.getAllStatsFromDb();

  sentResponse(res, {
    success: true,
    statusCode: httpsStatus.CREATED,
    message: "Posts stats retrived successfully!",
    data: user,
  });
});


const updatePost = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.id;
  const isAdmin = req.user?.role === "ADMIN";
  const payload = req.body;
  const postId = req.params.postId;

  if (!postId) {
    throw new Error("Please provide postid!");
  }

  const user = await postService.updatePostIntoDb(
    postId as string,
    payload,
    userId as string,
    isAdmin,
  );

  sentResponse(res, {
    success: true,
    statusCode: httpsStatus.CREATED,
    message: "Post updated successfully!",
    data: user,
  });
});


const deletePost = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.id;
  const isAdmin = req.user?.role === "ADMIN";
  const postId = req.params.postId;

  if (!postId) {
    throw new Error("Please provide postid!");
  }
  const user = await postService.deletePostFromDb(
    postId as string,
    userId as string,
    isAdmin,
  );

  sentResponse(res, {
    success: true,
    statusCode: httpsStatus.CREATED,
    message: "Post deleted successfully!",
    data: null,
  });
});



const getMyposts = catchAsync(async (req: Request, res: Response) => {
  const id = req.user?.id;
  const user = await postService.getMyPostsFromDb(id as string);

  sentResponse(res, {
    success: true,
    statusCode: httpsStatus.CREATED,
    message: "My posts retrived successfully!",
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
