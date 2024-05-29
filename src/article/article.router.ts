import * as ArticleController from "./article.controller";
import { Router } from "express";

export const articleRouter = Router();

articleRouter.get("/all", ArticleController.listArticles);

articleRouter.get("/:id", ArticleController.getArticleById);

articleRouter.get(
  "/category/:category_id",
  ArticleController.getArticleByCategory
);

articleRouter.post("/add", ArticleController.createArticle);

articleRouter.put("/:id", ArticleController.updateArticle);

articleRouter.delete("/:id", ArticleController.deleteArticle);
