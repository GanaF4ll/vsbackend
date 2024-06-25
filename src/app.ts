import express, { Request, Response, NextFunction } from "express";
import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";
import cors from "cors";

import { userRouter } from "./user/user.router";
import { roleRouter } from "./role/role.router";
import { categoryRouter } from "./category/category.router";
import { articleRouter } from "./article/article.router";
import { formationRouter } from "./formation/formation.router";
import { chapterRouter } from "./chapter/chapter.router";
import { questionRouter } from "./question/question.router";
import { answerRouter } from "./answer/answer.router";

dotenv.config();

export const app = express();
let db: PrismaClient;

declare global {
  var __db: PrismaClient | undefined;
}

if (!global.__db) {
  global.__db = new PrismaClient();
}
db = global.__db;

export { db };

app.use(cors());
app.use(express.json());
const PORT = process.env.PORT || process.env.TEST_PORT;

app.use(cors());

app.use((req: Request, res: Response, next: NextFunction) => {
  const allowedOrigins = [
    process.env.FRONTEND_DEV_URL,
    // process.env.PROD
  ];
  const origin = req.headers.origin as string;
  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.header("Access-Control-Allow-Credentials", "true");
  next();
});

app.use("/users", userRouter);
app.use("/roles", roleRouter);
app.use("/categories", categoryRouter);
app.use("/articles", articleRouter);
app.use("/formations", formationRouter);
app.use("/chapters", chapterRouter);
app.use("/questions", questionRouter);
app.use("/answers", answerRouter);

export const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
