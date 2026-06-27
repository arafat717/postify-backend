import { Router } from "express";
import { commentController } from "./comment.controller";

const router = Router();

router.get("/author/:authorId", commentController.getUserComment);
router.get("/:commentId", commentController.getSingleCommentWithPost);
router.post("/", commentController.createComment);
router.patch("/:commentId", commentController.updateComment);
router.delete("/:commentId", commentController.deleteComment);
router.patch("/:commentId/modarate", commentController.changeCommentStatus);

export const commentRoute = router;
