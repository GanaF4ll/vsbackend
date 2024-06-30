import { db } from "../app";
import { Request, Response } from "express";
import { Controller } from "../models/controller";

class ChapterController extends Controller {
  public listChapters = this.handleRequest(
    async (req: Request, res: Response) => {
      const chapters = await db.chapters.findMany({
        select: {
          id: true,
          formation_id: true,
          title: true,
          content: true,
          chapter_number: true,
          video: true,
        },
      });
      res.status(200).json(chapters);
    }
  );

  public getChapterById = this.handleRequest(
    async (req: Request, res: Response) => {
      const id = parseInt(req.params.id);
      const chapter = await db.chapters.findUnique({ where: { id } });
      if (!chapter) {
        res.status(404).json({ message: "Chapter not found" });
        return;
      }
      res.status(200).json(chapter);
    }
  );

  public getChapterByFormation = this.handleRequest(
    async (req: Request, res: Response) => {
      const formation_id = parseInt(req.params.formation_id);
      const chapters = await db.chapters.findMany({ where: { formation_id } });
      res.status(200).json(chapters);
    }
  );

  public createChapter = this.handleRequest(
    async (req: Request, res: Response) => {
      const { formation_id, title, content, chapter_number, video } = req.body;
      const chapter = await db.chapters.create({
        data: {
          formation: { connect: { id: formation_id } },
          title,
          content,
          chapter_number,
          video,
        },
      });
      res.status(201).json({ message: "Chapter created", chapter });
    }
  );

  public updateChapter = this.handleRequest(
    async (req: Request, res: Response) => {
      const id = parseInt(req.params.id);
      const { formation_id, title, content, chapter_number, video } = req.body;
      await db.chapters.update({
        where: { id },
        data: {
          formation: { connect: { id: formation_id } },
          title,
          content,
          chapter_number,
          video,
        },
      });
      const updatedChapter = await db.chapters.findUnique({ where: { id } });
      res.status(200).json(updatedChapter);
    }
  );

  public deleteChapter = this.handleRequest(
    async (req: Request, res: Response) => {
      const id = parseInt(req.params.id);
      const chapter = await db.chapters.delete({ where: { id } });
      res.status(200).json({ message: "Chapter deleted", chapter });
    }
  );
}

export const chapterController = new ChapterController();
