import { db } from "../db/db.server";
import { Request, Response } from "express";

export const listQuestions = async (req: Request, res: Response) => {
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
};

export const getQuestionById = async (req: Request, res: Response) => {
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
};

export const getQuestionByChapter = async (req: Request, res: Response) => {
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
};

export const createQuestion = async (req: Request, res: Response) => {
  const { chapter_id, content } = req.body;
  try {
    let question = await db.questions.create({
      data: {
        chapter: { connect: { id: chapter_id } },
        content,
      },
    });
    res.status(201).json({ message: "question created: ", question });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: "Failed to create question" });
  }
};

export const updateQuestion = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const { content } = req.body;
  try {
    let question = await db.questions.update({
      where: { id },
      data: {
        content,
      },
    });
    res.status(200).json({ message: "question updated: ", question });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: "Failed to update question" });
  }
};

export const deleteQuestion = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  try {
    await db.questions.delete({
      where: { id },
    });
    res.status(200).json({ message: "question deleted" });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: "Failed to delete question" });
  }
};
