import { Router } from "express";
import { answerController } from "./answer.controller";
import { creatorToken } from "../middleware/jwt";

export const answerRouter = Router();

answerRouter.get("/all", answerController.listAnswers.bind(answerController));

answerRouter.get(
  "/question/:question_id",
  answerController.getAnswersByQuestion.bind(answerController)
);

answerRouter.get(
  "/question/valid/:question_id",
  answerController.getValidAnswersByQuestion.bind(answerController)
);

answerRouter.post(
  "/add",
  creatorToken,
  answerController.createAnswer.bind(answerController)
);

answerRouter.put(
  "/:id",
  creatorToken,
  answerController.updateAnswer.bind(answerController)
);

answerRouter.delete(
  "/:id",
  creatorToken,
  answerController.deleteAnswer.bind(answerController)
);
