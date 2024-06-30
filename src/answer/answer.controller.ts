import { db } from "../app";
import { Request, Response } from "express";
import { Controller } from "../models/controller";

class AnswerController extends Controller {
  public listAnswers = this.handleRequest(
    async (req: Request, res: Response) => {
      const answers = await db.answers.findMany();
      res.status(200).json(answers);
    }
  );

  public getAnswerById = this.handleRequest(
    async (req: Request, res: Response) => {
      const id = parseInt(req.params.id);
      const answer = await db.answers.findUnique({ where: { id } });
      if (!answer) {
        res.status(404).json({ message: "Answer not found" });
        return;
      }
      res.status(200).json(answer);
    }
  );

  public getAnswersByQuestion = this.handleRequest(
    async (req: Request, res: Response) => {
      const question_id = parseInt(req.params.question_id);
      const answers = await db.answers.findMany({ where: { question_id } });
      if (answers.length === 0) {
        res.status(404).json({ message: "No answers found for this question" });
        return;
      }
      res.status(200).json(answers);
    }
  );

  public getValidAnswersByQuestion = this.handleRequest(
    async (req: Request, res: Response) => {
      const question_id = parseInt(req.params.question_id);
      const answers = await db.answers.findMany({
        where: { question_id, valid: true },
      });
      if (answers.length === 0) {
        res
          .status(404)
          .json({ message: "No valid answers found for this question" });
        return;
      }
      res.status(200).json(answers);
    }
  );

  public createAnswer = this.handleRequest(
    async (req: Request, res: Response) => {
      const { question_id, content, valid } = req.body;
      const answer = await db.answers.create({
        data: {
          question: { connect: { id: question_id } },
          content,
          valid,
        },
      });
      res.status(201).json(answer);
    }
  );

  public updateAnswer = this.handleRequest(
    async (req: Request, res: Response) => {
      const id = parseInt(req.params.id);
      const { question_id, content, valid } = req.body;
      const answer = await db.answers.update({
        where: { id },
        data: {
          question: { connect: { id: question_id } },
          content,
          valid,
        },
      });
      res.status(200).json(answer);
    }
  );

  public deleteAnswer = this.handleRequest(
    async (req: Request, res: Response) => {
      const id = parseInt(req.params.id);
      const answer = await db.answers.delete({ where: { id } });
      res.status(200).json({ message: "Answer deleted", answer });
    }
  );
}

export const answerController = new AnswerController();
