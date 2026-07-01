import { error } from "node:console";
import { prisma } from "../../lib/prisma";
import { IPostPayload, IPostQuery, IUpdatePost } from "./post.interface";
import { CommentStatus, PostStatus } from "../../../generated/prisma/enums";
import { PostWhereInput } from "../../../generated/prisma/models";

const getAllPostFromDb = async (query: IPostQuery) => {
  const limit = query.limit ? Number(query.limit) : 10;
  const page = query.page ? Number(query.page) : 1;
  const skip = (page - 1) * limit;

  const sortBy = query.sortBy ? query.sortBy : "createdAt";
  const sortOrderBy = query.sortOrder ? query.sortOrder : "desc";

  const tags = query.tags ? JSON.parse(query.tags as string) : null;

  const tagsArray = Array.isArray(tags) ? tags : [];

  const andConditions: PostWhereInput[] = [];

  if (query.searchTerm) {
    andConditions.push({
      OR: [
        {
          title: {
            contains: query.searchTerm,
            mode: "insensitive",
          },
        },
        {
          content: {
            contains: query.searchTerm,
            mode: "insensitive",
          },
        },
      ],
    });
  }

  if (query.title) {
    andConditions.push({
      title: query.title,
    });
  }

  if (query.content) {
    andConditions.push({
      content: query.content,
    });
  }

  if (query.authorId) {
    andConditions.push({
      authorId: query.authorId,
    });
  }

  if (query.isFeatured) {
    andConditions.push({
      isFeatured: Boolean(query.isFeatured),
    });
  }

  if (query.tags) {
    andConditions.push({
      tags: {
        hasSome: tagsArray,
      },
    });
  }

  if (query.status) {
    andConditions.push({
      status: query.status,
    });
  }

  // andConditions.push({
  //   isPremium: false,
  // });

  const allPosts = await prisma.post.findMany({
    // where: {
    //   AND: [
    //     query.searchTerm
    //       ? {
    //           OR: [
    //             {
    //               title: {
    //                 contains: query.searchTerm,
    //                 mode: "insensitive",
    //               },
    //             },
    //             {
    //               content: {
    //                 contains: query.searchTerm,
    //                 mode: "insensitive",
    //               },
    //             },
    //           ],
    //         }
    //       : {},
    //     query.title
    //       ? {
    //           title: query.title,
    //         }
    //       : {},

    //     query.content
    //       ? {
    //           content: query.content,
    //         }
    //       : {},
    //   ],
    // },

    where: {
      AND: andConditions,
    },

    take: limit,
    skip: skip,

    orderBy: {
      [sortBy]: sortOrderBy,
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
  return allPosts;
};

const getAllStatsFromDb = async () => {
  const transactionResult = await prisma.$transaction(async (tx) => {
    const [
      totalPosts,
      totalPublishedPosts,
      totalDraftPosts,
      totalArchivedPosts,
      totalComments,
      totalApprovedComments,
      totalRejectedComments,
      totalPostViewsAggregate,
    ] = await Promise.all([
      await tx.post.count(),
      await tx.post.count({
        where: {
          status: PostStatus.PUBLISHED,
        },
      }),
      await tx.post.count({
        where: {
          status: PostStatus.DRAFT,
        },
      }),
      await tx.post.count({
        where: {
          status: PostStatus.ARCHIVED,
        },
      }),
      await tx.comment.count(),
      await tx.comment.count({
        where: {
          status: CommentStatus.APPROVED,
        },
      }),
      await tx.comment.count({
        where: {
          status: CommentStatus.REJECTED,
        },
      }),
      await tx.post.aggregate({
        _sum: {
          views: true,
        },
      }),
    ]);

    return {
      totalPosts,
      totalPublishedPosts,
      totalDraftPosts,
      totalArchivedPosts,
      totalComments,
      totalApprovedComments,
      totalRejectedComments,
      totalPostViews: totalPostViewsAggregate._sum.views,
    };
  });

  return transactionResult;
};

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
