import { connect } from "http2";
import { db } from "../app";
import { Request, Response } from "express";

export const listArticles = async (req: Request, res: Response) => {
  try {
    const articles = await db.articles.findMany({
      select: {
        id: true,
        author_id: true,
        title: true,
        content: true,
        category_id: true,
        coverImage: true,
      },
    });
    res.status(200).json(articles);
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: "No Articles found" });
  }
};

export const getArticleById = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  try {
    const article = await db.articles.findUnique({
      where: { id },
    });
    res.status(200).json(article);
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: "No Articles found with that ID" });
  }
};

export const getArticleByCategory = async (req: Request, res: Response) => {
  const category_id = parseInt(req.params.category_id);
  try {
    const articles = await db.articles.findMany({
      where: { category_id },
    });
    res.status(200).json(articles);
  } catch (error: any) {
    console.error(error);
    res
      .status(500)
      .json({ message: "No Articles found with this category_id" });
  }
};

export const createArticle = async (req: Request, res: Response) => {
  const { author_id, title, content, category_id, coverImage } = req.body;
  try {
    let article = await db.articles.create({
      data: {
        author: { connect: { id: author_id } },
        title,
        content,
        category: { connect: { id: category_id } },
        coverImage,
      },
    });
    res.status(201).json(article);
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: "No Articles created" });
  }
};

export const updateArticle = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const { author_id, title, content, category_id, coverImage } = req.body;
  try {
    await db.articles.update({
      where: { id },
      data: {
        author: { connect: { id: author_id } },
        title,
        content,
        category: { connect: { id: category_id } },
        coverImage,
      },
    });
    const updatedArticle = await db.articles.findUnique({
      where: { id },
    });
    res.status(200).json({ message: "Article updated", updatedArticle });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: "Article not updated" });
  }
};

export const deleteArticle = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);

  try {
    const article = await db.articles.delete({
      where: { id },
    });
    res.status(200).json({ message: "Article deleted", article });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: "No Articles found with that ID" });
  }
};
