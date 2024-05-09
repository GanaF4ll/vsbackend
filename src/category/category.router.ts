import { Category } from "@prisma/client";
import express, { Request, Response } from "express";
import { body, validationResult } from "express-validator";

import * as CategoryController from "./category.controller";

export const categoryRouter = express.Router();

categoryRouter.get("/all", async (req: Request, res: Response) => {
  try {
    const categories = await CategoryController.listCategories();
    return res.status(200).json(categories);
  } catch (error: any) {
    const err = error as Error;
    return res.status(500).json({ message: err.message });
  }
});

categoryRouter.get("/:id", async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const category = await CategoryController.getCategoryById(id);
    return res.status(200).json(category);
  } catch (error) {
    const err = error as Error;
    return res.status(500).json({ message: err.message });
  }
});

categoryRouter.post(
  "/add",
  body("name").isString(),
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array() });
    }
    try {
      const category = req.body;
      const newCategory = await CategoryController.createCategory(category);
      return res.status(201).json(newCategory);
    } catch (error) {
      const err = error as Error;
      return res.status(500).json({ message: err.message });
    }
  }
);

categoryRouter.put(
  "/:id",
  body("name").isString(),
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array() });
    }
    const id: number = parseInt(req.params.id, 10);
    try {
      const category = req.body;
      const updatedCategory = await CategoryController.updateCategory(
        category,
        id
      );
      return res.status(200).json(updatedCategory);
    } catch (error: any) {
      return res.status(500).json(error.message);
    }
  }
);

categoryRouter.delete("/:id", async (req: Request, res: Response) => {
  const id: number = parseInt(req.params.id, 10);
  try {
    await CategoryController.deleteCategory(id);
    return res.status(204).json("Category deleted");
  } catch (error: any) {
    return res.status(500).json(error.message);
  }
});
