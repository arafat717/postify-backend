import cookieParser from "cookie-parser";
import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import config from "./config";
import { userRoute } from "./modules/user/user.route";
import { authRoute } from "./modules/auth/auth.route";
import { postRoute } from "./modules/post/post.route";
import { commentRoutes } from "./modules/comment/comment.route";
import { globalErrorHandler } from "./middleware/globalErrorHandler";
import { notFoundPage } from "./middleware/notFoundPage";

const app = express();

app.use(express.json());
app.use(express.urlencoded());
app.use(cookieParser());
app.use(
  cors({
    origin: config.app_url,
    credentials: true,
  }),
);

app.get("/", async (req: Request, res: Response) => {
  res.send("Hello World!");
});

app.use("/api/users", userRoute);
app.use("/api/auth", authRoute);
app.use("/api/posts", postRoute);
app.use("/api/comments", commentRoutes);

app.use(notFoundPage);
app.use(globalErrorHandler);

export default app;
