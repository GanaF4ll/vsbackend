import * as QuestionController from "./question.controller";
import { Router } from "express";

export const questionRouter = Router();

questionRouter.get("/all", QuestionController.listQuestions);

questionRouter.get("/:id", QuestionController.getQuestionById);

questionRouter.get(
  "/chapter/:chapter_id",
  QuestionController.getQuestionByChapter
);

questionRouter.post("/add", QuestionController.createQuestion);

questionRouter.put("/:id", QuestionController.updateQuestion);

questionRouter.delete("/:id", QuestionController.deleteQuestion);
