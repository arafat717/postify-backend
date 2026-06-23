import cookieParser from "cookie-parser";
import express, { Request, Response } from "express";
import cors from "cors";
import config from "./config";
import { prisma } from "./lib/prisma";
import httpsStatus from "http-status-codes";
import bycript from "bcrypt";

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

app.post("/api/v1/register", async (req: Request, res: Response) => {
  const { email, name, password, profilePhoto } = req.body;

  const isUserExits = await prisma.user.findUnique({
    where: { email },
  });

  if (isUserExits) {
    throw new Error("User with the email already exists");
  }

  const hashPassword = await bycript.hash(password, 10);

  const createUser = await prisma.user.create({
    data: {
      name,
      email,
      password: hashPassword,
    },
  });

  await prisma.profile.create({
    data: {
      userId: createUser.id,
      profilePhoto,
    },
  });

  const user = await prisma.user.findUnique({
    where: {
      id: createUser.id,
      email: createUser.email || email,
    },
    omit: {
      password: true,
    },
    include: {
      profile: true,
    },
  });

  res.status(httpsStatus.CREATED).json({
    success: true,
    statusCode: httpsStatus.CREATED,
    message: "user registration successfully!",
    data: { user },
  });
});

export default app;
