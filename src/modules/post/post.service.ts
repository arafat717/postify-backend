import { error } from "node:console";
import { prisma } from "../../lib/prisma";
import { IPostPayload, IUpdatePost } from "./post.interface";

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
  return allPosts;
};

const getAllStatsFromDb = async () => {};

const getMyPostsFromDb = async (authorId: string) => {
  const myPosts = await prisma.post.findMany({
    where: {
      authorId,
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      author: {
        omit: {
          password: true,
        },
      },
      comments: true,
      _count: {
        select: {
          comments: true,
        },
      },
    },
  });

  return myPosts;
};

const getSinglePostAndIncremetViewCountFromDb = async (id: string) => {
  //   const updateViewCount = await prisma.post.update({
  //     where: {
  //       id: id,
  //     },
  //     data: {
  //       views: {
  //         increment: 1,
  //       },
  //     },
  //   });

  //   throw new Error("Fake error");

  //   const post = await prisma.post.findUniqueOrThrow({
  //     where: {
  //       id: id,
  //     },
  //     include: {
  //       author: {
  //         omit: {
  //           password: true,
  //         },
  //       },
  //       comments: true,
  //     },
  //   });

  const postTransaction = await prisma.$transaction(async (tx) => {
    await tx.post.update({
      where: {
        id: id,
      },
      data: {
        views: {
          increment: 1,
        },
      },
    });

    // throw new Error("fake error");

    const post = await tx.post.findUniqueOrThrow({
      where: {
        id: id,
      },
      include: {
        author: {
          omit: {
            password: true,
          },
        },
        comments: true,
      },
    });

    return post;
  });

  return postTransaction;
};

const createPostIntoDb = async (id: string, paylod: IPostPayload) => {
  const post = await prisma.post.create({
    data: {
      ...paylod,
      authorId: id,
    },
  });
  return post;
};

const updatePostIntoDb = async (
  postId: string,
  payload: IUpdatePost,
  userId: string,
  isAdmin: boolean,
) => {
  const post = await prisma.post.findUniqueOrThrow({
    where: {
      id: postId,
    },
  });

  if (!isAdmin && post.authorId !== userId) {
    throw new Error("You are not authorized for update this post!");
  }
  const updatedPost = await prisma.post.update({
    where: {
      id: postId,
    },
    data: payload,
    include: {
      author: {
        omit: {
          password: true,
        },
      },
      comments: true,
    },
  });

  return updatedPost;
};

const deletePostFromDb = async (
  postId: string,
  userId: string,
  isAdmin: boolean,
) => {
  const post = await prisma.post.findUniqueOrThrow({
    where: {
      id: postId,
    },
  });

  if (!isAdmin && post.authorId !== userId) {
    throw new Error("You are not authorized for detete this post!");
  }

  await prisma.post.delete({
    where: {
      id: postId,
    },
  });
};

export const postService = {
  getAllPostFromDb,
  getAllStatsFromDb,
  getMyPostsFromDb,
  getSinglePostAndIncremetViewCountFromDb,
  createPostIntoDb,
  updatePostIntoDb,
  deletePostFromDb,
};
