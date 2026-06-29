import { Router } from "express";
import { commentController } from "./comment.controller";
import { auth } from "../../utils/auth";
import { Role } from "../../../generated/prisma/enums";

const router = Router();

router.get(
  "/author/:authorId",
  auth(Role.ADMIN, Role.AUTHOR, Role.USER),
  commentController.getUserComment,
);
router.get(
  "/:commentId",
  auth(Role.ADMIN, Role.AUTHOR, Role.USER),
  commentController.getSingleCommentWithPost,
);
router.post(
  "/",
  auth(Role.ADMIN, Role.AUTHOR, Role.USER),
  commentController.createComment,
);
router.patch(
  "/:commentId",
  auth(Role.ADMIN, Role.AUTHOR, Role.USER),
  commentController.updateComment,
);
router.delete(
  "/:commentId",
  auth(Role.ADMIN, Role.AUTHOR, Role.USER),
  commentController.deleteComment,
);
router.patch(
  "/:commentId/modarate",
  auth(Role.ADMIN, Role.AUTHOR, Role.USER),
  commentController.changeCommentStatus,
);

export const commentRoute = router;
