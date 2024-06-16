import { db } from "../app";
import { Request, Response } from "express";

////////////////////////////////////////
/////////////////GET////////////////////
////////////////////////////////////////

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

// returns all the data
export const getFormationByIdDev = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  try {
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
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: "No formations found with that ID" });
  }
};

// returns the data needed for the front-end
export const getFormationById = async (req: Request, res: Response) => {
  const formationId = parseInt(req.params.id);
  try {
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
      return res.status(404).json({ message: "Formation not found" });
    }

    const {
      id,
      title,
      description,
      video,
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
      video,
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
                (answer: { id: number; content: string; valid: boolean }) => ({
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
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: "No formations found with that ID" });
  }
};

export const getFormationByCategory = async (req: Request, res: Response) => {
  const category_id = parseInt(req.params.category_id);
  try {
    const formations = await db.formations.findMany({
      where: { category_id },
    });
    res.status(200).json(formations);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "No formations found with this category_id" });
  }
};

export const getFormationByTitle = async (req: Request, res: Response) => {
  const title = req.params.title;
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
      where: { title: { contains: title } },
    });
    res.status(200).json(formations);
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: "No formations found with this title" });
  }
};

////////////////////////////////////////
/////////////////POST///////////////////
////////////////////////////////////////

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
      completionTime,
      coverImage,
    } = req.body;

    let imageUrl: string = "";

    if (category_id === 1) {
      imageUrl = "../../assets/images/formation/mock1.jpg";
    } else if (category_id === 2) {
      imageUrl = "../../assets/images/formation/mock2.png";
    } else if (category_id === 3) {
      imageUrl = "../../assets/images/formation/mock3.jpg";
    } else if (category_id === 4) {
      imageUrl = "../../assets/images/formation/mock4.jpg";
    }

    let formation = await db.formations.create({
      data: {
        title,
        description,
        video,
        difficulty,
        completionTime,
        qualityRating,
        coverImage: imageUrl,
        author: { connect: { id: author_id } },
        category: { connect: { id: category_id } },
      },
    });
    res.status(201).json(formation);
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: "Formation not created" });
  }
};

////////////////////////////////////////
/////////////////PUT////////////////////
////////////////////////////////////////

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
      completionTime,
      qualityRating,
      coverImage,
    } = req.body;

    await db.formations.update({
      where: { id },
      data: {
        title,
        description,
        video,
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
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: "Formation not updated" });
  }
};

////////////////////////////////////////
/////////////////DELETE/////////////////
////////////////////////////////////////

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
