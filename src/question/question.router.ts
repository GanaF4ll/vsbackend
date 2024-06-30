import { Router } from "express";
import { questionController } from "./question.controller";
import { creatorToken } from "../middleware/jwt";

export const questionRouter = Router();

questionRouter.get(
  "/all",
  questionController.listQuestions.bind(questionController)
);

questionRouter.get(
  "/:id",
  questionController.getQuestionById.bind(questionController)
);

questionRouter.get(
  "/chapter/:chapter_id",
  questionController.getQuestionByChapter.bind(questionController)
);

questionRouter.post(
  "/add",
  creatorToken,
  questionController.createQuestion.bind(questionController)
);

questionRouter.put(
  "/:id",
  creatorToken,
  questionController.updateQuestion.bind(questionController)
);

questionRouter.delete(
  "/:id",
  creatorToken,
  questionController.deleteQuestion.bind(questionController)
);
