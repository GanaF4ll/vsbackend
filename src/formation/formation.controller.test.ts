import request from "supertest";
import { app, db, server } from "../app";
import bcrypt from "bcrypt";

describe("FormationController", () => {
  let formationMock: any;
  let userMock: any;
  let categoryMock: any;
  let chapterMock: any;
  let questionMock: any;
  let answerMock: any;
  let token: string;
  let runningServer: any;

  beforeAll(async () => {
    runningServer = server.listen();
    await db.$connect();
    const plainPassword = "Password?24";
    const hashedPassword = await bcrypt.hash(plainPassword, 10);

    userMock = await db.users.create({
      data: {
        firstName: "Ryomen",
        lastName: "Sukuna",
        birthdate: new Date("1990-01-01"),
        password: plainPassword,
        mail: "ryomen.sukuna@example.com",
        role_id: 1,
        gender: "male",
      },
    });

    const loginRes = await request(app).post("/users/login").send({
      mail: userMock.mail,
      password: plainPassword,
    });

    token = loginRes.body.token;
    console.log("res: ", loginRes.body);
    // console.log("Generated token:", token);
    // console.log("userMockmail:", userMock.mail);
    // console.log("password:", hashedPassword);

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

  afterAll(async () => {
    if (formationMock) {
      await db.answers.deleteMany({ where: { question_id: questionMock.id } });
      await db.questions.deleteMany({ where: { chapter_id: chapterMock.id } });
      await db.chapters.deleteMany({
        where: { formation_id: formationMock.id },
      });
      await db.formations.delete({ where: { id: formationMock.id } });
    }

    await db.formations.deleteMany({ where: { category_id: categoryMock.id } });
    await db.categories.delete({ where: { id: categoryMock.id } });

    await db.$disconnect();
    if (runningServer) {
      await new Promise<void>((resolve, reject) => {
        runningServer.close((err: Error) => {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        });
      });
    }
  });

  ////////////////////////////////////////
  /////////////////GET////////////////////
  ////////////////////////////////////////

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
            author_id: userMock.id,
            category_id: categoryMock.id,
          },
        ])
      );
    });
  });

  ////////////////////////////////////////
  /////////////////POST///////////////////
  ////////////////////////////////////////

  describe("createFormation", () => {
    it("should create a new formation", async () => {
      const res = await request(app)
        .post("/formations/add")
        .set("Authorization", `Bearer ${token}`)
        .send({
          author_id: userMock.id,
          title: formationMock.title,
          description: formationMock.description,
          video: formationMock.video,
          category_id: categoryMock.id,
          difficulty: formationMock.difficulty,
          qualityRating: formationMock.qualityRating,
          completionTime: formationMock.completionTime,
          coverImage: formationMock.coverImage,
        });

      expect(res.status).toBe(201);
      expect(res.body).toEqual(
        expect.objectContaining({
          id: expect.any(Number),
          title: formationMock.title,
          description: formationMock.description,
          difficulty: formationMock.difficulty,
          completionTime: formationMock.completionTime,
          qualityRating: formationMock.qualityRating,
          coverImage: expect.any(String),
          author_id: userMock.id,
          category_id: categoryMock.id,
          createdAt: expect.any(String),
          isPro: expect.any(Boolean),
          modifiedAt: expect.any(String),
        })
      );
    });
  });
});
