import { prisma } from "../../lib/prisma";

const getCommentFromSpecificUserFromDb = async () => {};
const getSingleCommentWithSpecificPostFromDb = async () => {};

const createCommentIntoDb = async (authorId: string, payload: any) => {
  const post = await prisma.post.findUnique({
    where: {
      id: authorId,
    },
  });

  if (!post) {
    throw new Error("Post is not exits!");
  }

  

};

const updateUserCommentIntoDb = async () => {};
const deleteUsersCommentFromDb = async () => {};
const changeCommentStatusIntoDb = async () => {};

export const commentService = {
  getCommentFromSpecificUserFromDb,
  getSingleCommentWithSpecificPostFromDb,
  createCommentIntoDb,
  updateUserCommentIntoDb,
  deleteUsersCommentFromDb,
  changeCommentStatusIntoDb,
};
