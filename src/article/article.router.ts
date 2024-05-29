import * as ArticleController from "./article.controller";
import { Router } from "express";
import { creatorToken } from "../middleware/jwt";

export const articleRouter = Router();

articleRouter.get("/all", ArticleController.listArticles);

articleRouter.get("/:id", ArticleController.getArticleById);

articleRouter.get(
  "/category/:category_id",
  ArticleController.getArticleByCategory
);

articleRouter.post("/add", creatorToken, ArticleController.createArticle);

articleRouter.put("/:id", creatorToken, ArticleController.updateArticle);

articleRouter.delete("/:id", creatorToken, ArticleController.deleteArticle);
