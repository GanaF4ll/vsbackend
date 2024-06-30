import { db } from "../app";
import { Request, Response } from "express";
import { Controller } from "../models/controller";

class FormationController extends Controller {
  public listFormations = this.handleRequest(
    async (req: Request, res: Response) => {
      const formations = await db.formations.findMany({
        select: {
          id: true,
          author_id: true,
          title: true,
          description: true,
          category_id: true,
          difficulty: true,
          completionTime: true,
          qualityRating: true,
          coverImage: true,
          isPro: true,
        },
      });
      res.status(200).json(formations);
    }
  );

  public getFormationByIdDev = this.handleRequest(
    async (req: Request, res: Response) => {
      const id = parseInt(req.params.id);
      const formation = await db.formations.findUnique({
        where: { id },
        include: {
          chapters: {
            include: {
              questions: {
                include: { answers: true },
              },
            },
          },
        },
      });
      res.status(200).json({ formation });
    }
  );

  public getFormationById = this.handleRequest(
    async (req: Request, res: Response) => {
      const formationId = parseInt(req.params.id);
      const formation = await db.formations.findUnique({
        where: { id: formationId },
        include: {
          author: {
            select: {
              firstName: true,
              lastName: true,
            },
          },
          category: {
            select: {
              name: true,
            },
          },
          chapters: {
            include: {
              questions: {
                include: { answers: true },
              },
            },
          },
        },
      });

      if (!formation) {
        res.status(404).json({ message: "Formation not found" });
        return;
      }

      const {
        id,
        title,
        description,
        difficulty,
        completionTime,
        qualityRating,
        coverImage,
        author: { firstName, lastName },
        category: { name: categoryName },
        chapters,
      } = formation;

      const simplifiedFormation = {
        id,
        title,
        description,
        difficulty,
        completionTime,
        qualityRating,
        coverImage,
        author: `${firstName} ${lastName}`,
        category: categoryName,
        chapters: chapters.map(
          (chapter: { id: number; title: string; questions: any[] }) => ({
            id: chapter.id,
            title: chapter.title,
            questions: chapter.questions.map(
              (question: { id: number; content: string; answers: any[] }) => ({
                id: question.id,
                content: question.content,
                answers: question.answers.map(
                  (answer: {
                    id: number;
                    content: string;
                    valid: boolean;
                  }) => ({
                    id: answer.id,
                    content: answer.content,
                    valid: answer.valid,
                  })
                ),
              })
            ),
          })
        ),
      };

      res.status(200).json(simplifiedFormation);
    }
  );

  public getFormationByCategory = this.handleRequest(
    async (req: Request, res: Response) => {
      const category_id = parseInt(req.params.category_id);
      const formations = await db.formations.findMany({
        where: { category_id },
      });
      res.status(200).json(formations);
    }
  );

  public getFormationByTitle = this.handleRequest(
    async (req: Request, res: Response) => {
      const title = req.params.title;
      const formations = await db.formations.findMany({
        select: {
          id: true,
          author_id: true,
          title: true,
          description: true,
          category_id: true,
          difficulty: true,
          completionTime: true,
          qualityRating: true,
          coverImage: true,
        },
        where: { title: { contains: title } },
      });
      res.status(200).json(formations);
    }
  );

  public createFormation = this.handleRequest(
    async (req: Request, res: Response) => {
      const {
        author_id,
        title,
        description,
        category_id,
        difficulty,
        qualityRating,
        completionTime,
        coverImage,
      } = req.body;

      const formation = await db.formations.create({
        data: {
          title,
          description,
          difficulty,
          completionTime,
          qualityRating,
          coverImage,
          author: { connect: { id: author_id } },
          category: { connect: { id: category_id } },
        },
      });
      res.status(201).json(formation);
    }
  );

  public updateFormation = this.handleRequest(
    async (req: Request, res: Response) => {
      const id = parseInt(req.params.id);
      const {
        author_id,
        title,
        description,
        video,
        category_id,
        difficulty,
        completionTime,
        qualityRating,
        coverImage,
      } = req.body;

      await db.formations.update({
        where: { id },
        data: {
          title,
          description,
          difficulty,
          completionTime,
          qualityRating,
          coverImage,
          author: { connect: { id: author_id } },
          category: { connect: { id: category_id } },
        },
      });

      const updatedFormation = await db.formations.findUnique({
        where: { id },
      });
      res.status(200).json(updatedFormation);
    }
  );

  public deleteFormation = this.handleRequest(
    async (req: Request, res: Response) => {
      const id = parseInt(req.params.id);
      const formation = await db.formations.delete({
        where: { id },
      });

      res.status(200).json({ message: "Formation deleted", formation });
    }
  );
}

export const formationController = new FormationController();
