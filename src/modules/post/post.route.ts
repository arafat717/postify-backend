import { Router } from "express";
import { postController } from "./post.controller";
import { auth } from "../../utils/auth";
import { Role } from "../../../generated/prisma/enums";

const router = Router();

router.get("/", postController.getAllPost);
router.get("/stats", postController.getStats);
router.get("/my-posts", postController.getMyposts);
router.get("/:postId", postController.getSinglePost);
router.post(
  "/",
  auth(Role.ADMIN, Role.AUTHOR, Role.USER),
  postController.createPost,
);
router.patch("/:postId", postController.updatePost);
router.delete("/:postId", postController.deletePost);

export const postRoute = router;
