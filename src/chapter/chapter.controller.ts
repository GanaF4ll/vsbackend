import { db } from "../app";
import { Request, Response } from "express";

class ChapterController {
  public async listChapters(req: Request, res: Response) {
    try {
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
    } catch (error: any) {
      console.error(error);
      res.status(500).json({ message: "No chapters found" });
    }
  }

  public async getChapterById(req: Request, res: Response) {
    const id = parseInt(req.params.id);
    try {
      const chapter = await db.chapters.findUnique({
        where: { id },
      });
      res.status(200).json(chapter);
    } catch (error: any) {
      console.error(error);
      res.status(500).json({ message: "No chapters found" });
    }
  }

  public async getChapterByFormation(req: Request, res: Response) {
    try {
      const formation_id = parseInt(req.params.formation_id);
      const chapters = await db.chapters.findMany({
        where: { formation_id },
      });
      res.status(200).json(chapters);
    } catch (error: any) {
      console.error(error);
      res.status(500).json({ message: "No chapters found for this formation" });
    }
  }

  public async createChapter(req: Request, res: Response) {
    const { formation_id, title, content, chapter_number, video } = req.body;
    try {
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
    } catch (error: any) {
      console.error(error);
      res
        .status(500)
        .json({ message: "Chapter not created", error: error.message });
    }
  }

  public async updateChapter(req: Request, res: Response) {
    const id = parseInt(req.params.id);
    const { formation_id, title, content, chapter_number, video } = req.body;
    try {
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

      const updatedChapter = await db.chapters.findUnique({
        where: { id },
      });
      res.status(200).json(updatedChapter);
    } catch (error: any) {
      console.error(error);
      res
        .status(500)
        .json({ message: "Chapter not updated", error: error.message });
    }
  }

  public async deleteChapter(req: Request, res: Response) {
    const id = parseInt(req.params.id);
    try {
      const chapter = await db.chapters.delete({
        where: { id },
      });
      res.status(200).json({ message: "Chapter deleted", chapter });
    } catch (error: any) {
      console.error(error);
      res
        .status(500)
        .json({ message: "No chapters found", error: error.message });
    }
  }
}

export const chapterController = new ChapterController();
