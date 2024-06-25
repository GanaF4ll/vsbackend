import { db } from "../app";
import { Request, Response } from "express";

export const listCategories = async (req: Request, res: Response) => {
  try {
    const categories = await db.categories.findMany({
      select: {
        id: true,
        name: true,
        shortName: true,
        description: true,
        backgroundImage: true,
      },
    });
    res.status(200).json(categories);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "No categories found" });
  }
};

export const getCategoryById = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  try {
    const category = await db.categories.findUnique({
      where: {
        id,
      },
    });
    res.status(200).json(category);
  } catch (error: any) {
    console.log(error);
    res.status(500).json({ message: "No categories found with this ID" });
  }
};

export const createCategory = async (req: Request, res: Response) => {
  try {
    const { name, shortName, description, backgroundImage } = req.body;
    let category = await db.categories.findFirst({ where: { name } });

    category = await db.categories.create({
      data: {
        name,
        shortName,
        description,
        backgroundImage,
      },
    });
    res.status(201).json(category);
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: "Category not created" });
  }
};

export const updateCategory = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  try {
    const { name, shortName, description, backgroundImage } = req.body;
    await db.categories.update({
      where: {
        id,
      },
      data: {
        name,
        shortName,
        description,
        backgroundImage,
      },
    });

    const updatedCategory = await db.categories.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        name: true,
        shortName: true,
        description: true,
        backgroundImage: true,
      },
    });

    res.status(200).json(updateCategory);
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: "Category not updated" });
  }
};

export const deleteCategory = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  try {
    const category = await db.categories.delete({
      where: { id },
    });
    res.status(200).json({ message: "Category deleted: ", category });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: "Could not delete the category" });
  }
};
