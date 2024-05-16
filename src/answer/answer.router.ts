import * as AnswerController from "./answer.controller";
import { Router } from "express";
import { creatorToken } from "../middleware/jwt";

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

answerRouter.post("/add", creatorToken, AnswerController.createAnswer);

answerRouter.put("/:id", creatorToken, AnswerController.updateAnswer);

answerRouter.delete("/:id", creatorToken, AnswerController.deleteAnswer);
