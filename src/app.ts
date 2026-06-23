import cookieParser from "cookie-parser";
import express, { Request, Response } from "express";
import cors from "cors";
import config from "./config";
import { prisma } from "./lib/prisma";
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
  const user = await prisma.user.findMany();
  console.log("users==>", user);
  res.send("Hello World!");
});

export default app;
