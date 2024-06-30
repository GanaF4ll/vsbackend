import { db } from "../app";
import { Request, Response } from "express";
import { Controller } from "../models/controller";

class QuestionController extends Controller {
  public listQuestions = this.handleRequest(
    async (req: Request, res: Response) => {
      const questions = await db.questions.findMany();
      res.status(200).json(questions);
    }
  );

  public getQuestionById = this.handleRequest(
    async (req: Request, res: Response) => {
      const id = parseInt(req.params.id);
      const question = await db.questions.findUnique({ where: { id } });
      if (!question) {
        res.status(404).json({ message: "Question not found" });
        return;
      }
      res.status(200).json(question);
    }
  );

  public createQuestion = this.handleRequest(
    async (req: Request, res: Response) => {
      const { chapter_id, content } = req.body;
      const question = await db.questions.create({
        data: {
          chapter: { connect: { id: chapter_id } },
          content,
        },
      });
      res.status(201).json(question);
    }
  );

  public updateQuestion = this.handleRequest(
    async (req: Request, res: Response) => {
      const id = parseInt(req.params.id);
      const { chapter_id, content } = req.body;
      const question = await db.questions.update({
        where: { id },
        data: {
          chapter: { connect: { id: chapter_id } },
          content,
        },
      });
      res.status(200).json(question);
    }
  );

  public deleteQuestion = this.handleRequest(
    async (req: Request, res: Response) => {
      const id = parseInt(req.params.id);
      const question = await db.questions.delete({ where: { id } });
      res.status(200).json({ message: "Question deleted", question });
    }
  );
}

export const questionController = new QuestionController();
