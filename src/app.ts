import cookieParser from "cookie-parser";
import express, { Request, Response } from "express";
import cors from "cors";
import config from "./config";
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

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World!");
});

export default app;
