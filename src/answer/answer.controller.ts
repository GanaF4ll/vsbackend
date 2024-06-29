import { db } from "../app";
import { Request, Response } from "express";

class AnswerController {
  public async listAnswers(req: Request, res: Response) {
    try {
      const answers = await db.answers.findMany({
        select: {
          id: true,
          content: true,
          question_id: true,
          valid: true,
        },
      });
      res.status(200).json(answers);
    } catch (error: any) {
      console.error(error);
      res.status(500).json({ message: "No answers found" });
    }
  }

  public async getAnswersByQuestion(req: Request, res: Response) {
    try {
      const question_id = parseInt(req.params.question_id);
      const answers = await db.answers.findMany({
        where: { question_id },
      });
      res.status(200).json(answers);
    } catch (error: any) {
      console.error(error);
      res.status(500).json({ message: "No answers found for this question" });
    }
  }

  public async getValidAnswersByQuestion(req: Request, res: Response) {
    try {
      const question_id = parseInt(req.params.question_id);
      const answers = await db.answers.findMany({
        where: { question_id, valid: true },
      });
      res.status(200).json(answers);
    } catch (error: any) {
      console.error(error);
      res
        .status(500)
        .json({ message: "No valid answers found for this question" });
    }
  }

  public async createAnswer(req: Request, res: Response) {
    try {
      const { content, question_id, valid } = req.body;

      // Vérifier si la question existe
      const question = await db.questions.findUnique({
        where: { id: question_id },
      });

      if (!question) {
        return res.status(404).json({ message: "Question not found" });
      }

      const answer = await db.answers.create({
        data: {
          content,
          valid,
          question: { connect: { id: question_id } },
        },
      });

      res.status(201).json(answer);
    } catch (error: any) {
      console.error(error);
      res
        .status(500)
        .json({ message: "Answer not created", error: error.message });
    }
  }

  public async updateAnswer(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const { content, question_id, valid } = req.body;
      const answer = await db.answers.update({
        where: { id },
        data: {
          content,
          question_id,
          valid,
        },
      });
      res.status(200).json(answer);
    } catch (error: any) {
      console.error(error);
      res.status(500).json({ message: "Answer not updated" });
    }
  }

  public async deleteAnswer(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      await db.answers.delete({
        where: { id },
      });
      res.status(204).json();
    } catch (error: any) {
      console.error(error);
      res.status(500).json({ message: "Answer not deleted" });
    }
  }
}

export const answerController = new AnswerController();
