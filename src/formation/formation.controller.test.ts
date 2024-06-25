import request from "supertest";
import { app, db, server } from "../app";
import bcrypt from "bcrypt";
import exp from "constants";

describe("FormationController", () => {
  let formationMock: any;
  let userMock: any;
  let categoryMock: any;
  let chapterMock: any;
  let questionMock: any;
  let answerMock: any;

  beforeAll(async () => {
    await db.$connect();
  });

  afterAll(async () => {
    await db.$disconnect();
    server.close();
  });

  beforeEach(async () => {
    const plainPassword = "Password?24";
    const hashedPassword = await bcrypt.hash(plainPassword, 10);

    userMock = await db.users.create({
      data: {
        firstName: "Ryomen",
        lastName: "Sukuna",
        birthdate: new Date("1990-01-01"),
        password: hashedPassword,
        mail: "ryomen.sukuna@example.com",
        role_id: 1,
        gender: "male",
      },
    });

    categoryMock = await db.categories.create({
      data: {
        name: "Jujutsu sorcery",
        shortName: "Jujutsu",
        description: "This is a test category",
        backgroundImage: "jujutsu.jpg",
      },
    });

    formationMock = await db.formations.create({
      data: {
        title: "Domain Expansion",
        description: "This is a test formation",
        completionTime: 10,
        difficulty: "hard",
        coverImage: "formation1.jpg",
        qualityRating: 5,
        author_id: userMock.id,
        category_id: categoryMock.id,
        isPro: false,
      },
    });

    chapterMock = await db.chapters.create({
      data: {
        formation_id: formationMock.id,
        title: "Simple domain",
        content: "Définition, importance, histoire et évolution",
        chapter_number: 1,
        video: "domain.mp4",
      },
    });

    questionMock = await db.questions.create({
      data: {
        content: "What is 2+2?",
        chapter_id: chapterMock.id,
      },
    });

    answerMock = await db.answers.create({
      data: {
        content: "4",
        valid: true,
        question_id: questionMock.id,
      },
    });
  });

  afterEach(async () => {
    if (formationMock) {
      await db.answers.deleteMany({
        where: { id: answerMock.id },
      });
      await db.questions.deleteMany({
        where: { id: questionMock.id },
      });
      await db.chapters.deleteMany({
        where: { id: chapterMock.id },
      });
      await db.formations.delete({
        where: { id: formationMock.id },
      });
    }

    await db.categories.delete({
      where: { id: categoryMock.id },
    });

    await db.users.delete({
      where: { id: userMock.id },
    });
  });

  describe("listFormations", () => {
    it("should return a list of formations", async () => {
      const res = await request(app).get("/formations/all");
      expect(res.status).toBe(200);
      expect(res.body).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: expect.any(Number),
            author_id: expect.any(Number),
            title: expect.any(String),
            description: expect.any(String),
            category_id: expect.any(Number),
            difficulty: expect.any(String),
            completionTime: expect.any(Number),
            qualityRating: expect.any(Number),
            coverImage: expect.any(String),
            isPro: expect.any(Boolean),
          }),
        ])
      );
    });
  });

  describe("getFormationById", () => {
    it("should return a formation with its chapters, questions, and answers by id", async () => {
      const res = await request(app).get(`/formations/${formationMock.id}`);
      expect(res.status).toBe(200);
      expect(res.body).toEqual({
        id: formationMock.id,
        title: formationMock.title,
        description: formationMock.description,
        difficulty: formationMock.difficulty,
        completionTime: formationMock.completionTime,
        qualityRating: formationMock.qualityRating,
        coverImage: formationMock.coverImage,
        author: `${userMock.firstName} ${userMock.lastName}`,
        category: categoryMock.name,
        chapters: expect.arrayContaining([
          expect.objectContaining({
            id: chapterMock.id,
            title: chapterMock.title,
            questions: expect.arrayContaining([
              expect.objectContaining({
                id: questionMock.id,
                content: questionMock.content,
                answers: expect.arrayContaining([
                  expect.objectContaining({
                    id: answerMock.id,
                    content: answerMock.content,
                    valid: answerMock.valid,
                  }),
                ]),
              }),
            ]),
          }),
        ]),
      });
    });
  });

  describe("getFormationByTitle", () => {
    it("should return a formation by its title", async () => {
      const res = await request(app).get(
        `/formations/title/${encodeURIComponent(formationMock.title)}`
      );
      expect(res.status).toBe(200);
      expect(res.body).toEqual(
        expect.arrayContaining([
          {
            id: formationMock.id,
            title: formationMock.title,
            description: formationMock.description,
            difficulty: formationMock.difficulty,
            completionTime: formationMock.completionTime,
            qualityRating: formationMock.qualityRating,
            coverImage: formationMock.coverImage,
          },
        ])
      );
    });
  });
});
