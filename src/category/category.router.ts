import express from "express";
import { body, validationResult } from "express-validator";
import { creatorToken } from "../middleware/jwt";

import * as CategoryController from "./category.controller";

export const categoryRouter = express.Router();

categoryRouter.get("/all", CategoryController.listCategories);

categoryRouter.get("/:id", CategoryController.getCategoryById);

categoryRouter.post("/add", creatorToken, CategoryController.createCategory);

categoryRouter.put("/:id", creatorToken, CategoryController.updateCategory);

categoryRouter.delete("/:id", creatorToken, CategoryController.deleteCategory);
