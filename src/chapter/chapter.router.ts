import { Router } from "express";
import { chapterController } from "./chapter.controller";
import { creatorToken } from "../middleware/jwt";

export const chapterRouter = Router();

chapterRouter.get(
  "/all",
  chapterController.listChapters.bind(chapterController)
);
chapterRouter.get(
  "/:id",
  chapterController.getChapterById.bind(chapterController)
);
chapterRouter.get(
  "/formation/:formation_id",
  chapterController.getChapterByFormation.bind(chapterController)
);
chapterRouter.post(
  "/add",
  creatorToken,
  chapterController.createChapter.bind(chapterController)
);
chapterRouter.put(
  "/:id",
  creatorToken,
  chapterController.updateChapter.bind(chapterController)
);
chapterRouter.delete(
  "/:id",
  creatorToken,
  chapterController.deleteChapter.bind(chapterController)
);
