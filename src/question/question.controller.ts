import { db } from "../app";
import { Request, Response } from "express";

class QuestionController {
  public async listQuestions(req: Request, res: Response) {
    try {
      const questions = await db.questions.findMany({
        select: {
          id: true,
          content: true,
          chapter_id: true,
        },
      });
      res.status(200).json(questions);
    } catch (error: any) {
      console.error(error);
      res.status(500).json({ message: "No questions found" });
    }
  }

  public async getQuestionById(req: Request, res: Response) {
    const id = parseInt(req.params.id);
    try {
      const question = await db.questions.findUnique({
        where: { id },
      });
      res.status(200).json(question);
    } catch (error: any) {
      console.error(error);
      res.status(500).json({ message: "No questions found" });
    }
  }

  public async getQuestionByChapter(req: Request, res: Response) {
    try {
      const chapter_id = parseInt(req.params.chapter_id);
      const questions = await db.questions.findMany({
        where: { chapter_id },
      });
      res.status(200).json(questions);
    } catch (error: any) {
      console.error(error);
      res.status(500).json({ message: "No questions found for this chapter" });
    }
  }

  public async createQuestion(req: Request, res: Response) {
    const { chapter_id, content } = req.body;
    try {
      // Vérifier si le chapitre existe
      const chapter = await db.chapters.findUnique({
        where: { id: chapter_id },
      });
      if (!chapter) {
        return res.status(404).json({ message: "Chapter not found" });
      }

      let question = await db.questions.create({
        data: {
          chapter: { connect: { id: chapter_id } },
          content,
        },
      });
      res.status(201).json({ message: "Question created", question });
    } catch (error: any) {
      console.error(error);
      res
        .status(500)
        .json({ message: "Failed to create question", error: error.message });
    }
  }

  public async updateQuestion(req: Request, res: Response) {
    const id = parseInt(req.params.id);
    const { content } = req.body;
    try {
      let question = await db.questions.update({
        where: { id },
        data: {
          content,
        },
      });
      res.status(200).json({ message: "Question updated", question });
    } catch (error: any) {
      console.error(error);
      res
        .status(500)
        .json({ message: "Failed to update question", error: error.message });
    }
  }

  public async deleteQuestion(req: Request, res: Response) {
    const id = parseInt(req.params.id);
    try {
      await db.questions.delete({
        where: { id },
      });
      res.status(200).json({ message: "Question deleted" });
    } catch (error: any) {
      console.error(error);
      res
        .status(500)
        .json({ message: "Failed to delete question", error: error.message });
    }
  }
}

export const questionController = new QuestionController();
