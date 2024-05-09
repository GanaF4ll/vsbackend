import { db } from "../db/db.server";
import { Request, Response } from "express";

export const listFormations = async (req: Request, res: Response) => {
  try {
    const formations = await db.formations.findMany({
      select: {
        id: true,
        author_id: true,
        title: true,
        description: true,
        video: true,
        category_id: true,
        difficulty: true,
        completionTime: true,
        qualityRating: true,
        coverImage: true,
      },
    });
    res.status(200).json(formations);
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: "No formations found" });
  }
};

export const getFormationById = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  try {
    const formation = await db.formations.findUnique({
      where: {
        id,
      },
    });
    res.status(200).json({ formation });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: "No formations found with that ID" });
  }
};

export const createFormation = async (req: Request, res: Response) => {
  try {
    const {
      author_id,
      title,
      description,
      video,
      category_id,
      difficulty,
      qualityRating,
      coverImage,
    } = req.body;

    let completionTime: Date;
    if (req.body.completionTime) {
      completionTime = new Date(req.body.completionTime);
    } else {
      completionTime = new Date();
    }

    let formation = await db.formations.create({
      data: {
        author_id,
        title,
        description,
        video,
        category_id,
        difficulty,
        completionTime,
        qualityRating,
        coverImage,
      },
    });
    res.status(201).json(formation);
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: "Formation not created" });
  }
};

export const updateFormation = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  try {
    const {
      author_id,
      title,
      description,
      video,
      category_id,
      difficulty,
      qualityRating,
      coverImage,
    } = req.body;

    let completionTime: Date;
    if (req.body.completionTime) {
      completionTime = new Date(req.body.completionTime);
    } else {
      completionTime = new Date();
    }

    await db.formations.update({
      where: { id },
      data: {
        author_id,
        title,
        description,
        video,
        category_id,
        difficulty,
        completionTime,
        qualityRating,
        coverImage,
      },
    });

    const updatedFormation = await db.formations.findUnique({
      where: { id },
    });
    res.status(200).json(updatedFormation);
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: "Formation not updated" });
  }
};

export const deleteFormation = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  try {
    const formation = await db.formations.delete({
      where: { id },
    });

    res.status(200).json({ message: "Formation deleted", formation });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: "No formations found" });
  }
};
