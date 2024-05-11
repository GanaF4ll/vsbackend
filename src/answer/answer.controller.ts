import { db } from "../db/db.server";
import e, { Request, Response } from "express";

export const listAnswers = async (req: Request, res: Response) => {
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
};

export const getAnswersByQuestion = async (req: Request, res: Response) => {
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
};

export const getValidAnswersByQuestion = async (
  req: Request,
  res: Response
) => {
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
};

export const createAnswer = async (req: Request, res: Response) => {
  try {
    const { content, question_id, valid } = req.body;
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
    res.status(500).json({ message: "Answer not created" });
  }
};

export const updateAnswer = async (req: Request, res: Response) => {
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
};

export const deleteAnswer = async (req: Request, res: Response) => {
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
};
