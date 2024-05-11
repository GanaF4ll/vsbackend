import * as AnswerController from "./answer.controller";
import { Router } from "express";

export const answerRouter = Router();

answerRouter.get("/all", AnswerController.listAnswers);

answerRouter.get(
  "/question/:question_id",
  AnswerController.getAnswersByQuestion
);

answerRouter.get(
  "/question/valid/:question_id",
  AnswerController.getValidAnswersByQuestion
);

answerRouter.post("/add", AnswerController.createAnswer);

answerRouter.put("/:id", AnswerController.updateAnswer);

answerRouter.delete("/:id", AnswerController.deleteAnswer);
