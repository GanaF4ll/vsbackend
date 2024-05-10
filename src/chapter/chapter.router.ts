import { Router } from "express";
import * as ChapterController from "./chapter.controller";

export const chapterRouter = Router();

chapterRouter.get("/all", ChapterController.listChapters);

chapterRouter.get("/:id", ChapterController.getChapterById);

chapterRouter.get(
  "/formation/:formation_id",
  ChapterController.getChapterByFormation
);

chapterRouter.post("/", ChapterController.createChapter);

chapterRouter.put("/:id", ChapterController.updateChapter);

chapterRouter.delete("/:id", ChapterController.deleteChapter);
