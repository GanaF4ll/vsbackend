import * as QuestionController from "./question.controller";
import { Router } from "express";
import { creatorToken } from "../middleware/jwt";

export const questionRouter = Router();

questionRouter.get("/all", QuestionController.listQuestions);

questionRouter.get("/:id", QuestionController.getQuestionById);

questionRouter.get(
  "/chapter/:chapter_id",
  QuestionController.getQuestionByChapter
);

questionRouter.post("/add", creatorToken, QuestionController.createQuestion);

questionRouter.put("/:id", creatorToken, QuestionController.updateQuestion);

questionRouter.delete("/:id", creatorToken, QuestionController.deleteQuestion);
