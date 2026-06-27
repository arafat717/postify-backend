import { prisma } from "../../lib/prisma";
import { IPostPayload } from "./post.interface";

const getAllPostFromDb = async () => {
  const allPosts = await prisma.post.findMany({
    include: {
      author: {
        omit: {
          password: true,
        },
      },
      comments: true,
    },
  });
  return allPosts
};

const getAllStatsFromDb = async () => {};

const getMyPostsFromDb = async () => {};

const getSinglePostAndIncremetViewCountFromDb = async () => {};

const createPostIntoDb = async (id: string, paylod: IPostPayload) => {
  const post = await prisma.post.create({
    data: {
      ...paylod,
      authorId: id,
    },
  });
  return post;
};

const updatePostIntoDb = async () => {};

const deletePostFromDb = async () => {};

export const postService = {
  getAllPostFromDb,
  getAllStatsFromDb,
  getMyPostsFromDb,
  getSinglePostAndIncremetViewCountFromDb,
  createPostIntoDb,
  updatePostIntoDb,
  deletePostFromDb,
};
