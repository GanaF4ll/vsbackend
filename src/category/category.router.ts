import express, { Request, Response } from "express";
import { body, validationResult } from "express-validator";

import * as CategoryController from "./category.controller";

export const categoryRouter = express.Router();

categoryRouter.get("/all", CategoryController.listCategories);

categoryRouter.get("/:id", CategoryController.getCategoryById);

categoryRouter.post("/add", CategoryController.createCategory);

categoryRouter.put("/:id", CategoryController.updateCategory);

categoryRouter.delete("/:id", CategoryController.deleteCategory);
