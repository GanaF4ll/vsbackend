import { Router } from "express";
import * as ChapterController from "./chapter.controller";
import { creatorToken } from "../middleware/jwt";

export const chapterRouter = Router();

chapterRouter.get("/all", ChapterController.listChapters);

chapterRouter.get("/:id", ChapterController.getChapterById);

chapterRouter.get(
  "/formation/:formation_id",
  ChapterController.getChapterByFormation
);

chapterRouter.post("/add", creatorToken, ChapterController.createChapter);

chapterRouter.put("/:id", creatorToken, ChapterController.updateChapter);

chapterRouter.delete("/:id", creatorToken, ChapterController.deleteChapter);
